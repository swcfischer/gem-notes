import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  AuthFrame,
  Description,
  EditorLabel,
  Eyebrow,
  Feedback,
  Heading,
  NoteTitleInput,
  NoteForm,
  SaveButton,
  TextButton,
} from "../components/NoteEditor.styles.jsx";

export default function AuthPage() {
  const { login, register, error: serverError } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isRegistering) {
        await register({ name, email, password });
      } else {
        await login({ email, password });
      }
    } catch (submitError) {
      setError(submitError.message || "Couldn't authenticate.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFrame>
      <Eyebrow>Gem Notes</Eyebrow>
      <Heading>
        {isRegistering ? "Create your account" : "Welcome back"}
      </Heading>
      <Description>
        {isRegistering
          ? "Sign up to keep your notes private and available to you."
          : "Sign in to continue to your notes."}
      </Description>
      <NoteForm onSubmit={submit}>
        {isRegistering && (
          <div>
            <EditorLabel htmlFor="account-name">Name</EditorLabel>
            <NoteTitleInput
              id="account-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
            />
          </div>
        )}
        <div>
          <EditorLabel htmlFor="account-email">Email</EditorLabel>
          <NoteTitleInput
            id="account-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div>
          <EditorLabel htmlFor="account-password">Password</EditorLabel>
          <NoteTitleInput
            id="account-password"
            name="password"
            type="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            maxLength={128}
            required
          />
        </div>
        <SaveButton type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : isRegistering
              ? "Create account"
              : "Sign in"}
        </SaveButton>
        {(error || serverError) && (
          <Feedback role="alert">{error || serverError}</Feedback>
        )}
      </NoteForm>
      <TextButton
        type="button"
        onClick={() => {
          setIsRegistering((current) => !current);
          setError("");
        }}
      >
        {isRegistering
          ? "Already have an account? Sign in"
          : "New to Gem Notes? Create an account"}
      </TextButton>
    </AuthFrame>
  );
}
