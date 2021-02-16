import React, { createContext, useState } from 'react';
import useLocalStorage from 'react-use-localstorage';
import cookies from 'js-cookie';
import axios from 'axios';

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
      axios.post('/backend/login', {
        userName, signedPassword: signSaltPassword(userName, rawPassword)
      }).then(({ data }) => {
        console.log(data);
      })
    }
  }}>
    {children}
  </AuthProviderContext.Provider>;
}
