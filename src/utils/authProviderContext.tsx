import React, { createContext, useState } from 'react';

export const AuthProviderContext = createContext({});

export function AuthProvider(props) {
  const [userName, setUserName] = useState('');
  const [authToken, setAuthToken] = useState('');

  return <AuthProviderContext.Provider value={{
    userName, authToken,
    login(name: string, hashedPassword: string) { }
  }}>
    {props.children}
  </AuthProviderContext.Provider>;
}
