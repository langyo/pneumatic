import React, { useState } from 'react';
import { Context } from './context';

import AppMobile from './appMobile';

export default function() {
  const [state, setState] = useState({
    active: '#desktop',
    list: ['#desktop', '#toggler'],
  });

  return <Context.Provider value={{
    ...state,
    generate() {

    }
  }}>
    <AppMobile />
  </Context.Provider>
}