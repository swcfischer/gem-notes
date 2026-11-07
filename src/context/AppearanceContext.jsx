import { createContext, useContext, useState } from "react";

const APPEARANCE_STORAGE_KEY = "gem-notes-appearance";

export const APP_THEMES = [
  { id: "ruby", name: "Ruby", description: "Warm and bold" },
  { id: "ocean", name: "Ocean", description: "Cool and calm" },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description: "Olive-tinted sand",
  },
  { id: "forest", name: "Forest", description: "Natural and grounded" },
  { id: "slate", name: "Slate", description: "Quiet and classic" },
  { id: "lavender", name: "Lavender", description: "Soft and expressive" },
  { id: "sand", name: "Sand", description: "Earthy and bright" },
  { id: "espresso", name: "Expresso", description: "Rich and warm" },
  { id: "midnight", name: "Midnight", description: "Deep and dramatic" },
  { id: "iron", name: "Iron", description: "Bold, rugged, and understated" },
  { id: "cobalt", name: "Cobalt", description: "Vivid and confident" },
  { id: "onyx", name: "Onyx", description: "Classic near-black" },
  { id: "carbon", name: "Carbon", description: "Smoky charcoal with amber" },
  { id: "raven", name: "Raven", description: "Black with a cool violet edge" },
];

const DEFAULT_THEME = APP_THEMES[0];
const AppearanceContext = createContext(null);

function getInitialAppearance() {
  try {
    const storedTheme = localStorage.getItem(APPEARANCE_STORAGE_KEY);
    const theme =
      APP_THEMES.find(({ id }) => id === storedTheme) ?? DEFAULT_THEME;
    return { theme, error: "" };
  } catch {
    return {
      theme: DEFAULT_THEME,
      error: "Couldn't read your saved color theme.",
    };
  }
}

export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState(getInitialAppearance);

  function updateTheme(themeId) {
    const theme = APP_THEMES.find(({ id }) => id === themeId);
    if (!theme) {
      return;
    }

    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, theme.id);
      setAppearance({ theme, error: "" });
    } catch {
      setAppearance({
        theme,
        error: "Couldn't save your color theme in this browser.",
      });
    }
  }

  return (
    <AppearanceContext.Provider
      value={{
        theme: appearance.theme,
        themeError: appearance.error,
        setTheme: updateTheme,
      }}
    >
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) {
    throw new Error("useAppearance must be used within an AppearanceProvider.");
  }
  return context;
}
