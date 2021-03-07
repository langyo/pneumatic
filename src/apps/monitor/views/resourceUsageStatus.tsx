import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import { css } from '@emotion/css';

export function ResourceUsgaeStatus({ }) {
  return <>
    <Typography variant='h4'>
      {'Resource Usage'}
    </Typography>
    <div className={css`
      width: calc(100% - 16px);
      margin: 8px;
      display: flex;
      flex-wrap: wrap;
    `}></div>
  </>;
}
