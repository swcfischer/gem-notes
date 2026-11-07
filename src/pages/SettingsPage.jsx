import { APP_THEMES, useAppearance } from "../context/AppearanceContext.jsx";
import { useLanguage, LANGUAGES } from "../context/LanguageContext.jsx";
import { useNotes } from "../context/NotesContext.jsx";
import {
  Description,
  EditorLabel,
  Eyebrow,
  Feedback,
  Heading,
  LanguageSelect,
  SettingsForm,
} from "../components/NoteEditor.styles.jsx";

export default function SettingsPage() {
  const { language, languageError, setLanguage } = useLanguage();
  const { setTheme, theme, themeError } = useAppearance();
  const { apiSyncEnabled, setApiSyncEnabled } = useNotes();

  return (
    <>
      <Eyebrow>Preferences</Eyebrow>
      <Heading>Settings</Heading>
      <Description>
        Choose the language used for AI responses and writing prompts in your
        note editor.
      </Description>
      <SettingsForm>
        <section className="sync-settings" aria-labelledby="sync-heading">
          <h2 id="sync-heading">Note storage</h2>
          <p>
            Notes are stored in this browser by default. Turn on API sync to
            also save them to your account.
          </p>
          <label className="api-sync-option">
            <input
              type="checkbox"
              checked={apiSyncEnabled}
              onChange={(event) => setApiSyncEnabled(event.target.checked)}
            />
            <span>
              <strong>Sync notes with the API</strong>
              <small>
                {apiSyncEnabled
                  ? "Notes are saved on this device and your account."
                  : "Notes stay on this device and aren't sent to the notes API."}
              </small>
            </span>
          </label>
        </section>
        <div>
          <EditorLabel htmlFor="preferred-language">
            Preferred language
          </EditorLabel>
          <LanguageSelect
            id="preferred-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {LANGUAGES.map(({ code, name }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
            <option disabled>More to come</option>
          </LanguageSelect>
        </div>
        <Feedback role={languageError ? "alert" : "status"}>
          {languageError || "Your preference is saved on this device."}
        </Feedback>
        <section
          className="appearance-settings"
          aria-labelledby="appearance-heading"
        >
          <h2 id="appearance-heading">Appearance</h2>
          <p>Choose a color theme for the entire application.</p>
          <fieldset className="theme-picker">
            <legend>Application color theme</legend>
            {APP_THEMES.map(({ description, id, name }) => (
              <label className="theme-option" data-theme-choice={id} key={id}>
                <input
                  type="radio"
                  name="application-color-theme"
                  value={id}
                  checked={theme.id === id}
                  onChange={() => setTheme(id)}
                />
                <span className="theme-swatch" aria-hidden="true" />
                <span className="theme-option-copy">
                  <strong>{name}</strong>
                  <small>{description}</small>
                </span>
              </label>
            ))}
          </fieldset>
          <Feedback role={themeError ? "alert" : "status"}>
            {themeError || "Your color theme is saved on this device."}
          </Feedback>
        </section>
      </SettingsForm>
    </>
  );
}
