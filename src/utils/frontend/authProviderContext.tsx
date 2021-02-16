import React, { createContext, useState } from 'react';
import useLocalStorage from 'react-use-localstorage';
import cookies from 'js-cookie';

import { signSaltPassword } from '../authVerifyTools';

export const AuthProviderContext = createContext({});

export function AuthProvider({ children }: { children?: any }) {
  const [userName, setUserName] = useLocalStorage('history-user-name', '');
  const [authToken, setAuthToken] = useState(cookies.get('token'));

  return <AuthProviderContext.Provider value={{
    userName, setUserName,
    authToken, setAuthToken,
    login(userName: string, rawPassword: string) {
      setUserName(userName);
      fetch('/backend/login', {
        method: 'POST',
        body: JSON.stringify({
          userName, signedPassword: signSaltPassword(userName, rawPassword)
        }),
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer'
      }).then(res => res.json()).then(obj => {
        console.log(obj);
      })
    }
  }}>
    {children}
  </AuthProviderContext.Provider>;
}
