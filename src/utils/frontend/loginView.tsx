import React, { useContext } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiAccountOutline, mdiArrowRight, mdiKeyOutline } from '@mdi/js';

import { AuthProviderContext } from './authProviderContext';

export function LoginView() {
  const { userName }: {
    userName?: string
  } = useContext(AuthProviderContext);
  const mode = userName ? 'enterPassword' : 'enterName';

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
      width: 300px;
      height: 150px;
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
        justify-content: center;
        align-items: center;
      `}>
        <input className={css`
          width: 200px;
          height: 32px;
          padding: 4px;
          line-height: 32px;
          font-size: 16px;
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
          placeholder={mode === 'enterName' ? 'Enter user name' : 'Enter password'}
        />
        <div className={css`
          height: 24px;
          width: 24px;
          margin-left: 4px;
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
        `}>
          <Icon path={mdiArrowRight} size={1} color='rgba(255, 255, 255, 1)' />
        </div>
      </div>
    </div>
  </div>
}