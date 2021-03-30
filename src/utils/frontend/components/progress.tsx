import React, { useContext } from 'react';
import { css, cx } from '@emotion/css';
import { ThemeProviderContext } from '../themeProviderContext';

export function LinearProgress({ value, className }: {
  value: number, className?: string
}) {
  const { palette } = useContext(ThemeProviderContext);

  return <div className={cx(css`
    width: 100%;
    height: 4px;
    margin: 4px 0px;
    position: relative;
  `, className || '')}>
    <div className={css`
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 4px;
      background: ${palette(.4).secondary};
    `} />
    <div className={css`
      position: absolute;
      left: 0px;
      top: 0px;
      width: calc(100% * ${value});
      height: 4px;
      background: ${palette.secondary};
      transition: .2s;
    `} />
  </div>;
}