import React, { useState } from 'react';
import { css } from '@emotion/css';

export function LoadBalanceStatus({ }) {
  return <div className={css`
    color: rgba(255, 255, 255, 1);
  `}>
    <div className={css`
      font-size: 32px;
      margin: 8px 16px;
      height: 36px;
      line-height: 36px;
      padding: 4px;
      display: inline-block;
      user-select: none;
    `}>
      {'Load Balance'}
    </div>
    <div className={css`
      width: calc(100% - 16px);
      margin: 8px;
      display: flex;
      flex-wrap: wrap;
    `}></div>
  </div>;
}
