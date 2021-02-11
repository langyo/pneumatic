import React, { useState } from 'react';
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
      <p className={css`
        margin: 4px;
        line-height: 24px;
        height: 24px;
        font-size: 20px;
        user-select: none;
      `}>
        {title}
      </p>
      <p className={css`
        margin: 4px;
        line-height: 24px;
        height: 24px;
        font-size: 20px;
        user-select: none;
      `}>
        {progress * 100 + '%'}
      </p>
    </div>
    <div className={css`
      width: calc(100% - 8px);
      height: 4px;
      margin: 4px;
      background: rgba(0.5, 0.5, 0.5, 0.1);
    `}>
      <div className={css`
        width: ${progress * 100}%;
        height: 4px;
        background: rgba(0.5, 0.5, 0.5, 0.4);
      `} />
    </div>
  </div>;
}

export function HardwareMonitor({ }) {
  return <div className={css`
    color: #fff;
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
      {'Hardware Monitor'}
    </div>
    <div className={css`
      width: calc(100% - 16px);
      margin: 8px;
      display: flex;
      flex-wrap: wrap;
    `}>
      <UsageBarItem title='CPU #0' progress={0.36} />
      <UsageBarItem title='RAM #0' progress={0.67} />
      <UsageBarItem title='RAM #1' progress={0.16} />
    </div>
  </div>;
}
