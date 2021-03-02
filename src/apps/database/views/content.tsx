import React, { useState } from 'react';
import { css } from '@emotion/css';

export function Content({ }) {
  return <div className={css`
    color: rgba(0, 0, 0, 1);
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
