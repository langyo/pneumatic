import React, { createContext, useState } from 'react';
import cookies from 'js-cookie';

export const AuthProviderContext = createContext({});

export function AuthProvider(props) {
  const [userName, setUserName] = useState('');
  const [authToken, setAuthToken] = useState(cookies.get('token'));

  return <AuthProviderContext.Provider value={{
    userName, authToken,
    login(name: string, hashedPassword: string) { }
  }}>
    {props.children}
  </AuthProviderContext.Provider>;
}
