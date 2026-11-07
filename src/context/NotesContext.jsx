import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { readApiResponse } from "../utils/api.js";

const NOTES_URL = "/api/notes";
const SYNC_STORAGE_PREFIX = "gem-notes-api-sync";
const NOTES_STORAGE_PREFIX = "gem-notes-notes";
const NotesContext = createContext(null);

function getSyncStorageKey(userId) {
  return `${SYNC_STORAGE_PREFIX}:${userId}`;
}

function getNotesStorageKey(userId) {
  return `${NOTES_STORAGE_PREFIX}:${userId}`;
}

function readLocalNotes(storageKey) {
  const storedNotes = localStorage.getItem(storageKey);
  if (!storedNotes) {
    return [];
  }

  const notes = JSON.parse(storedNotes);
  if (
    !Array.isArray(notes) ||
    notes.some(
      (note) =>
        !note ||
        typeof note.id !== "string" ||
        typeof note.title !== "string" ||
        typeof note.content !== "string",
    )
  ) {
    throw new Error("Saved notes have an invalid format.");
  }
  return notes;
}

function writeLocalNotes(storageKey, notes) {
  localStorage.setItem(storageKey, JSON.stringify(notes));
}

function fromApiNote(note, existingNote) {
  return {
    id: existingNote?.id ?? `server-${note.id}`,
    serverId: note.id,
    title: note.title,
    content: note.content ?? "",
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

function mergeNotes(localNotes, apiNotes) {
  const mergedNotes = [...localNotes];

  for (const apiNote of apiNotes) {
    const index = mergedNotes.findIndex(
      (note) => String(note.serverId) === String(apiNote.id),
    );
    const existingNote = index === -1 ? undefined : mergedNotes[index];
    const localIsNewer =
      existingNote &&
      new Date(existingNote.updatedAt).getTime() >
        new Date(apiNote.updatedAt).getTime();

    if (existingNote && localIsNewer) {
      continue;
    }

    const mergedNote = fromApiNote(apiNote, existingNote);
    if (index === -1) {
      mergedNotes.push(mergedNote);
    } else {
      mergedNotes[index] = mergedNote;
    }
  }

  return mergedNotes;
}

function sortNotes(notes) {
  return [...notes].sort(
    (first, second) =>
      new Date(second.updatedAt).getTime() -
      new Date(first.updatedAt).getTime(),
  );
}

async function fetchApiNotes(signal) {
  const response = await fetch(NOTES_URL, { signal });
  return readApiResponse(response, "Couldn't load notes for API sync.");
}

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const notesStorageKey = getNotesStorageKey(user.id);
  const syncStorageKey = getSyncStorageKey(user.id);
  const [syncSettings, setSyncSettings] = useState(() => {
    try {
      return {
        enabled: localStorage.getItem(syncStorageKey) === "true",
        error: "",
      };
    } catch {
      return {
        enabled: false,
        error: "Couldn't read the API sync preference in this browser.",
      };
    }
  });

  function reportSyncError(error) {
    const message = error.message || "Couldn't sync notes with the API.";
    setSyncSettings((current) =>
      current.error === message ? current : { ...current, error: message },
    );
  }

  function clearSyncError() {
    setSyncSettings((current) =>
      current.error ? { ...current, error: "" } : current,
    );
  }

  async function getNotes({ signal } = {}) {
    const localNotes = readLocalNotes(notesStorageKey);
    if (!syncSettings.enabled) {
      return sortNotes(localNotes);
    }

    let mergedNotes = localNotes;
    try {
      const apiNotes = await fetchApiNotes(signal);
      mergedNotes = mergeNotes(localNotes, apiNotes);
      writeLocalNotes(notesStorageKey, mergedNotes);

      for (let note of [...mergedNotes]) {
        const apiNote = apiNotes.find(
          (candidate) => String(candidate.id) === String(note.serverId),
        );
        if (note.serverId && !apiNote) {
          const localNote = { ...note, serverId: null };
          mergedNotes = mergedNotes.map((current) =>
            current.id === note.id ? localNote : current,
          );
          writeLocalNotes(notesStorageKey, mergedNotes);
          note = localNote;
        }
        if (note.serverId && apiNote) {
          if (
            new Date(note.updatedAt).getTime() <=
            new Date(apiNote.updatedAt).getTime()
          ) {
            continue;
          }
        }

        const response = await fetch(
          note.serverId
            ? `${NOTES_URL}/${encodeURIComponent(note.serverId)}`
            : NOTES_URL,
          {
            method: note.serverId ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: note.title,
              content: note.content,
            }),
            signal,
          },
        );
        const result = await readApiResponse(
          response,
          "Couldn't sync a locally updated note.",
        );
        mergedNotes = mergedNotes.map((current) =>
          current.id === note.id ? fromApiNote(result, current) : current,
        );
        writeLocalNotes(notesStorageKey, mergedNotes);
      }
      clearSyncError();
    } catch (error) {
      if (signal?.aborted) {
        return sortNotes(readLocalNotes(notesStorageKey));
      }
      reportSyncError(error);
      return sortNotes(readLocalNotes(notesStorageKey));
    }

    return sortNotes(mergedNotes);
  }

  async function getNote(noteId, { signal } = {}) {
    let notes = readLocalNotes(notesStorageKey);
    let note = notes.find((candidate) => candidate.id === noteId);

    if (!note && syncSettings.enabled) {
      notes = await getNotes({ signal });
      note = notes.find((candidate) => candidate.id === noteId);
    }
    if (!note || !syncSettings.enabled) {
      if (!note) {
        throw new Error("Couldn't find this note on this device.");
      }
      return note;
    }

    try {
      const response = await fetch(
        note.serverId
          ? `${NOTES_URL}/${encodeURIComponent(note.serverId)}`
          : NOTES_URL,
        {
          ...(note.serverId
            ? { signal }
            : {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: note.title,
                  content: note.content,
                }),
                signal,
              }),
        },
      );
      const result = await readApiResponse(
        response,
        note.serverId ? "Couldn't load this note." : "Couldn't sync this note.",
      );
      let updatedNote = fromApiNote(result, note);
      if (
        note.serverId &&
        new Date(note.updatedAt).getTime() >
          new Date(result.updatedAt).getTime()
      ) {
        const updateResponse = await fetch(
          `${NOTES_URL}/${encodeURIComponent(note.serverId)}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: note.title, content: note.content }),
            signal,
          },
        );
        const updatedResult = await readApiResponse(
          updateResponse,
          "Couldn't sync a locally updated note.",
        );
        updatedNote = fromApiNote(updatedResult, note);
      }
      const mergedNotes = notes.map((current) =>
        current.id === note.id ? updatedNote : current,
      );
      writeLocalNotes(notesStorageKey, mergedNotes);
      clearSyncError();
      return updatedNote;
    } catch (error) {
      if (signal?.aborted) {
        return note;
      }
      reportSyncError(error);
      return note;
    }
  }

  async function saveNote(noteId, values) {
    const notes = readLocalNotes(notesStorageKey);
    const now = new Date().toISOString();
    const existingNote = noteId
      ? notes.find((note) => note.id === noteId)
      : undefined;
    if (noteId && !existingNote) {
      throw new Error("Couldn't find this note on this device.");
    }

    const localNote = {
      id: existingNote?.id ?? `local-${crypto.randomUUID()}`,
      serverId: existingNote?.serverId ?? null,
      title: values.title.trim(),
      content: values.content ?? "",
      createdAt: existingNote?.createdAt ?? now,
      updatedAt: now,
    };
    const updatedNotes = existingNote
      ? notes.map((note) => (note.id === noteId ? localNote : note))
      : [...notes, localNote];

    writeLocalNotes(notesStorageKey, updatedNotes);
    if (!syncSettings.enabled) {
      return { note: localNote, syncError: "" };
    }

    try {
      const isUpdate = Boolean(localNote.serverId);
      const response = await fetch(
        isUpdate
          ? `${NOTES_URL}/${encodeURIComponent(localNote.serverId)}`
          : NOTES_URL,
        {
          method: isUpdate ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: localNote.title,
            content: localNote.content,
          }),
        },
      );
      const result = await readApiResponse(
        response,
        "Couldn't sync this note.",
      );
      const syncedNote = fromApiNote(result, localNote);
      writeLocalNotes(
        notesStorageKey,
        updatedNotes.map((note) =>
          note.id === syncedNote.id ? syncedNote : note,
        ),
      );
      clearSyncError();
      return { note: syncedNote, syncError: "" };
    } catch (error) {
      const syncError = `Note saved on this device, but API sync failed: ${error.message}`;
      reportSyncError(new Error(syncError));
      return { note: localNote, syncError };
    }
  }

  async function deleteNote(noteId) {
    const notes = readLocalNotes(notesStorageKey);
    const note = notes.find((candidate) => candidate.id === noteId);
    if (!note) {
      throw new Error("Couldn't find this note on this device.");
    }

    if (syncSettings.enabled && note.serverId) {
      const response = await fetch(
        `${NOTES_URL}/${encodeURIComponent(note.serverId)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        await readApiResponse(response, "Couldn't delete this note.");
      }
    }

    writeLocalNotes(
      notesStorageKey,
      notes.filter((candidate) => candidate.id !== noteId),
    );
  }

  async function setApiSyncEnabled(enabled) {
    if (enabled === syncSettings.enabled) {
      return;
    }

    try {
      if (enabled) {
        const apiNotes = await fetchApiNotes();
        let notes = mergeNotes(readLocalNotes(notesStorageKey), apiNotes);
        writeLocalNotes(notesStorageKey, notes);

        for (let index = 0; index < notes.length; index += 1) {
          let note = notes[index];
          const apiNote = apiNotes.find(
            (candidate) => String(candidate.id) === String(note.serverId),
          );
          if (note.serverId && !apiNote) {
            note = { ...note, serverId: null };
            notes[index] = note;
            writeLocalNotes(notesStorageKey, notes);
          }
          if (
            note.serverId &&
            new Date(note.updatedAt).getTime() <=
              new Date(apiNote.updatedAt).getTime()
          ) {
            continue;
          }
          const response = await fetch(
            note.serverId
              ? `${NOTES_URL}/${encodeURIComponent(note.serverId)}`
              : NOTES_URL,
            {
              method: note.serverId ? "PATCH" : "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                title: note.title,
                content: note.content,
              }),
            },
          );
          const result = await readApiResponse(
            response,
            note.serverId
              ? "Couldn't sync a locally updated note."
              : "Couldn't upload a note to API sync.",
          );
          const syncedNote = fromApiNote(result, note);
          notes = notes.map((current) =>
            current.id === syncedNote.id ? syncedNote : current,
          );
          writeLocalNotes(notesStorageKey, notes);
        }
      }

      localStorage.setItem(syncStorageKey, String(enabled));
      setSyncSettings({ enabled, error: "" });
    } catch (error) {
      setSyncSettings((current) => ({
        ...current,
        error: error.message || "Couldn't update API sync.",
      }));
    }
  }

  return (
    <NotesContext.Provider
      value={{
        apiSyncEnabled: syncSettings.enabled,
        apiSyncError: syncSettings.error,
        setApiSyncEnabled,
        getNotes,
        getNote,
        saveNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider.");
  }
  return context;
}
