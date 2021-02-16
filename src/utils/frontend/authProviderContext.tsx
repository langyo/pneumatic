import React, { createContext, useState } from 'react';
import useLocalStorage from 'react-use-localstorage';
import cookies from 'js-cookie';

export const AuthProviderContext = createContext({});

export function AuthProvider({ children }: { children?: any }) {
  const [userName, setUserName] = useLocalStorage('history-user-name', '');
  const [authToken, setAuthToken] = useState(cookies.get('token'));

  return <AuthProviderContext.Provider value={{
    userName, setUserName,
    authToken, setAuthToken,
    login(name: string, hashedPassword: string) {
      setUserName(name);
    }
  }}>
    {children}
  </AuthProviderContext.Provider>;
}
