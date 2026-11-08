import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  AuthFrame,
  Description,
  EditorLabel,
  Eyebrow,
  Feedback,
  Heading,
  LanguageSelect,
  NoteTitleInput,
  NoteForm,
  SaveButton,
  TextButton,
} from "../components/NoteEditor.styles.jsx";

export default function AuthPage() {
  const { accounts, login, register, error: authError } = useAuth();

  const [isRegistering, setIsRegistering] = useState(accounts.length === 0);
  const [name, setName] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!accounts.some((account) => account.id === accountId)) {
      setAccountId(accounts[0]?.id ?? "");
    }
  }, [accounts, accountId]);

  async function submit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isRegistering) {
        await register({ name });
      } else {
        await login({ id: accountId });
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
          ? "Create a local profile to keep notes on this device. No email or password is collected."
          : "Choose a local profile to continue to its notes."}
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
        {!isRegistering && (
          <div>
            <EditorLabel htmlFor="account-profile">Local profile</EditorLabel>
            <LanguageSelect
              id="account-profile"
              value={accountId}
              onChange={(event) => setAccountId(event.target.value)}
              required
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </LanguageSelect>
          </div>
        )}
        <SaveButton type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Please wait..."
            : isRegistering
              ? "Create profile"
              : "Continue"}
        </SaveButton>
        {(error || authError) && (
          <Feedback role="alert">{error || authError}</Feedback>
        )}
      </NoteForm>
      {accounts.length > 0 && (
        <TextButton
          type="button"
          onClick={() => {
            setIsRegistering((current) => !current);
            setError("");
          }}
        >
          {isRegistering ? "Choose an existing profile" : "Create a profile"}
        </TextButton>
      )}
    </AuthFrame>
  );
}
