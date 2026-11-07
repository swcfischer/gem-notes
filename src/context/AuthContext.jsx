import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

const ACCOUNTS_STORAGE_KEY = "gem-notes-accounts";
const ACTIVE_ACCOUNT_STORAGE_KEY = "gem-notes-active-account";

function readAccounts() {
  const storedAccounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!storedAccounts) {
    return [];
  }

  const accounts = JSON.parse(storedAccounts);
  if (
    !Array.isArray(accounts) ||
    accounts.some(
      (account) =>
        !account ||
        typeof account.id !== "string" ||
        typeof account.name !== "string",
    )
  ) {
    throw new Error("Saved accounts have an invalid format.");
  }

  return accounts.map(({ id, name }) => ({ id, name }));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedAccounts = readAccounts();
      const activeAccountId = localStorage.getItem(ACTIVE_ACCOUNT_STORAGE_KEY);
      setAccounts(savedAccounts);
      setUser(
        savedAccounts.find((account) => account.id === activeAccountId) ?? null,
      );
    } catch (loadError) {
      setError(loadError.message || "Couldn't load your local account.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  async function register({ name }) {
    const trimmedName = typeof name === "string" ? name.trim() : "";
    if (!trimmedName || trimmedName.length > 100) {
      throw new Error("Enter a name up to 100 characters long.");
    }

    const account = { id: crypto.randomUUID(), name: trimmedName };
    const updatedAccounts = [...accounts, account];
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(updatedAccounts));
    localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, account.id);
    setAccounts(updatedAccounts);
    setUser(account);
    setError("");
  }

  async function login({ id }) {
    const account = accounts.find((savedAccount) => savedAccount.id === id);
    if (!account) {
      throw new Error("Select an account saved on this device.");
    }

    localStorage.setItem(ACTIVE_ACCOUNT_STORAGE_KEY, account.id);
    setUser(account);
    setError("");
  }

  async function logout() {
    localStorage.removeItem(ACTIVE_ACCOUNT_STORAGE_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, accounts, isLoading, error, login, register, logout }}
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
