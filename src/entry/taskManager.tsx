import React, { createContext, useState } from 'react';

export const TaskManagerContext = createContext({});
export interface ITask {
  pkg: string,  // The embedded package format is 'pneumatic.*'.
  status: 'active' | 'hidden',
  title: string,
  left: number,
  top: number,
  width: number,
  height: number
  // TODO - Supports maximization and window merging.
};

export function TaskManager(props) {
  const [tasks, setTasks]: [ITask[], (tasks: ITask[]) => void] = useState([{
    pkg: 'pneumatic.explorer',
    title: '/',
    status: 'active',
    left: 50, top: 50, width: 600, height: 400
  }, {
    pkg: 'pneumatic.monitor',
    status: 'hidden',
    left: 100, top: 100, width: 600, height: 400
  }, {
    pkg: 'pneumatic.browser',
    title: 'github.com',
    status: 'hidden',
    left: 150, top: 150, width: 400, height: 300
  }]);
  const [activeTasks, setActiveTasks] = useState([0]);
  const [isManageMode, setManageMode] = useState(false);

  return <TaskManagerContext.Provider value={{
    tasks, setTasks,
    activeTasks, setActiveTasks,
    isManageMode, setManageMode
  }}>
    {props.children}
  </TaskManagerContext.Provider>
}
