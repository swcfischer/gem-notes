import { createContext, useContext, useEffect, useState } from "react";
import { readApiResponse } from "../utils/api.js";

export const AuthContext = createContext(null);
const USERS_URL = "/api/users";

async function postAuthRequest(path, values, fallbackMessage) {
  const response = await fetch(`${USERS_URL}/${path}`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  return readApiResponse(response, fallbackMessage);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch(`${USERS_URL}/me`, {
          credentials: "same-origin",
          signal: controller.signal,
        });
        if (response.status === 401) {
          setUser(null);
          return;
        }
        const result = await readApiResponse(
          response,
          "Couldn't verify your account.",
        );
        setUser(result.user);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message || "Couldn't verify your account.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();
    return () => controller.abort();
  }, []);

  async function login(values) {
    const result = await postAuthRequest("login", values, "Couldn't sign in.");
    setUser(result.user);
    setError("");
  }

  async function register(values) {
    const result = await postAuthRequest(
      "register",
      values,
      "Couldn't create your account.",
    );
    setUser(result.user);
    setError("");
  }

  async function logout() {
    const response = await fetch(`${USERS_URL}/logout`, {
      method: "POST",
      credentials: "same-origin",
    });
    if (!response.ok) {
      await readApiResponse(response, "Couldn't sign out.");
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
