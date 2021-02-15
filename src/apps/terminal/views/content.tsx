import React, { useState } from 'react';
import { css } from '@emotion/css';

export function TerminalContent({ }) {
  return <div className={css`
    color: rgba(255, 255, 255, 1);
  `}>
    <div className={css`
      font-size: 32px;
      margin: 8px 16px;
      height: 36px;
      line-height: 36px;
      padding: 4px;
      &:hover {
        background: rgba(0.5, 0.5, 0.5, 0.2);
      }
      display: inline-block;
      user-select: none;
      border-radius: 4px;
    `}>
      {'WIP'}
    </div>
  </div>;
}
