import React, { createContext, useState } from 'react';

export const TaskManagerContext = createContext({});
export interface ITask {
  pkg: string,    // The embedded package format is 'pneumatic.*'.
  page: string,   // The default page is 'default'.
  args: { [key: string]: string }
  windowInfo: IWindowInfo
};

export interface IWindowInfo {
  title: string,
  left: number,
  top: number,
  width: number,
  height: number
  // TODO - Supports maximization and window merging.
};

export type ITasksState = { [key: string]: ITask };
export type ITaskSetState = (tasks: { [key: string]: ITask }) => void;
export type IActiveTasksState = string[];
export type IActiveTasksSetState = (tasks: string[]) => void;

export function TaskManager(props) {
  const [tasks, setTasks]: [ITasksState, ITaskSetState] = useState({});
  const [activeTasks, setActiveTasks]: [
    IActiveTasksState, IActiveTasksSetState
  ] = useState([]);

  return <TaskManagerContext.Provider value={{
    tasks, setTasks,
    activeTasks, setActiveTasks
  }}>
    {props.children}
  </TaskManagerContext.Provider>;
}
