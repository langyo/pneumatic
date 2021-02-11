import React, { createContext, useState } from 'react';

export const TaskManagerContext = createContext({});
export interface ITask {
  pkg: string,    // The embedded package format is 'pneumatic.*'.
  page: string,   // The default page is 'default'.
  args: {
    [key: string]: string
  }
  windowInfo: {
    title: string,
    left: number,
    top: number,
    width: number,
    height: number
    // TODO - Supports maximization and window merging.
  }
};

export function TaskManager(props) {
  const [tasks, setTasks]: [ITask[], (tasks: ITask[]) => void] = useState([{
    pkg: 'pneumatic.explorer',
    page: 'default',
    args: {},
    windowInfo: {
      title: '/',
      left: 50, top: 50, width: 600, height: 400
    }
  }, {
    pkg: 'pneumatic.monitor',
    page: 'hardware',
    args: {},
    windowInfo: {
      title: 'hardware',
      left: 100, top: 100, width: 600, height: 400
    }
  }, {
    pkg: 'pneumatic.browser',
    page: 'default',
    args: {
      url: 'https://github.com/langyo'
    },
    windowInfo: {
      title: 'github.com',
      left: 150, top: 150, width: 400, height: 300
    }
  }]);
  const [activeTasks, setActiveTasks] = useState([0]);

  return <TaskManagerContext.Provider value={{
    tasks, setTasks,
    activeTasks, setActiveTasks
  }}>
    {props.children}
  </TaskManagerContext.Provider>
}
