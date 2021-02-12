import React, { createContext, useContext, useState } from 'react';
import { AuthProviderContext } from './authProviderContext';

export const DataProviderContext = createContext({});

export function DataProvider(props) {
  const { authToken } = useContext(AuthProviderContext);
  // TODO - Make connection by Web Socket.

  return <DataProviderContext.Provider value={{
  }}>
    {props.children}
  </DataProviderContext.Provider>;
}
