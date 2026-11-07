import styled from "@emotion/styled";
import { Link } from "wouter";

export const AppFrame = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  background: var(--color-background);
  color: var(--color-text);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 680px;

  button {
    padding: 0;
    border: 0;
    background: transparent;
    line-height: 0;
    cursor: pointer;
  }

  button:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 3px;
  }

  svg {
    color: #000;
    font-size: 52px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.2);
    /* background: rgba(0, 0, 0, 1); */
    background: var(--color-surface);
    padding: 10px;
    border-radius: 8px;
  }
`;

export const Sidebar = styled.aside`
  padding: 32px 20px;
  border-right: 1px solid var(--color-border);
  background: var(--color-sidebar);

  .gem-icon-link {
    color: var(--color-ink);
    /* color: var(--color-focus); */
    svg.gem-icon {
      margin-right: 6px;
      /* color: var(--color-focus); */
      font-size: 30px;
      position: relative;
    }

    span.gem-icon-text {
      position: relative;
      font-size: 20px;
      font-style: italic;
      font-family: "Cormorant Garamond", serif;
      font-weight: bold;
    }
  }

  @media (max-width: 640px) {
    padding: 20px;
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }
`;

export const Brand = styled(Link)`
  display: block;
  margin: 0 0 36px;
  font-size: 40px;
  /* font-weight: 700; */
  letter-spacing: -0.04em;
  color: var(--color-ink);
  font-style: italic;
  text-decoration: none;
  font-family: "Cormorant Garamond", serif;
  font-weight: bold;

  .active-icon {
    position: relative;
    display: inline-block;
  }

  /* .active-icon::after {
    position: absolute;
    right: 0;
    bottom: 1px;
    left: 0;
    border-bottom: 2px solid currentColor;
    content: "";
  } */
`;

export const Navigation = styled.nav`
  display: grid;
  gap: 8px;
`;

export const Main = styled.main`
  width: min(100%, 960px);
  padding: clamp(28px, 7vw, 72px);
`;

export const AuthFrame = styled.main`
  display: grid;
  align-content: center;
  width: min(100%, 760px);
  min-height: 100vh;
  margin: 0 auto;
  padding: clamp(28px, 7vw, 72px);
`;

export const TextButton = styled.button`
  padding: 8px 0;
  border: 0;
  background: transparent;
  color: var(--color-focus);
  font: inherit;
  text-align: left;
  text-decoration: underline;
  cursor: pointer;
`;

export const SignOutButton = styled.button`
  width: 100%;
  margin-top: 24px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-muted);
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: none;
    background: var(--color-hover);
    color: var(--color-text);
  }
`;

export const EditorLabel = styled.label`
  display: block;
  margin: 0 0 8px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
`;

export const NoteForm = styled.form`
  display: grid;
  gap: 20px;
  max-width: 680px;
  margin: 28px 0;
`;

export const NoteTitleInput = styled.input`
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;

  &::placeholder {
    color: var(--color-placeholder);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const NoteTextArea = styled.textarea`
  display: block;
  width: 100%;
  min-height: 240px;
  padding: 14px 16px;
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  line-height: 1.6;
  resize: none;
  overflow-y: hidden;
  box-sizing: border-box;

  &::placeholder {
    color: var(--color-placeholder);
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const SaveButton = styled.button`
  justify-self: start;
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: var(--color-accent);
  color: var(--color-accent-ink);
  font: inherit;
  font-weight: 600;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
    background: var(--color-accent-hover);
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }
`;

export const Feedback = styled.p`
  margin: 0;
  color: var(--color-focus);
`;

export const NavLink = styled(Link)`
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--color-muted);
  text-decoration: none;

  &:hover,
  &:focus-visible {
    outline: none;
    background: var(--color-hover);
    color: var(--color-text);
  }
  &.gem-icon-link {
    color: var(--color-ink);
    /* color: var(--color-focus); */
    svg.gem-icon {
      margin-right: 6px;
      /* color: var(--color-focus); */
      font-size: 30px;
      position: relative;
    }

    span.gem-icon-text {
      position: relative;
      font-size: 20px;
      font-style: italic;
    }
  }
