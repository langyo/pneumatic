import React, { useState, useContext } from 'react';
import { Button } from './components/button';
import { Input } from './components/input';
import { css } from '@emotion/css';

import { AuthProviderContext } from './authProviderContext';
import { ThemeProviderContext } from './themeProviderContext';

export function LoginView() {
  const { palette } = useContext(ThemeProviderContext);
  const { userName, setUserName, login }: {
    userName: string, setUserName: (name: string) => void,
    login: (name: string, hashedPasswd: string) => void
  } = useContext(AuthProviderContext);
  const [password, setPassword]: [string, (p: string) => void] = useState();

  return <div className={css`
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `}>
    <div className={css`
      width: 300px;
      padding: 8px;
      background: ${palette(.6).primary};
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}>
      <Input
        label='User name'
        placeholder='Enter user name'
        onChange={({ target: { value } }) => setUserName(value)}
        value={userName}
      />
      <Input
        label='Password'
        type='password'
        placeholder='Enter password'
        onChange={({ target: { value } }) => setPassword(value)}
        value={password}
      />
      <Button className={css`
        padding: 4px;
        height: 24px;
        line-height: 24px;
        font-size: 16px;
        color: ${palette.text};
      `}
        onClick={() => login(userName, password)}
      >
        {'Login'}
      </Button>
    </div>
  </div>
}