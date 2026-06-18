import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { getMe, login as loginRequest } from '../api/auth.api';
import type { AuthUser } from '../api/types';
import { tokenStorage } from '../lib/tokenStorage';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(tokenStorage.get()));

  useEffect(() => {
    if (!tokenStorage.get()) {
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { accessToken, user: loggedInUser } = await loginRequest(email, password);
    tokenStorage.set(accessToken);
    setUser(loggedInUser);
  }

  function logout() {
    tokenStorage.clear();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>;
}
