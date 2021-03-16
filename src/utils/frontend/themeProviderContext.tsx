import React, { createContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { css } from '@emotion/css';

export interface ITheme {
  palette: {
    background: string,
    primary: string,
    secondary: string,
    text: string
  },
  media: 'desktop' | 'mobile'
}

export const ThemeProviderContext = createContext({} as ITheme & {
  setTheme: (inputTheme: Partial<ITheme>) => void
});

export function ThemeProvider({ children }: { children?: any }) {
  const [theme, setTheme] = useState({
    palette: {
      background: '#1C304A',
      primary: '#046B99',
      secondary: '#B3EFFF',
      text: '#FFF'
    },
    media: useMediaQuery({
      query: '(min-width: 992px)'
    }) ? 'desktop' : 'mobile'
  } as ITheme);

  return <ThemeProviderContext.Provider value={{
    ...theme,
    setTheme(inputTheme: Partial<ITheme>) {
      setTheme({ ...theme, ...inputTheme });
    }
  }}>
    <div className={css`
      z-index: -1;
      position: fixed;
      width: 100%;
      height: 100%;
      background: ${theme.palette.background};
      background-size: cover;
      opacity: 0.5;
    `} />
    <div className={css`
      font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif;
    `}>
      {children}
    </div>
  </ThemeProviderContext.Provider>;
}
