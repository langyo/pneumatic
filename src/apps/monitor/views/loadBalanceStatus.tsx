import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { css } from '@emotion/css';

export function LoadBalanceStatus({ }) {
  return <>
    <Typography variant='h4'>
      {'Load Balance'}
    </Typography>
    <div className={css`
      width: calc(100% - 16px);
      margin: 8px;
      display: flex;
      flex-wrap: wrap;
    `}></div>
  </>;
}
