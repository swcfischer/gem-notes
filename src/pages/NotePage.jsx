import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useNotes } from "../context/NotesContext.jsx";
import {
  EditorLabel,
  Feedback,
  NavLink,
  NoteForm,
  NoteTextArea,
  NoteTitleInput,
  SaveButton,
  NoteHeader,
  ActionsSelect,
} from "../components/NoteEditor.styles.jsx";

import { IoReturnUpBackSharp } from "react-icons/io5";

const WRITING_PROMPTS = {
  en: { title: "Untitled note", content: "Start writing your note..." },
  es: { title: "Nota sin título", content: "Empieza a escribir tu nota..." },
  fr: {
    title: "Note sans titre",
    content: "Commencez à écrire votre note...",
  },
};

export default function NotePage({ params }) {
  const isNewNote = params.id === "new";
  const [, navigate] = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(!isNewNote);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const noteTextAreaRef = useRef(null);
  const { language } = useLanguage();
  const {
    deleteNote: removeNote,
    getNote,
    saveNote: persistNote,
  } = useNotes();

  useLayoutEffect(() => {
    const textarea = noteTextAreaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 2}px`;
  }, [content, isLoading]);

  useEffect(() => {
    if (isNewNote) {
      setTitle("");
      setContent("");
      setIsLoading(false);
      setError("");
      setSaved(false);
      return undefined;
    }

    const controller = new AbortController();

    async function loadNote() {
      setIsLoading(true);
      setError("");
      setSaved(false);

      try {
        const result = await getNote(params.id, { signal: controller.signal });
        setTitle(result.title);
        setContent(result.content);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message || "Couldn't load this note.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadNote();
    return () => controller.abort();
  }, [getNote, isNewNote, params.id]);

  useEffect(() => {
    if (!isLoading && noteTextAreaRef.current) {
      noteTextAreaRef.current.scrollTop = noteTextAreaRef.current.scrollHeight;
      if (isNewNote) {
        document.getElementById("note-title")?.focus();
      }
    }
  }, [isLoading, params.id]);

  async function saveNote(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setSaved(false);

    try {
      const { note } = await persistNote(isNewNote ? null : params.id, {
        title,
        content,
      });
      if (isNewNote) {
        navigate(`/notes/${note.id}`);
      } else {
        setSaved(true);
      }
    } catch (saveError) {
      setError(saveError.message || "Couldn't save this note.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteNote() {
    if (!window.confirm("Delete this note? This action can't be undone.")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await removeNote(params.id);
      navigate("/");
    } catch (deleteError) {
      setError(deleteError.message || "Couldn't delete this note.");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleActionChange(event) {
    const action = event.currentTarget.value;
    event.currentTarget.value = "";
    if (action === "delete") {
      deleteNote();
    }
  }

  function handleSaveShortcut(event) {
    if (
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      if (!isSaving) {
        saveNote(event);
      }
    }
  }

  return (
    <>
      {/* <Eyebrow>Note</Eyebrow>
      <Heading>{isNewNote ? "New note" : `Note ${params.id}`}</Heading> */}
      <NoteHeader>
        <button
          type="button"
          aria-label="Back to notes"
          onClick={() => navigate("/")}
        >
          <IoReturnUpBackSharp />
        </button>
        <ActionsSelect
          aria-label="Note actions"
          defaultValue=""
          onChange={handleActionChange}
          disabled={isNewNote || isDeleting}
        >
          <option value="" disabled>
            Actions
          </option>
          <option value="edit">Edit note</option>
          <option value="share">Share note</option>
          <option value="duplicate">Duplicate note</option>
          <option value="delete">Delete note</option>
        </ActionsSelect>
      </NoteHeader>
      {isLoading ? (
        <Feedback>Loading note...</Feedback>
      ) : (
        <NoteForm onSubmit={saveNote}>
          <div>
            <EditorLabel htmlFor="note-title">Title</EditorLabel>
            <NoteTitleInput
              id="note-title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={handleSaveShortcut}
              placeholder={WRITING_PROMPTS[language].title}
              maxLength={200}
              lang={language}
              spellCheck="true"
              required
            />
          </div>
          <div>
            <EditorLabel htmlFor="note-content">Note content</EditorLabel>
            <NoteTextArea
              ref={noteTextAreaRef}
              id="note-content"
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onKeyDown={handleSaveShortcut}
              placeholder={WRITING_PROMPTS[language].content}
              lang={language}
              spellCheck="true"
            />
          </div>
          <SaveButton type="submit" disabled={isSaving || isDeleting}>
            {isSaving ? "Saving..." : "Save note"}
          </SaveButton>
          {error && <Feedback role="alert">{error}</Feedback>}
          {saved && <Feedback role="status">Note saved.</Feedback>}
        </NoteForm>
      )}
      <NavLink href="/">Back to all notes</NavLink>
    </>
  );
}
