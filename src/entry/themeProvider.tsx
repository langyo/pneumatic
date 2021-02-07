import React, { createContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export const ThemeProviderContext = createContext({});

export function ThemeProvider(props) {
  const media = useMediaQuery({
    query: '(min-width: 992px)'
  }) ? 'desktop' : 'mobile';

  return <ThemeProviderContext.Provider value={{
    media
  }}>
    {props.children}
  </ThemeProviderContext.Provider>
}
