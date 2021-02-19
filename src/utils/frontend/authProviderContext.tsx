import EventEmitter from 'events';
import React, { createContext, useState } from 'react';
import useLocalStorage from 'react-use-localstorage';
import axios from 'axios';

import { signSaltPassword } from '../authVerifyTools';

export let wsConnection: WebSocket;
export let wsEventEmitter = new EventEmitter();

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
          wsConnection = new WebSocket(`ws://${window.location.host}/${data.token}`);
          wsConnection.addEventListener('open', () => {
            wsEventEmitter.on('send', (msg: any) => {
              console.log('WebSocket send', data);
              wsConnection.send(JSON.stringify(msg));
            })
            wsConnection.addEventListener('message', ({ data }) => {
              console.log('WebSocket receive', data);
              wsEventEmitter.emit('message', data);
            });
            wsConnection.addEventListener('close', () => {
              alert(`The WebSocket connection has closed.\nYou will jump to the login page later.`)
              location.reload();
            });
          });
          wsConnection.addEventListener('error', (e) => {
            console.error(e);
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
