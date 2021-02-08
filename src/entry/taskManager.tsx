import { createContext } from 'react';

export const TaskManagerContext = createContext({});

import React, { useState, useContext } from 'react';
import { TaskViewMobile } from './taskViewMobile';
import { TaskViewDesktop } from './taskViewDesktop';
import { DialogMobile } from './dialogMobile';
import { DialogDesktop } from './dialogDesktop';

import { ThemeProviderContext } from './themeProvider';
import { ApplicationProviderContext } from './applicationProvider';

export interface ITask {
  id: string,   // Generate from the dependency 'shortid'.
  pkg: string,  // The embedded package format is 'pneumatic.*'.
  status: 'active' | 'hidden',
  title: string,
  // TODO - Supports maximization and window merging.
};

export function TaskManager() {
  const apps = useContext(ApplicationProviderContext);
  const [tasks, setTasks]: [ITask[], (tasks: ITask[]) => void] = useState([{
    id: '1',
    pkg: 'pneumatic.explorer',
    title: '/',
    status: 'active'
  }, {
    id: '2',
    pkg: 'pneumatic.monitor',
    status: 'hidden'
  }, {
    id: '3',
    pkg: 'pneumatic.browser',
    title: 'github.com',
    status: 'hidden'
  }]);
  const { media } = useContext(ThemeProviderContext);

  // TODO - Cpmbine the dialog render into the task view components.

  return <TaskManagerContext.Provider value={tasks}>
    {media === 'mobile' && tasks.map(({ id, pkg, title, status }, index) => {
      if (status === 'active') {
        return <DialogMobile
          key={id}
          icon={apps[pkg].icon}
          title={`${apps[pkg].name}${title ? ` - ${title}` : ''}`}
          contextComponent={apps[pkg].contentComponent({})}
          drawerComponent={apps[pkg].drawerComponent({})}
        />;
      }
    })}
    {media === 'desktop' && tasks.map(({ id, pkg, title, status }, index) => {
      return <DialogDesktop
        key={id}
        defaultPos={{ x: index * 50 + 20, y: index * 50 + 20 }}
        icon={apps[pkg].icon}
        title={`${apps[pkg].name}${title ? ` - ${title}` : ''}`}
        contextComponent={apps[pkg].contentComponent({})}
        drawerComponent={apps[pkg].drawerComponent({})}
      />;
    })}
  </TaskManagerContext.Provider>
}
