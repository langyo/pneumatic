import React, { createContext, useState } from 'react';
import useLocalStorage from 'react-use-localstorage';
import EventEmitter from 'events';
import axios from 'axios';

import { signSaltPassword } from '../authVerifyTools';

let wsConnection: WebSocket;
let wsEventEmitter = new EventEmitter();
let wsSendMessageBuffer: { head: string, data: any }[] = [];
export const wsSocket = Object.seal({
  send(head: string, data: { [key: string]: any } = {}) {
    if (wsConnection?.readyState === 1) {
      console.log('WebSocket send:', head, data);
      wsEventEmitter.emit('send', JSON.stringify({ head, data }));
    } else {
      wsSendMessageBuffer.push({ head, data });
    }
  },
  receive(
    inputHead: string,
    callback: (data: { [key: string]: any }) => void
  ) {
    wsEventEmitter.on('message', (input: string) => {
      try {
        const { head, data } = JSON.parse(input);
        if (head === inputHead) {
          console.log('WebSocket receive:', head, data);
          callback(data);
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
            wsConnection.addEventListener('message', ({ data }) => {
              wsEventEmitter.emit('message', data);
            });
            wsConnection.addEventListener('close', () => {
              alert(`The WebSocket connection has closed.\nYou will jump to the login page later.`)
              location.reload();
            });
            wsEventEmitter.on('send', (msg: string) => {
              wsConnection.send(msg);
            });
            for (const { head, data } of wsSendMessageBuffer) {
              wsSocket.send(head, data);
            }
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
