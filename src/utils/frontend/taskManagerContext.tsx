import React, { createContext, useContext, useEffect, useState } from 'react';
import { wsEventEmitter } from './authProviderContext';
import { ApplicationProviderContext, IApp } from './appProviderContext';
import { ThemeProviderContext } from './themeProviderContext';
import { generate } from 'shortid';

export const TaskManagerContext = createContext({});
export interface ITask {
  pkg: '#merge' | string,    // The embedded package format is 'pneumatic.*'.
  page: string,   // The default page is 'default'.
  state: { [key: string]: string | number | boolean },
  connection: 'loading' | 'access' | 'block',
  windowInfo: IWindowInfo
};

export interface IGlobalState {
  drawerState: boolean,
  launcherState: boolean,
  taskManagerState: boolean,
  taskManagerPosition: {
    direction: 'left' | 'right',
    top: number,      // It is invalid on desktop.
    lastTop: number   // It is invalid on desktop.
  }
}
export type ISetGlobalState = (state: Partial<IGlobalState>) => void;

export interface IWindowInfo {
  status: 'active' | 'notActive' | 'hidden',
  title: string,
  left: number, top: number,
  width: number, height: number,
  priority: number,
  taskManagerOrder: number,
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
export interface IProps {
  mediaMode: 'desktop' | 'mobile',
  windowInfo: IWindowInfo,
  setWindowInfo: (info: IWindowInfo) => void,
  page: string,
  setPage: (page: string) => void,
  state: IState,
  setState: (state: IState) => void,
  globalState: IGlobalState,
  setGlobalState: ISetGlobalState,
  generateTask: IGenerateTask,
  destoryTask: IDestoryTask
}

export type ITaskInfo = { [key: string]: ITask };
export type IGenerateTask = (pkg: string, page?: string, initState?: IState) => void;
export type IDestoryTask = (id: string) => void;
export type ISetPage = (id: string, page: string) => void;
export type ISetState = (id: string, state: IState) => void;
export type ISetWindowInfo = (id: string, info: Partial<IWindowInfo>) => void;
export type ISetActiveTask = (id: string) => void;
export type IPropsGenerator = (
  key: string, page: string, state: IState
) => IProps;

export interface ITaskManagerContext {
  tasks: ITaskInfo,
  globalState: IGlobalState,
  setGlobalState: ISetGlobalState,
  generateTask: IGenerateTask,
  destoryTask: IDestoryTask,
  setPage: ISetPage,
  setState: ISetState,
  setWindowInfo: ISetWindowInfo,
  setActiveTask: ISetActiveTask,
  propsGenerator: IPropsGenerator
};

export function TaskManager({ children }: { children?: any }) {
  const { apps }: { apps: { [pkg: string]: IApp } } = useContext(ApplicationProviderContext);
  const { media } = useContext(ThemeProviderContext);
  const [tasks, _setTasks]: [
    ITaskInfo, (tasks: (tasks: ITaskInfo) => ITaskInfo) => void
  ] = useState({});
  const [globalState, _setGlobalState]: [
    IGlobalState, (state: (state: IGlobalState) => IGlobalState) => void
  ] = useState({
    drawerState: false,
    taskManagerState: false,
    taskManagerPosition: {
      direction: media === 'desktop' ? 'left' : 'right',
      top: 50,
      lastTop: 50
    },
    launcherState: media === 'mobile'
  } as IGlobalState);

  useEffect(() => {
    _setGlobalState(state => ({
      ...state,
      launcherState: media === 'mobile'
    }));
  }, [media]);

  useEffect(() => {
    wsEventEmitter.on('message', (msg: string) => {
      try {
        const { head, data } = JSON.parse(msg);
        if (head === '#init') {
          _setTasks(tasks => ({
            ...tasks,
            [data.id]: {
              ...tasks[data.id],
              connection: 'access'
            }
          }));
        } else if (head === '#destory') {
          return;
        } else if (head === '#error') {
          console.error('WebSocket:', data.msg);
        } else {
          _setTasks(tasks => ({
            ...tasks,
            [head]: {
              ...tasks[head],
              state: {
                ...tasks[head].state,
                ...data
              }
            }
          }));
        }
      } catch (e) {
        console.error(e);
      }
    })
  }, []);

  function generateTask(
    pkg: string, page?: string, initState?: IState
  ) {
    const id = generate();
    wsEventEmitter.emit('send', { head: '#init', data: { id, pkg } });
    _setTasks(tasks => Object.keys(tasks).reduce((obj, id: string) => ({
      ...obj,
      [id]: {
        ...tasks[id],
        windowInfo: {
          ...tasks[id].windowInfo,
          status: 'notActive'
        }
      }
    }), {
      [id]: {
        pkg,
        page: page || apps[pkg].defaultPage || 'default',
        state: {
          ...(initState || {}),
          ...(apps[pkg].defaultState || {})
        },
        connection: 'loading',
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
          taskManagerOrder: Object.keys(tasks).length + 1,
          mergeGrid: [],
          subWindow: [],
          parentWindow: ''
        }
      }
    } as ITaskInfo));
  }

