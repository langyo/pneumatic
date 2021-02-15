import React, { createContext, useState } from 'react';
import cookies from 'js-cookie';

export const AuthProviderContext = createContext({});

export function AuthProvider({ children }: { children?: any }) {
  const [userName, setUserName] = useState('');
  const [authToken, setAuthToken] = useState(cookies.get('token') || 'test');

  return <AuthProviderContext.Provider value={{
    userName, authToken,
    login(name: string, hashedPassword: string) { }
  }}>
    {children}
  </AuthProviderContext.Provider>;
}
