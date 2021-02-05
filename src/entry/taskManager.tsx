import { createContext } from 'react';

export const TaskManagerContext = createContext({});

import React, { useState, useContext } from 'react';
import { TaskViewMobile } from './taskViewMobile';
import { ThemeProviderContext } from './themeProvider';

export interface ITask {
  id: string,   // Generate from the dependency 'shortid'.
  pkg: string,  // The embedded package format is 'pneumatic.*'.
  status: 'active' | 'hidden',
  title: string,
  // TODO - Supports maximization and window merging.
};

export function TaskManager() {
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

  return <TaskManagerContext.Provider value={tasks}>
    {media === 'mobile' && <TaskViewMobile />}
    {tasks.map(({ id, pkg, status }) => {
    })}
  </TaskManagerContext.Provider>
}