`;

export const Eyebrow = styled.p`
  margin: 0 0 12px;
  color: var(--color-accent-soft);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Heading = styled.h1`
  margin: 0;
  font-size: clamp(32px, 5vw, 48px);
  letter-spacing: -0.05em;
  color: var(--color-ink);
  font-style: italic;
`;

export const Description = styled.p`
  max-width: 520px;
  margin: 16px 0 28px;
  color: var(--color-muted-strong);
  line-height: 1.6;
`;

export const NoteTree = styled.ul`
  display: grid;
  gap: 8px;
  max-width: 680px;
  margin: 32px 0 0;
  padding: 0;
  list-style: none;
`;

export const SettingsForm = styled.div`
  display: grid;
  gap: 20px;
  max-width: 680px;
  margin: 28px 0;
`;

export const LanguageSelect = styled.select`
  display: block;
  width: min(100%, 360px);
  min-height: 46px;
  padding: 10px 14px;
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const ActionsSelect = styled.select`
  appearance: none;
  min-height: 44px;
  padding: 8px 34px 8px 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: 8px;
  border: none;
  background: var(--color-surface);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='m1 1 5 5 5-5' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  color: rgba(0, 0, 0, 0.6);
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  width: 100px;

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const NoteSelect = styled(LanguageSelect)`
  width: 100%;
  max-width: 680px;
`;

export const NotePreview = styled.div`
  max-width: 680px;
  max-height: 180px;
  overflow: auto;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-muted-strong);
  line-height: 1.6;
  scrollbar-color: var(--color-scroll-thumb) var(--color-deep-surface);
  white-space: pre-wrap;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 8px;
    background: var(--color-deep-surface);
  }

  &::-webkit-scrollbar-thumb {
    border: 3px solid var(--color-deep-surface);
    border-radius: 8px;
    background: var(--color-scroll-thumb);
  }
`;

export const FeatureGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 210px), 1fr));
  gap: 16px;
  max-width: 900px;
  margin: 32px 0;
`;

export const FeatureCard = styled(Link)`
  display: flex;
  min-height: 190px;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-surface);
  color: inherit;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
    background: var(--color-surface-hover);
  }

  h2 {
    margin: 0;
    color: var(--color-text);
    font-size: 19px;
  }

  p {
    margin: 12px 0 20px;
    color: var(--color-muted-strong);
    line-height: 1.5;
  }
`;

export const FeatureStatus = styled.span`
  margin-top: auto;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--color-deep-surface);
  color: var(--color-focus);
  font-size: 13px;
  font-weight: 600;
`;

export const NoteChoiceList = styled.div`
  display: grid;
  gap: 8px;
  max-width: 680px;
`;

export const NoteChoice = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;

  &:has(input:checked) {
    border-color: var(--color-accent);
    background: var(--color-surface-hover);
  }

  &:focus-within {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const NoteChoiceInput = styled.input`
  margin: 4px 0 0;
  accent-color: var(--color-accent);
`;

export const FeatureAction = styled.button`
  justify-self: start;
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  background: var(--color-deep-surface);
  color: var(--color-focus);
  font: inherit;
  font-weight: 600;
  cursor: not-allowed;
  opacity: 0.8;
`;

export const DayFolder = styled.details`
  /* border: 1px solid #a84350; */
  border-radius: 8px;
`;

export const DaySummary = styled.summary`
  padding: 14px 16px;
  border-radius: 8px;
  color: var(--color-text);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
    background: var(--color-hover);
  }
`;

export const DayNotes = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 12px 12px 12px 32px;
  list-style: none;
`;

export const NoteListLink = styled(Link)`
  display: block;
  padding: 14px 16px;
  /* border: 1px solid #a84350; */
  border-radius: 8px;
  color: var(--color-text);
  text-decoration: none;

  &:hover,
  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
    background: var(--color-hover);
  }
`;

export const ActionLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 8px;
  background: var(--color-accent);
  color: var(--color-accent-ink);
  font-weight: 600;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
    background: var(--color-accent-hover);
  }
`;
