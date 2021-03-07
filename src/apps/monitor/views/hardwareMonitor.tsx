import React from 'react';
import { Typography, LinearProgress } from '@material-ui/core';
import { css } from '@emotion/css';

function UsageBarItem({ title, progress }) {
  return <div className={css`
    width: 100%;
    height: 24px;
    margin: 16px 8px;
  `}>
    <div className={css`
      display: flex;
      justify-content: space-between;
    `}>
      <Typography variant='h6'>
        {title}
      </Typography>
      <Typography variant='subtitle1'>
        {`${Math.round(progress * 10000) / 100}%`}
      </Typography>
    </div>
    <LinearProgress
      variant="determinate"
      value={progress * 100}
    />
  </div>;
}

export function HardwareMonitor({ sharedState }) {
  const { freeMem, totalMem } = sharedState;

  return <>
    <Typography variant='h4'>
      {'Hardware Monitor'}
    </Typography>
    <div className={css`
      width: calc(100% - 16px);
      margin: 8px;
      display: flex;
      flex-wrap: wrap;
    `}>
      {freeMem && totalMem && <UsageBarItem
        title='RAM (Own)'
        progress={freeMem / totalMem}
      />}
    </div>
  </>;
}
