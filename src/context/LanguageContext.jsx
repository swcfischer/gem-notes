import { createContext, useContext, useState } from "react";

const LANGUAGE_STORAGE_KEY = "gem-notes-language";
export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "gr", name: "Ελληνικά" },
];

const LanguageContext = createContext(null);

function getInitialSettings() {
  try {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const language = LANGUAGES.some(({ code }) => code === storedLanguage)
      ? storedLanguage
      : "en";
    return { language, error: "" };
  } catch {
    return {
      language: "en",
      error: "Couldn't read your saved language preference.",
    };
  }
}

export function LanguageProvider({ children }) {
  const [settings, setSettings] = useState(getInitialSettings);

  function updateLanguage(language) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setSettings({ language, error: "" });
    } catch {
      setSettings((current) => ({
        ...current,
        error: "Couldn't save your language preference in this browser.",
      }));
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        language: settings.language,
        languageError: settings.error,
        setLanguage: updateLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider.");
  }
  return context;
}
