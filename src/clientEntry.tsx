import React from 'react';

import { TaskViewMobile } from './utils/frontend/taskViewMobile';
import { TaskViewDesktop } from './utils/frontend/taskViewDesktop';

import { ThemeProvider, ThemeProviderContext } from './utils/frontend/themeProviderContext';
import { TaskManager } from './utils/frontend/taskManagerContext';
import { AppProvider } from './utils/frontend/appProviderContext';
import { AuthProvider, AuthProviderContext } from './utils/frontend/authProviderContext';
import { LoginView } from './utils/frontend/loginView';

export function entry () {
  return <>
    <style>{`html, body { margin: 0px; padding: 0px; }`}</style>
    <AuthProvider>
      <ThemeProvider>
        <AppProvider>
          <TaskManager>
            <AuthProviderContext.Consumer>
              {({ authToken }) => {
                if (authToken !== '') {
                  return <ThemeProviderContext.Consumer>
                    {({ media }) => <>
                      {media === 'mobile' && <TaskViewMobile />}
                      {media === 'desktop' && <TaskViewDesktop />}
                    </>}
                  </ThemeProviderContext.Consumer>;
                } else {
                  return <LoginView />
                }
              }}
            </AuthProviderContext.Consumer>
          </TaskManager>
        </AppProvider>
      </ThemeProvider>
    </AuthProvider>
  </>;
}