import { useState } from "react";
import { ImDiamonds } from "react-icons/im";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext.jsx";

import {
  Brand,
  Feedback,
  Navigation,
  NavLink,
  SignOutButton,
  Sidebar as StyledSidebar,
} from "./NoteEditor.styles.jsx";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [error, setError] = useState("");

  async function handleSignOut() {
    setError("");
    try {
      await logout();
    } catch (logoutError) {
      setError(logoutError.message || "Couldn't sign out.");
    }
  }

  return (
    <StyledSidebar>
      <Brand href="/">
        <span className={location === "/" ? "active-icon" : undefined}>
          <ImDiamonds style={{ position: "relative", top: 3 }} />
        </span>
        Notes
      </Brand>
      <Navigation aria-label="Main navigation">
        <NavLink href="/">All notes</NavLink>
        <NavLink href="/notes/new">New note</NavLink>
        <NavLink className="gem-icon-link" href="/intelligence">
          {/* <GiGems className="gem-icon" />{" "} */}
          <span className="gem-icon-text">Intelligence</span>
        </NavLink>
        <NavLink className="gem-icon-link" href="/settings">
          {/* <CiSettings className="gem-icon" />{" "} */}
          <span className="gem-icon-text">Settings</span>
        </NavLink>
      </Navigation>
      <p>{user.name}</p>
      <SignOutButton type="button" onClick={handleSignOut}>
        Sign out
      </SignOutButton>
      {error && <Feedback role="alert">{error}</Feedback>}
    </StyledSidebar>
  );
}
