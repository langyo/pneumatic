import React, { useContext } from 'react';

import { TaskViewMobile } from './taskViewMobile';
import { TaskViewDesktop } from './taskViewDesktop';

import { ThemeProvider, ThemeProviderContext } from './themeProviderContext';
import { TaskManager } from './taskManagerContext';
import { ApplicationProvider } from './appProviderContext';
import { AuthProvider } from './authProviderContext';
import { DataProvider } from './dataProviderContext';

export default function () {
  return <>
    <style>{`html, body { margin: 0px; padding: 0px; }`}</style>
    <AuthProvider>
      <DataProvider>
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
      </DataProvider>
    </AuthProvider>
  </>;
}