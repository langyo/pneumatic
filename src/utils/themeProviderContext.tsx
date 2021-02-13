import React, { createContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { css } from '@emotion/css';

export const ThemeProviderContext = createContext({});

export function ThemeProvider(props) {
  const media = useMediaQuery({
    query: '(min-width: 992px)'
  }) ? 'desktop' : 'mobile';
  const [backgroundUrl, setBackgroundUrl] = useState('');

  return <ThemeProviderContext.Provider value={{
    media
  }}>
    <div className={css`
      z-index: -1;
      position: fixed;
      width: 100%;
      height: 100%;
      background: url(${backgroundUrl}) no-repeat top left scroll;
      background-size: cover;
    `} />
    {props.children}
  </ThemeProviderContext.Provider>;
}
