import React, { createContext, useState, useEffect } from 'react';
import cookies from 'js-cookie';
import local from 'localforage';

export const AuthProviderContext = createContext({});

export function AuthProvider({ children }: { children?: any }) {
  const [userName, setUserName] = useState();
  const [authToken, setAuthToken] = useState(cookies.get('token'));

  useEffect(() => (async () => {
    setUserName(await local.getItem('history-user-name'));
  })(), []);

  return <AuthProviderContext.Provider value={{
    userName, authToken,
    login(name: string, hashedPassword: string) { }
  }}>
    {children}
  </AuthProviderContext.Provider>;
}
