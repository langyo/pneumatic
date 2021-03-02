import EventEmitter from 'events';
import React, { createContext, useState } from 'react';
import useLocalStorage from 'react-use-localstorage';
import axios from 'axios';

import { signSaltPassword } from '../authVerifyTools';

let wsConnection: WebSocket;
let wsEventEmitter = new EventEmitter();
export const wsSocket = Object.seal({
  send(head: string, data: { [key: string]: any } = {}) {
    wsEventEmitter.emit('send', JSON.stringify({ head, data }));
    console.log('sended', head, data);
  },
  receive(
    inputHead: string | '*',
    callback: (data: { [key: string]: any }, id?: string) => void
  ) {
    wsEventEmitter.on('message', (input: string) => {
      try {
        const { head, data } = JSON.parse(input);
        console.log('received', head, data);
        if (inputHead === '*') {
          if (head[0] !== '#') {
            callback(data, inputHead);
          }
        } else if (head === inputHead) {
          callback(data);
        } else {
          console.error(Error(`Unknown WebSocket message head: ${head}`));
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
});

export const AuthProviderContext = createContext({} as IAuthProviderContext);

export interface IAuthProviderContext {
  userName: string,
  setUserName: (name: string) => void,
  authToken: string,
  setAuthToken: (token: string) => void,
  login: (userName: string, rawPassword: string) => void
}

export function AuthProvider({ children }: { children?: any }) {
  const [userName, setUserName] = useLocalStorage('history-user-name', '');
  const [authToken, setAuthToken] = useState('');

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
          });
        } else {
          alert('Wrong user name or password!');
        }
      })
    }
  }}>
    {children}
  </AuthProviderContext.Provider>;
}
