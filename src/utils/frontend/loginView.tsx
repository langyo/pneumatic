import React, { useContext } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiAccountOutline, mdiKeyOutline } from '@mdi/js';

import { AuthProviderContext } from '../authProviderContext';

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
      width: 50%;
      min-width: 300px;
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
        color: #fff;
        user-select: none;
      `}>
        {'Login'}
      </div>
      <input className={css`
        width: 300px;
        height: 32px;
        margin: 0px calc(50% - 150px);
        padding: 4px;
        line-height: 32px;
        font-size: 16px;
        color: #fff;
        outline: none;
        border: none;
        border-bottom: solid 4px rgba(0, 0, 0, 0.2);
        &:focus {
          border: none;
          border-bottom:  solid 4px rgba(0, 0, 0, 0.4);
        }
        background: rgba(0, 0, 0, 0.2);
        border-radius: 4px 4px 0px 0px;
      `} />
      <div className={css`
        width: 100px;
        height: 32px;
        margin: 8px;
        padding: 4px;
        line-height: 32px;
        font-size: 24px;
        text-align: center;
        color: #fff;
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