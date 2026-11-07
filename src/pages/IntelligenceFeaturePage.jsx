import { useEffect, useState } from "react";
import { LANGUAGES, useLanguage } from "../context/LanguageContext.jsx";
import { useNotes } from "../context/NotesContext.jsx";
import {
  ActionLink,
  Description,
  EditorLabel,
  Eyebrow,
  FeatureAction,
  Feedback,
  Heading,
  NoteChoice,
  NoteChoiceInput,
  NoteChoiceList,
  NotePreview,
  NoteSelect,
  NoteTextArea,
  SettingsForm,
} from "../components/NoteEditor.styles.jsx";

const FEATURES = {
  timeline: {
    title: "View your notes over time",
    description: "See how your notes have evolved and connected.",
    selection: "many",
    action: "View timeline",
    output: "A timeline of your selected notes will appear here.",
  },
  discuss: {
    title: "Discuss your notes with AI",
    description: "Have a conversation with your notes using AI.",
    selection: "many",
    action: "Discuss your notes",
    output: "A conversation grounded in your selected notes will appear here.",
  },
  ask: {
    title: "Ask your notes using AI",
    description: "Get answers grounded in what you've written.",
    selection: "many",
    action: "Ask your notes",
    output: "An answer grounded in your selected notes will appear here.",
  },
};

export default function IntelligenceFeaturePage({ params }) {
  const feature = FEATURES[params.feature];
  const [notes, setNotes] = useState([]);
  const [selectedNoteIds, setSelectedNoteIds] = useState([]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { language } = useLanguage();
  const { getNotes } = useNotes();
  const languageName =
    LANGUAGES.find(({ code }) => code === language)?.name ?? language;
  const selectedNotes = notes.filter((note) =>
    selectedNoteIds.includes(String(note.id)),
  );

  useEffect(() => {
    if (!feature) return undefined;

    const controller = new AbortController();

    async function loadNotes() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getNotes({ signal: controller.signal });
        setNotes(result);
        setSelectedNoteIds(result[0] ? [String(result[0].id)] : []);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError.message || "Couldn't load notes for Intelligence.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadNotes();
    return () => controller.abort();
  }, [feature, getNotes]);

  if (!feature) {
    return (
      <>
        <Eyebrow>Gem Notes AI</Eyebrow>
        <Heading>Feature not found</Heading>
        <Description>
          Choose an Intelligence feature to get started.
        </Description>
        <ActionLink href="/intelligence">Back to Intelligence</ActionLink>
      </>
    );
  }

  function setNoteSelected(noteId, isSelected) {
    setSelectedNoteIds((current) => {
      if (feature.selection === "one") {
        return isSelected ? [noteId] : current;
      }

      return isSelected
        ? [...current, noteId]
        : current.filter((id) => id !== noteId);
    });
  }

  return (
    <>
      <Eyebrow>Gem Notes AI</Eyebrow>
      <Heading>{feature.title}</Heading>
      <Description>
        {feature.description} Responses are set to {languageName}.
      </Description>
      <ActionLink href="/intelligence">All Intelligence features</ActionLink>

      {isLoading && <Feedback>Loading your notes...</Feedback>}
      {error && <Feedback role="alert">{error}</Feedback>}
      {!isLoading && !error && notes.length === 0 && (
        <Feedback>
          Save a note first and it will be ready to use with Intelligence.
        </Feedback>
      )}
      {!isLoading && !error && notes.length > 0 && (
        <SettingsForm>
          <div>
            <EditorLabel>
              {feature.selection === "one"
                ? "Choose a note"
                : "Choose notes to use"}
            </EditorLabel>
            {feature.selection === "one" ? (
              <NoteSelect
                aria-label="Choose a note"
                value={selectedNoteIds[0] ?? ""}
                onChange={(event) => setSelectedNoteIds([event.target.value])}
              >
                {notes.map((note) => (
                  <option key={note.id} value={String(note.id)}>
                    {note.title}
                  </option>
                ))}
              </NoteSelect>
            ) : (
              <NoteChoiceList>
                {notes.map((note) => {
                  const noteId = String(note.id);
                  return (
                    <NoteChoice key={note.id}>
                      <NoteChoiceInput
                        type="checkbox"
                        checked={selectedNoteIds.includes(noteId)}
                        onChange={(event) =>
                          setNoteSelected(noteId, event.target.checked)
                        }
                      />
                      {note.title}
                    </NoteChoice>
                  );
                })}
              </NoteChoiceList>
            )}
          </div>

          {feature.selection === "many" && selectedNoteIds.length === 0 && (
            <Feedback>Select at least one note to continue.</Feedback>
          )}

          {feature.selection === "many" &&
            selectedNotes.map((note) => (
              <div key={note.id}>
                <EditorLabel>{note.title}</EditorLabel>
                <NotePreview>
                  {note.content || "This note doesn't have any content yet."}
                </NotePreview>
              </div>
            ))}

          {feature.selection === "one" && selectedNotes[0] && (
            <NotePreview>
              {selectedNotes[0].content ||
                "This note doesn't have any content yet."}
            </NotePreview>
          )}

          {params.feature === "ask" && (
            <div>
              <EditorLabel htmlFor="notes-question">
                What would you like to know?
              </EditorLabel>
              <NoteTextArea
                id="notes-question"
                name="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask a question about your selected notes"
              />
            </div>
          )}

          <div>
            <FeatureAction type="button" disabled>
              {feature.action} — coming soon
            </FeatureAction>
            <Feedback role="status">
              AI processing isn't connected yet. Your selected notes aren't
              sent to an AI service.
            </Feedback>
          </div>
          <div>
            <EditorLabel>Preview</EditorLabel>
            <NotePreview>{feature.output}</NotePreview>
          </div>
        </SettingsForm>
      )}
    </>
  );
}
