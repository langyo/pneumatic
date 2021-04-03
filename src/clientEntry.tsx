import React, { createElement } from 'react';

import { TaskViewMobile } from './utils/frontend/taskViewMobile';
import { TaskViewDesktop } from './utils/frontend/taskViewDesktop';

import { ThemeProvider, ThemeProviderContext } from './utils/frontend/themeProviderContext';
import { TaskManager } from './utils/frontend/taskManagerContext';
import { AppProvider } from './utils/frontend/appProviderContext';
import { AuthProvider, AuthProviderContext } from './utils/frontend/authProviderContext';
import { LoginView } from './utils/frontend/loginView';

import { render } from 'react-dom';
import './__client_id';

render(
  createElement(function () {
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
  }), document.querySelector('#root')
);
