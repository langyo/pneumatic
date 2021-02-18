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
          const ws = new WebSocket(`ws://${window.location.host}/${data.token}`);
          ws.addEventListener('open', () => {
            console.log('Websocket connection has opened.');
            ws.addEventListener('message', ({ data }) => {
              console.log(data);
            });
            ws.addEventListener('close', () => {
              console.log('Websocket connection has closed.');
            })
          });
          ws.addEventListener('error', () => {
            console.error('Websocket connection has broken.');
          })
        } else {
          alert('Wrong user name or password!');
        }
      })
    }
  }}>
    {children}
  </AuthProviderContext.Provider>;
}
