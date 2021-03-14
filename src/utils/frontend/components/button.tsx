import React from 'react';
import { css } from '@emotion/css';
import { TouchRipple } from './touchRipple';

export function Button({ children, onClick }) {
  return <div className={css`
    &:hover {
      background: rgba(0, 0, 0, 0.2);
    }
  `}
    onClick={onClick}
  >
    {children}
    <TouchRipple />
  </div>
}