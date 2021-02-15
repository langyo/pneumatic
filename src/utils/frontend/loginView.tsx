import React, { useContext } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiAccountOutline, mdiKeyOutline } from '@mdi/js';

import { AuthProviderContext } from './authProviderContext';

export function LoginView() {
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
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    `}>
      <div className={css`
        width: calc(100% - 32px);
        height: 32px;
        margin: 0px 8px;
        padding: 16px 0px;
        line-height: 32px;
        font-size: 30px;
        color: rgba(255, 255, 255, 1);
        user-select: none;
      `}>
        {'Login'}
      </div>
      <input className={css`
        width: 200px;
        height: 32px;
        margin: 0px 50px;
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
        placeholder='Enter user name'
      />
      <div className={css`
        margin: 8px;
        padding: 4px 8px;
        font-size: 20px;
        text-align: center;
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
        {'Next'}
      </div>
    </div>
  </div>
}