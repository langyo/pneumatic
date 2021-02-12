import React from 'react';

import { TaskViewMobile } from './utils/taskViewMobile';
import { TaskViewDesktop } from './utils/taskViewDesktop';

import { ThemeProvider, ThemeProviderContext } from './utils/themeProviderContext';
import { TaskManager } from './utils/taskManagerContext';
import { ApplicationProvider } from './utils/appProviderContext';
import { AuthProvider, AuthProviderContext } from './utils/authProviderContext';
import { DataProvider } from './utils/dataProviderContext';
import { LoginView } from './utils/loginView';

export default function () {
  return <>
    <style>{`html, body { margin: 0px; padding: 0px; }`}</style>
    <AuthProvider>
      <DataProvider>
        <ThemeProvider>
          <ApplicationProvider>
            <TaskManager>
              <AuthProviderContext.Consumer>
                {({ accessToken }) => {
                  if (accessToken !== '') {
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
          </ApplicationProvider>
        </ThemeProvider>
      </DataProvider>
    </AuthProvider>
  </>;
}