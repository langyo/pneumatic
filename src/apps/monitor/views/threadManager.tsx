import React, { useContext } from 'react';
import { css } from '@emotion/css';
import { ThemeProviderContext } from '../../../utils/frontend/themeProviderContext';

export function FirewallStatus({ }) {
  const { palette } = useContext(ThemeProviderContext);

  return <>
    <div className={css`
      margin: 16px;
      padding: 8px;
      display: inline-block;
      text-transform: none;
      font-size: 24px;
      color: ${palette.text};
    `}>
      {'Thread Management'}
    </div>
    <div className={css`
      width: calc(100% - 16px);
      margin: 8px;
      display: flex;
      flex-wrap: wrap;
    `}></div>
  </>;
}
