import React, { useState, useRef, useContext } from 'react';
import { Row, Col, Card, Button, Input } from 'antd';
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
  const [password, setPassword] = useState();

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
    <Card title={`Login`} className={css`
      width: 260px;
      height: 200px;
    `}>
      <Input
        placeholder='Enter user name'
        onPressEnter={() => passwordRef.current.focus()}
        onChange={({ target: { value } }) => setUserName(value)}
        value={userName}
      />
      <Input.Password
        ref={passwordRef}
        placeholder='Enter password'
        onPressEnter={() => login(userName, password)}
        onChange={({ target: { value } }) => setPassword(value)}
        value={password}
      />
      <Row justify="center" >
        <Col>
          <Button
            onClick={() => login(userName, password)}
            icon={<Icon path={mdiArrowRight} size={1} color='rgba(0, 0, 0, 1)' />}
          />
        </Col>
      </Row>
    </Card>
  </div>
}