import React from 'react';

import { ThemeProvider } from './themeProvider';
import { TaskManager } from './taskManager';
import { ApplicationProvider } from './applicationProvider';

export default function () {
  return <>
    <style>{`html, body { margin: 0px; padding: 0px; }`}</style>
    <ThemeProvider>
      <ApplicationProvider>
        <TaskManager />
      </ApplicationProvider>
    </ThemeProvider>
  </>;
}