import { createContext, useCallback, useContext, useState } from 'react';

/**
 * DEMO AUTH (frontend only). Accounts live in this browser's localStorage and
 * passwords are stored as a salted SHA-256 hash. Replace signUp/signIn with real
 * API calls (and httpOnly session cookies) when the backend is ready.
 */
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const USERS = 'veloop-users';
const SESSION = 'veloop-session';
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } };

async function hash(password, salt) {
  const text = `${salt}:${password}`;
  if (!globalThis.crypto?.subtle) return btoa(unescape(encodeURIComponent(text)));
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = read(SESSION, null);
    const u = email ? read(USERS, {})[email] : null;
    return u ? { name: u.name, email } : null;
  });

  const signUp = useCallback(async ({ name, email, password }) => {
    const key = email.trim().toLowerCase();
    const users = read(USERS, {});
    if (users[key]) return { ok: false, error: 'An account with this email already exists. Try signing in instead.' };
    users[key] = { name: name.trim(), hash: await hash(password, key) };
    write(USERS, users); write(SESSION, key);
    setUser({ name: name.trim(), email: key });
    return { ok: true };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const key = email.trim().toLowerCase();
    const u = read(USERS, {})[key];
    if (!u || u.hash !== (await hash(password, key))) return { ok: false, error: 'Incorrect email or password. Please check and try again.' };
    write(SESSION, key);
    setUser({ name: u.name, email: key });
    return { ok: true };
  }, []);

  const signOut = useCallback(() => { write(SESSION, null); setUser(null); }, []);

  const updateName = useCallback((name) => {
    setUser((u) => {
      if (!u) return u;
      const users = read(USERS, {});
      if (users[u.email]) { users[u.email].name = name; write(USERS, users); }
      return { ...u, name };
    });
  }, []);

  return <AuthContext.Provider value={{ user, signUp, signIn, signOut, updateName }}>{children}</AuthContext.Provider>;
}
