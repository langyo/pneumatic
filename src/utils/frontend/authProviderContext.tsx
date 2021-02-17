import React, { createContext, useState } from 'react';
import useLocalStorage from 'react-use-localstorage';
import axios from 'axios';

import { signSaltPassword } from '../authVerifyTools';

export const AuthProviderContext = createContext({});

export function AuthProvider({ children }: { children?: any }) {
  const [userName, setUserName] = useLocalStorage('history-user-name', '');
  const [authToken, setAuthToken] = useState();

  return <AuthProviderContext.Provider value={{
    userName, setUserName,
    authToken, setAuthToken,
    login(userName: string, rawPassword: string) {
      setUserName(userName);
      axios.post('/backend/login', {
        userName, signedPassword: signSaltPassword(userName, rawPassword)
      }).then(({ data }) => {
        if (data.status === 'success') {
          setAuthToken(data.token);
        } else {
          alert('Wrong user name or password!');
        }
      })
    }
  }}>
    {children}
  </AuthProviderContext.Provider>;
}
