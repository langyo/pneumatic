import React, { useState } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import {
  mdiApplication
} from '@mdi/js';

function ToolbarItem({ iconPath, title }) {
  return (
    <div
      className={css`
        width: 80%;
        height: 32px;
        margin: 2px;
        padding: 4px;
        display: flex;
        border-radius: 4px;
        &:hover {
          background: rgba(0.5, 0.5, 0.5, 0.1);
        }
        &:active {
          background: rgba(0.5, 0.5, 0.5, 0.2);
        }
      `}
    >
      <div
        className={css`
          margin: 4px;
        `}
      >
        <Icon path={iconPath} size={1} />
      </div>
      <div
        className={css`
          margin: 0px 8px;
          line-height: 32px;
          user-select: none;
        `}
      >
        {title}
      </div>
    </div>
  );
}

export function MarketDrawer({ }) {
  return <div
    className={css`
      margin: 0px;
      padding-top: 8px;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: top;
      align-items: center;
      align-content: flex-start;
      user-select: none;
      color: #fff;
    `}
  >
    <div
      className={css`
        width: 80%;
        height: 24px;
        margin: 4px 0px;
      `}
    >
      {'Fast forward'}
    </div>
    <ToolbarItem iconPath={mdiApplication} title='All' />
    <div
      className={css`
        width: 90%;
        height: 2px;
        margin: 4px 0px;
        background: rgba(0.5, 0.5, 0.5, 0.1);
      `}
    />
    <div
      className={css`
        width: 80%;
        height: 24px;
        margin: 4px 0px;
      `}
    >
      {'Recent'}
    </div>
    <ToolbarItem iconPath={mdiApplication} title='All' />
  </div>;
}
