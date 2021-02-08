import React, { useContext } from 'react';

import { TaskViewMobile } from './taskViewMobile';
import { TaskViewDesktop } from './taskViewDesktop';

import { ThemeProvider, ThemeProviderContext } from './themeProvider';
import { TaskManager } from './taskManager';
import { ApplicationProvider } from './applicationProvider';

export default function () {
  return <>
    <style>{`html, body { margin: 0px; padding: 0px; }`}</style>
    <ThemeProvider>
      <ApplicationProvider>
        <TaskManager>
          <ThemeProviderContext.Consumer>
            {({ media }) => <>
              {media === 'mobile' && <TaskViewMobile />}
              {media === 'desktop' && <TaskViewDesktop />}
            </>}
          </ThemeProviderContext.Consumer>
        </TaskManager>
      </ApplicationProvider>
    </ThemeProvider>
  </>;
}