  function destoryTask(id: string) {
    wsEventEmitter.emit('send', { head: '#destory', data: { id } });
    _setTasks(tasks => Object.keys(tasks).filter(n => n !== id).reduce(
      (obj: { [key: string]: ITask }, key: string) => ({
        ...obj,
        [key]: {
          ...tasks[key],
          windowInfo: {
            ...tasks[key].windowInfo,
            priority:
              tasks[key].windowInfo.priority > tasks[id].windowInfo.priority ?
                tasks[key].windowInfo.priority - 1 :
                tasks[key].windowInfo.priority,
            taskManagerOrder:
              tasks[key].windowInfo.taskManagerOrder > tasks[id].windowInfo.taskManagerOrder ?
                tasks[key].windowInfo.priority - 1 :
                tasks[key].windowInfo.priority
          }
        }
      }), {}));
  }

  function setPage(id: string, page: string) {
    if (Object.keys(apps[tasks[id].pkg].contentComponent).indexOf(page) < 0) {
      throw Error(`Unknown page '${page}' at '${tasks[id].pkg}[${id}]'.`);
    }
    _setTasks(tasks => ({
      ...tasks,
      [id]: {
        ...tasks[id],
        page
      }
    }));
    _setGlobalState(globalState => ({
      ...globalState,
      drawerState: false
    }));
  }

  function setState(id: string, state: IState) {
    _setTasks(tasks => ({
      ...tasks,
      [id]: {
        ...tasks[id],
        state: {
          ...tasks[id].state,
          ...state
        }
      }
    }));
  }

  function setWindowInfo(id: string, info: IWindowInfo) {
    _setTasks(tasks => ({
      ...tasks,
      [id]: {
        ...tasks[id],
        windowInfo: {
          ...tasks[id].windowInfo,
          ...info
        }
      }
    }));
  }

  function setActiveTask(id: string) {
    _setTasks(tasks => Object.keys(tasks).reduce((obj, key: string) => ({
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

  function propsGenerator(
    key: string, page: string, state: IState
  ): IProps {
    return {
      mediaMode: media,
      windowInfo: tasks[key].windowInfo,
      setWindowInfo(info: IWindowInfo) { setWindowInfo(key, info); },
      page,
      setPage(page: string) { setPage(key, page); },
      state: tasks[key].state,
      setState(state: IState) { setState(key, state); },
      globalState,
      setGlobalState,
      generateTask,
      destoryTask
    };
  }

  function setGlobalState(state: {
    drawerState?: boolean, launcherState?: boolean, taskManagerState?: boolean
  }) {
    _setGlobalState(globalState => ({
      ...globalState,
      ...state
    }))
  }

  return <TaskManagerContext.Provider value={{
    tasks,
    globalState,
    setGlobalState,
    generateTask,
    destoryTask,
    propsGenerator,
    setPage,
    setState,
    setWindowInfo,
    setActiveTask
  }}>
    {children}
  </TaskManagerContext.Provider>;
}
