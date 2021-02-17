import React, { useRef, useContext } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';

import { AuthProviderContext } from './authProviderContext';

export function LoginView() {
  const { userName, setUserName, login }: {
    userName: string, setUserName: (name: string) => void,
    login: (name: string, hashedPasswd: string) => void
  } = useContext(AuthProviderContext);
  const userNameRef = useRef();
  const passwordRef = useRef();

  return <div className={css`
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `}>
    <div className={css`
      width: 260px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    `}>
      <div className={css`
        width: calc(100% - 64px);
        height: 32px;
        margin: 16px 32px;
        line-height: 32px;
        font-size: 30px;
        color: rgba(255, 255, 255, 1);
        user-select: none;
      `}>
        {'Login'}
      </div>
      <div className={css`
        width: 100%;
        height: calc(100% - 64px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      `}>
        <input className={css`
          width: 200px;
          height: 32px;
          margin: 4px;
          padding: 4px;
          line-height: 32px;
          font-size: 16px;
          text-align: center;
          color: rgba(255, 255, 255, 1);
          outline: none;
          border: none;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.2);
          &:hover {
            background: rgba(0, 0, 0, 0.4);
          }
          &::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
        `}
          ref={userNameRef}
          placeholder='Enter user name'
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.code === 'Enter' || event.code === 'Tab') {
              passwordRef.current.focus();
            }
          }}
          onChange={() => setUserName(userNameRef.current.value)}
          value={userName}
        />
        <input className={css`
          width: 200px;
          height: 32px;
          margin: 4px;
          padding: 4px;
          line-height: 32px;
          font-size: 16px;
          text-align: center;
          color: rgba(255, 255, 255, 1);
          outline: none;
          border: none;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.2);
          &:hover {
            background: rgba(0, 0, 0, 0.4);
          }
          &::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
        `}
          ref={passwordRef}
          placeholder='Enter password'
          type='password'
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.code === 'Enter') {
              login(userNameRef.current.value, passwordRef.current.value);
            }
          }}
        />
        <div className={css`
          height: 24px;
          width: 24px;
          margin: 4px;
          padding: 4px;
          color: rgba(255, 255, 255, 1);
          border-radius: 4px;
          user-select: none;
          background: rgba(0, 0, 0, 0.2);
          &:hover {
            background: rgba(0, 0, 0, 0.4);
          }
          &:active {
            background: rgba(0, 0, 0, 0.6);
          }
        `}
          onClick={() => login(userNameRef.current.value, passwordRef.current.value)}
        >
          <Icon path={mdiArrowRight} size={1} color='rgba(255, 255, 255, 1)' />
        </div>
      </div>
    </div>
  </div>
}