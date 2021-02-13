import React, { createContext, useContext, useState } from 'react';
import { ApplicationProviderContext, IApp } from './appProviderContext';
import { generate } from 'shortid';

export const TaskManagerContext = createContext({});
export interface ITask {
  pkg: '#merge' | string,    // The embedded package format is 'pneumatic.*'.
  page: string,   // The default page is 'default'.
  state: { [key: string]: string | number | boolean },
  windowInfo: IWindowInfo
};
export interface IWindowInfo {
  status: 'active' | 'notActive' | 'hidden' | 'merged',
  title: string,
  left: number, top: number,
  width: number, height: number,
  priority: number,     // TODO - Allows windows to be cascaded according to priority.
  mergeGrid: {          // TODO - Supports maximization and window merging.
    id: string,
    at: 'top' | 'bottom' | 'left' | 'right',
    width: number,
    height: number
  }[],
  subWindow: string[],  // TODO - Support binding sub windows.
  parentWindow: string
};
export type IState = { [key: string]: any };

export type ITaskInfo = { [key: string]: ITask };
export type IGenerateTask = (pkg: string, page?: string, initState?: IState) => void;
export type IDestoryTask = (id: string) => void;
export type ISetPage = (id: string, page: string) => void;
export type ISetState = (id: string, state: IState) => void;
export type ISetWindowInfo = (id: string, info: Partial<IWindowInfo>) => void;
export type ISetActiveTask = (id: string) => void;

export function TaskManager(props) {
  const { apps }: { apps: { [pkg: string]: IApp } } = useContext(ApplicationProviderContext);
  const [tasks, setTasks]: [ITaskInfo, (tasks: ITaskInfo) => void] = useState({});

  return <TaskManagerContext.Provider value={{
    tasks,
    generateTask(
      pkg: string, page?: string, initState?: IState
    ) {
      setTasks(Object.keys(tasks).reduce((obj, id: string) => ({
        ...obj,
        [id]: {
          ...tasks[id],
          windowInfo: {
            ...tasks[id].windowInfo,
            status: 'notActive'
          }
        }
      }), {
        [generate()]: {
          pkg,
          page: apps[pkg].defaultPage || 'default',
          state: {
            ...(initState || {}),
            ...(apps[pkg].defaultState || {})
          },
          windowInfo: {
            status: 'active',
            left: apps[pkg].defaultWindowInfo && apps[pkg].defaultWindowInfo.left ?
              apps[pkg].defaultWindowInfo.left : 100 + Object.keys(tasks).length * 50,
            top: apps[pkg].defaultWindowInfo && apps[pkg].defaultWindowInfo.top ?
              apps[pkg].defaultWindowInfo.top : 50 + Object.keys(tasks).length * 50,
            width: apps[pkg].defaultWindowInfo && apps[pkg].defaultWindowInfo.width ?
              apps[pkg].defaultWindowInfo.width : 600,
            height: apps[pkg].defaultWindowInfo && apps[pkg].defaultWindowInfo.height ?
              apps[pkg].defaultWindowInfo.height : 400,
            title: apps[pkg].defaultWindowInfo && apps[pkg].defaultWindowInfo.title ?
              apps[pkg].defaultWindowInfo.title(apps[pkg].defaultPage || 'default', {
                ...(initState || {}),
                ...(apps[pkg].defaultState || {})
              }, tasks) : '',
            priority: Object.keys(tasks).length + 1,
            mergeGrid: [],
            subWindow: [],
            parentWindow: ''
          }
        }
      } as ITaskInfo));
    },
    destoryTask(id: string) {
      setTasks(Object.keys(tasks).filter(n => n !== id).reduce(
        (obj: { [key: string]: ITask }, key: string) => ({
          ...obj,
          [key]: {
            ...tasks[key],
            windowInfo: {
              ...tasks[key].windowInfo,
              priority: tasks[key].windowInfo.priority > tasks[id].windowInfo.priority ?
                tasks[key].windowInfo.priority - 1 :
                tasks[key].windowInfo.priority
            }
          }
        }), {}));
    },
    setPage(id: string, page: string) {
      if (Object.keys(apps[tasks[id].pkg].contentComponent).indexOf(page) < 0) {
        throw Error(`Unknown page '${page}' at '${tasks[id].pkg}[${id}]'.`);
      }
      setTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          page
        }
      });
    },
    setState(id: string, state: IState) {
      setTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          state: {
            ...tasks[id].state,
            ...state
          }
        }
      });
    },
    setWindowInfo(id: string, info: IWindowInfo) {
      setTasks({
        ...tasks,
        [id]: {
          ...tasks[id],
          windowInfo: {
            ...tasks[id].windowInfo,
            ...info
          }
        }
      });
    },
    setActiveTask(id: string) {
      setTasks(Object.keys(tasks).reduce((obj, key: string) => ({
        ...obj,
        [key]: {
          ...tasks[key],
          windowInfo: {
            ...tasks[key].windowInfo,
            status: id === key ? 'active' : 'hidden',
            priority: id === key ?
              Object.keys(tasks).length :
              tasks[key].windowInfo.priority - 1
          }
        }
      }) as ITaskInfo, {}));
    }
  }}>
    {props.children}
  </TaskManagerContext.Provider>;
}
