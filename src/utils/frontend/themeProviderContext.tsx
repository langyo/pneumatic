import React, { createContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { css } from '@emotion/css';

export type IRGBColor = [number, number, number];
export interface ITheme {
  palette: {
    background: IRGBColor,
    primary: IRGBColor,
    secondary: IRGBColor,
    text: IRGBColor
  },
  media: 'desktop' | 'mobile'
}

export const ThemeProviderContext = createContext({} as {
  palette: ({
    [key in keyof ITheme['palette']]: string
  } & ((type: keyof ITheme['palette'], opacity: number) => string)),
  setTheme: (inputTheme: Partial<ITheme>) => void
});

export function ThemeProvider({ children }: { children?: any }) {
  const [theme, setTheme] = useState({
    palette: {
      background: [28, 48, 74],
      primary: [4, 107, 153],
      secondary: [179, 239, 255],
      text: [255, 255, 255]
    },
    media: useMediaQuery({
      query: '(min-width: 992px)'
    }) ? 'desktop' : 'mobile'
  } as ITheme);

  return <ThemeProviderContext.Provider value={{
    palette: new Proxy(theme.palette, {
      get(obj: ITheme['palette'], key: string) {
        if (Object.keys(obj).indexOf(key) >= 0) {
          return `rgb(${obj[key].join(', ')})`;
        }
        throw new Error(`Unknown palette type ${key}.`);
      },
      apply(obj: ITheme['palette'], _this, opacity: [number]) {
        return Object.keys(obj).reduce((obj, key) => ({
          ...obj,
          [key]: `rgba(${obj[key].join(', ')}, ${opacity})`
        }), {});
      }
    }) as any,
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
