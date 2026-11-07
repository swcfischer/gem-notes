import { useEffect, useRef, useState } from "react";
import { useDayTree } from "../context/DayTreeContext.jsx";
import { useHomeScrollPosition } from "../context/HomeScrollContext.jsx";
import { useNotes } from "../context/NotesContext.jsx";

import {
  ActionLink,
  DayFolder,
  DayNotes,
  DaySummary,
  Description,
  Eyebrow,
  Feedback,
  Heading,
  NoteListLink,
  NoteTree,
} from "../components/NoteEditor.styles.jsx";

function groupNotesByDay(notes) {
  return notes.reduce((groups, note) => {
    const createdAt = new Date(note.createdAt);
    const day = [
      createdAt.getFullYear(),
      String(createdAt.getMonth() + 1).padStart(2, "0"),
      String(createdAt.getDate()).padStart(2, "0"),
    ].join("-");

    if (!groups.has(day)) {
      groups.set(day, {
        label: createdAt.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        notes: [],
      });
    }

    groups.get(day).notes.push(note);
    return groups;
  }, new Map());
}

export default function HomePage() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { openDays, setDayOpen } = useDayTree();
  const { getNotes } = useNotes();
  const [homeScrollPosition, setHomeScrollPosition] = useHomeScrollPosition();
  const hasRestoredScroll = useRef(false);

  useEffect(() => {
    function saveScrollPosition() {
      setHomeScrollPosition(window.scrollY);
    }

    window.addEventListener("scroll", saveScrollPosition, { passive: true });
    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
    };
  }, [setHomeScrollPosition]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNotes() {
      try {
        const result = await getNotes({ signal: controller.signal });
        setNotes(result);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message || "Couldn't load notes.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadNotes();
    return () => {
      controller.abort();
    };
  }, [getNotes]);

  useEffect(() => {
    if (!isLoading && !hasRestoredScroll.current) {
      window.scrollTo(0, homeScrollPosition);
      hasRestoredScroll.current = true;
    }
  }, [homeScrollPosition, isLoading]);

  const notesByDay = groupNotesByDay(notes);

  return (
    <div style={{ opacity: isLoading ? 0 : 1, transition: "opacity 0.3s" }}>
      <Eyebrow>Gem Notes</Eyebrow>
      <Heading>Your notes in one place.</Heading>
      <Description>
        Create a note or choose one to continue editing.
      </Description>
      <ActionLink href="/notes/new">Create a note</ActionLink>
      {isLoading && <Feedback>Loading notes...</Feedback>}
      {error && <Feedback role="alert">{error}</Feedback>}
      {!isLoading && !error && notes.length === 0 && (
        <Description>You haven't saved any notes yet.</Description>
      )}
      {notes.length > 0 && (
        <NoteTree aria-label="Saved notes by day">
          {[...notesByDay.entries()]
            .sort(([firstDay], [secondDay]) =>
              secondDay.localeCompare(firstDay),
            )
            .map(([day, group]) => (
              <li key={day}>
                <DayFolder
                  open={openDays.has(day)}
                  onToggle={(event) =>
                    setDayOpen(day, event.currentTarget.open)
                  }
                >
                  <DaySummary>{group.label}</DaySummary>
                  <DayNotes>
                    {group.notes.map((note) => (
                      <li key={note.id}>
                        <NoteListLink href={`/notes/${note.id}`}>
                          {note.title}
                        </NoteListLink>
                      </li>
                    ))}
                  </DayNotes>
                </DayFolder>
              </li>
            ))}
        </NoteTree>
      )}
    </div>
  );
}
