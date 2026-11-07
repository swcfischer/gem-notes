import { Route, Router, Switch } from "wouter";

import HomePage from "./pages/HomePage.jsx";
import NotePage from "./pages/NotePage.jsx";
import IntelligencePage from "./pages/IntelligencePage.jsx";
import IntelligenceFeaturePage from "./pages/IntelligenceFeaturePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

import Sidebar from "./components/Sidebar.jsx";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import {
  AppearanceProvider,
  useAppearance,
} from "./context/AppearanceContext.jsx";
import { DayTreeProvider } from "./context/DayTreeContext.jsx";
import { HomeScrollProvider } from "./context/HomeScrollContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { NotesProvider, useNotes } from "./context/NotesContext.jsx";

import {
  ActionLink,
  AuthFrame,
  AppFrame,
  Description,
  Eyebrow,
  Feedback,
  Heading,
  Main,
} from "./components/NoteEditor.styles.jsx";

function NotFoundPage() {
  return (
    <>
      <Eyebrow>Page not found</Eyebrow>
      <Heading>We couldn't find that page.</Heading>
      <Description>Try heading back to your notes.</Description>
      <ActionLink href="/">Go to notes</ActionLink>
    </>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <AuthFrame>
        <Feedback>Checking your account...</Feedback>
      </AuthFrame>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <AppearanceProvider>
      <DayTreeProvider>
        <HomeScrollProvider>
          <LanguageProvider>
            <NotesProvider>
              <ThemedApp />
            </NotesProvider>
          </LanguageProvider>
        </HomeScrollProvider>
      </DayTreeProvider>
    </AppearanceProvider>
  );
}

function ThemedApp() {
  const { theme } = useAppearance();
  const { apiSyncError } = useNotes();

  return (
    <AppFrame data-theme={theme.id}>
      <Sidebar />
      <Main>
        {apiSyncError && <Feedback role="alert">{apiSyncError}</Feedback>}
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/intelligence" component={IntelligencePage} />
          <Route
            path="/intelligence/:feature"
            component={IntelligenceFeaturePage}
          />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/notes/:id" component={NotePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Main>
    </AppFrame>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
