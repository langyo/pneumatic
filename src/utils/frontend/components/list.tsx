import React, { Component, useRef, useContext  } from 'react';
import { css } from '@emotion/css';
import { Button } from './button';
import { ThemeProviderContext } from '../themeProviderContext';

export function List({ items }: {
  items: (string | any)[]
}) {
  const { palette } = useContext(ThemeProviderContext);

  return <div className={css`
    width: 100%;
  `}>
    {items.map(component => {
      if (typeof component === 'string') {
        if (/^\-+$/.test(component)) {
          return <div className={css`
            width: 80%;
            height: 0px;
            border: 1px solid ${palette.text};
            opacity: 0.8;
            margin: 16px 10%;
          `} />
        } else {
          return <div className={css`
            width: 80%;
            height: 20px;
            line-height: 20px;
            font-width: 12px;
            color: ${palette.text};
            margin: 8px 10%;
            user-select: none;
          `}>
            {component}
          </div>
        }
      } else {
        return <Button className={css`
          width: 80%;
          color: ${palette.text};
          margin: 8px 10%;
        `}>
          {component}
        </Button>
      }
    })}
  </div>;
}