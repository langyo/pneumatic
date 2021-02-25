import React, { useState, useRef, useContext } from 'react';
import {
  Card, CardContent, Button, TextField, Grid, Typography
} from '@material-ui/core';
import { css } from '@emotion/css';

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
    <Card className={css`
      width: 300px;
    `}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant='h6'>
              {'Login'}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='User name'
              placeholder='Enter user name'
              variant='outlined'
              fullWidth
              onChange={({ target: { value } }) => setUserName(value)}
              value={userName}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label='Password'
              inputRef={passwordRef}
              type='password'
              placeholder='Enter password'
              variant='outlined'
              fullWidth
              onChange={({ target: { value } }) => setPassword(value)}
              value={password}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs />
              <Grid item xs='auto'>
                <Button
                  variant='outlined'
                  onClick={() => login(userName, password)}
                >
                  {'Login'}
                </Button>
              </Grid>
              <Grid item xs />
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  </div>
}