import React, { useState, useRef, useContext } from 'react';
import { Paper, Button, TextField } from '@material-ui/core';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiArrowRight } from '@mdi/js';

import { AuthProviderContext } from './authProviderContext';

export function LoginView() {
  const { userName, setUserName, login }: {
    userName: string, setUserName: (name: string) => void,
    login: (name: string, hashedPasswd: string) => void
  } = useContext(AuthProviderContext);
  const passwordRef = useRef();
  const [password, setPassword]: [string, (p: string) => void] = useState();

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
    <Paper title={`Login`} className={css`
      width: 260px;
      height: 200px;
    `}>
      <TextField
        label='User name'
        placeholder='Enter user name'
        variant='outlined'
        fullWidth
        onChange={({ target: { value } }) => setUserName(value)}
        value={userName}
      />
      <TextField
        label='Password'
        ref={passwordRef}
        placeholder='Enter password'
        variant='outlined'
        fullWidth
        onChange={({ target: { value } }) => setPassword(value)}
        value={password}
      />
      <Button
        onClick={() => login(userName, password)}
        startIcon={<Icon path={mdiArrowRight} size={1} color='rgba(0, 0, 0, 1)' />}
      >
        {'Login'}
      </Button>
    </Paper>
  </div>
}