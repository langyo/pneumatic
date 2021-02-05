import { createContext } from 'react';

export const TaskManagerContext = createContext({});

import React, { useState } from 'react';
import TaskViewMobile from './taskViewMobile';

export interface ITask {
  id: string,   // Generate from the dependency 'shortid'.
  pkg: string,  // The embedded package format is 'pneumatic.*'.
  status: 'active' | 'hidden'
  // TODO - Supports maximization and window merging.
};

export default function() {
  const [tasks, setTasks]: [ITask[], (tasks: ITask[]) => void] = useState([{
    id: '#',    // Only one.
    pkg: 'pneumatic.core.taskView',
    status: 'active'
  }]);

  return <TaskManagerContext.Provider value={tasks}>
    {tasks.map(({ id, pkg, status }) => {
      if (pkg === 'pneumatic.core.taskView') {
        return <TaskViewMobile />
      }
    })}
  </TaskManagerContext.Provider>
}
