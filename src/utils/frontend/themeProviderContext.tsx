import React, { createContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { css } from '@emotion/css';

export const ThemeProviderContext = createContext({});

export function ThemeProvider({ children }: { children?: any }) {
  const media = useMediaQuery({
    query: '(min-width: 992px)'
  }) ? 'desktop' : 'mobile';
  const [basicTheme, setBasicTheme] = useState({
    background: {
      type: 'url',
      value: ''
    }
  });

  return <ThemeProviderContext.Provider value={{
    media
  }}>
    <div className={css`
      z-index: -1;
      position: fixed;
      width: 100%;
      height: 100%;
      ${basicTheme.background && basicTheme.background.type === 'url' ?
        `background: url(${basicTheme.background.value}) no-repeat top left scroll;` :
        ''}
      background-size: cover;
    `} />
    <div className={css`
      font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;
    `}>
      {children}
    </div>
  </ThemeProviderContext.Provider>;
}