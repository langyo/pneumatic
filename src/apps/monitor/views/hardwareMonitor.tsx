import React, { useContext } from 'react';
import { LinearProgress } from '../../../utils/frontend/components/progress';
import { css } from '@emotion/css';
import { ThemeProviderContext } from '../../../utils/frontend/themeProviderContext';

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
      <div className={css`
        font-size: 16px;
      `}>
        {title}
      </div>
      <div className={css`
        font-size: 16px;
      `}>
        {`${Math.round(progress * 10000) / 100}%`}
      </div>
    </div>
    <LinearProgress
      value={progress}
    />
  </div>;
}

export function HardwareMonitor({ sharedState }) {
  const { palette } = useContext(ThemeProviderContext);
  const { freeMem, totalMem } = sharedState;

  return <>
    <div className={css`
      margin: 16px;
      padding: 8px;
      display: inline-block;
      text-transform: none;
      font-size: 24px;
      color: ${palette.text};
    `}>
      {'Hardware Monitor'}
    </div>
    <div className={css`
      width: calc(100% - 16px);
      margin: 8px;
      display: flex;
      flex-wrap: wrap;
      color: ${palette.text};
    `}>
      {<UsageBarItem
        title='RAM (Own)'
        progress={freeMem && totalMem ? freeMem / totalMem : 0}
      />}
    </div>
  </>;
}
