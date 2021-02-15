import React, { createContext, useContext, useState } from 'react';
import { AuthProviderContext } from './authProviderContext';

export const DataProviderContext = createContext({});

export function DataProvider({ children }: { children?: any }) {
  const { authToken } = useContext(AuthProviderContext);
  // TODO - Make connection by Web Socket.

  return <DataProviderContext.Provider value={{
  }}>
    {children}
  </DataProviderContext.Provider>;
}
