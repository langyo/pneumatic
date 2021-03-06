import React, { createContext, useContext, useEffect, useState } from 'react';
import { wsSocket } from './authProviderContext';
import { AppProviderContext, IAppProviderContext } from './appProviderContext';
import { ThemeProviderContext } from './themeProviderContext';
import { generate } from 'shortid';

export const TaskManagerContext = createContext({} as ITaskManagerContext);
export interface ITask {
  pkg: '#merge' | string,     // The embedded package format is 'pneumatic.*'.
  page: string,               // The default page is 'default'.
  sharedState: { [key: string]: string | number | boolean },
  windowInfo: IWindowInfo
};

export interface IGlobalState {
  drawerState: boolean,
  launcherState: boolean,
  taskManagerState: boolean,
  taskManagerPosition: {
    direction: 'left' | 'right',
    top: number,              // It is invalid on desktop.
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
export type ISharedState = { [key: string]: any };
export interface IProps {
  mediaMode: 'desktop' | 'mobile',
  windowInfo: IWindowInfo,
  setWindowInfo: (info: IWindowInfo) => void,
  page: string,
  setPage: (page: string) => void,
  sharedState: ISharedState,
  setSharedState: (sharedState: ISharedState) => void,
  globalState: IGlobalState,
  setGlobalState: ISetGlobalState,
  generateTask: IGenerateTask,
  destoryTask: IDestoryTask
}

export type ITaskMap = { [key: string]: ITask };
export type IGenerateTask = (pkg: string, page?: string, initState?: ISharedState) => void;
export type IDestoryTask = (id: string) => void;
export type ISetPage = (id: string, page: string) => void;
export type ISetSharedState = (id: string, state: ISharedState) => void;
export type ISetWindowInfo = (id: string, info: Partial<IWindowInfo>) => void;
export type ISetActiveTask = (id: string) => void;
export type IPropsGenerator = (
  key: string, page: string, sharedState: ISharedState
) => IProps;

export interface ITaskManagerContext {
  tasks: ITaskMap,
  globalState: IGlobalState,
  setGlobalState: ISetGlobalState,
  generateTask: IGenerateTask,
  destoryTask: IDestoryTask,
  setPage: ISetPage,
  setSharedState: ISetSharedState,
  setWindowInfo: ISetWindowInfo,
  setActiveTask: ISetActiveTask,
  propsGenerator: IPropsGenerator
};

export function TaskManager({ children }: { children?: any }) {
  const { media } = useContext(ThemeProviderContext);
  const [tasks, setTasksInside]: [
    ITaskMap, (tasks: (tasks: ITaskMap) => ITaskMap) => void
  ] = useState({});
  const [globalState, setGlobalStateInside]: [
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
  type ITaskGenerateCacheItem = {
    id: string, pkg: string, page: string, initState: { [key: string]: any }
  };
  const [_generateTaskCache, setGenerateTaskCache] = useState([] as ITaskGenerateCacheItem[]);

  useEffect(() => {
    setGlobalStateInside(state => ({
      ...state,
      launcherState: media === 'mobile',
      taskManagerPosition: {
        direction: media === 'desktop' ? 'left' : 'right',
        top: state.taskManagerPosition.top
      }
    }));
  }, [media]);

  useEffect(() => {
    wsSocket.receive('#init', ({ id, pkg, page, sharedState, windowInfo }) => {
      setTasksInside(tasks => Object.keys(tasks).reduce((obj, key) => ({
        ...obj,
        [key]: {
          ...tasks[key],
          windowInfo: {
            ...tasks[key].windowInfo,
            status: 'notActive'
          }
        }
      }), {
        [id]: {
          pkg, page,
          sharedState,
          windowInfo: {
            status: 'active',
            left: windowInfo?.left || 100 + Object.keys(tasks).length * 20,
            top: windowInfo?.top || 50 + Object.keys(tasks).length * 20,
            width: windowInfo?.width || 600,
            height: windowInfo?.height || 400,
            title: windowInfo?.title || '',
            priority: Object.keys(tasks).length + 1,
            taskManagerOrder: Object.keys(tasks).length + 1,
            mergeGrid: [],
            subWindow: [],
            parentWindow: ''
          }
        }
      }));
      setGlobalStateInside(state => ({
        ...state,
        launcherState: false
      }));
    });
    wsSocket.receive('#destory', _data => void 0);
    wsSocket.receive('#error', ({ msg }) => {
      console.error('Remote error:', msg);
    });
    wsSocket.receive('#set-shared-state', ({ id, data }) => {
      setTasksInside(tasks => ({
        ...tasks,
        ...(tasks[id] ? {
          [id]: {
            ...tasks[id],
            sharedState: {
              ...(tasks[id]?.sharedState || {}),
              ...(data || {})
            }
          }
        } : {})
      }));
    })
  }, []);

  function generateTask(
    pkg: string, page?: string, initState?: ISharedState
  ) {
    const id = generate();
    wsSocket.send('#init', { id, pkg, page, initState });
  }

  function destoryTask(id: string) {
    wsSocket.send('#destory', { id });
    setTasksInside(tasks => Object.keys(tasks).filter(n => n !== id).reduce(
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
    setTasksInside(tasks => ({
      ...tasks,
      [id]: {
        ...tasks[id],
        page
      }
    }));
    setGlobalStateInside(globalState => ({
      ...globalState,
      drawerState: false
    }));
  }

  function setSharedState(id: string, state: ISharedState) {
    setTasksInside(tasks => ({
      ...tasks,
      [id]: {
        ...tasks[id],
        sharedState: {
          ...tasks[id].sharedState,
          ...state
        }
      }
    }));
    wsSocket.send('#set-shared-state', { id, state });
  }

  function setWindowInfo(id: string, info: Partial<IWindowInfo>) {
    setTasksInside(tasks => ({
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
    setTasksInside(tasks => Object.keys(tasks).reduce((obj, key: string) => ({
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
    }) as ITaskMap, {}));
  }

  function propsGenerator(
    key: string, page: string, sharedState: ISharedState = {}
  ): IProps {
    return {
      mediaMode: media,
      windowInfo: tasks[key].windowInfo,
      setWindowInfo(info: IWindowInfo) { setWindowInfo(key, info); },
      page,
      setPage(page: string) { setPage(key, page); },
      sharedState,
      setSharedState(state: ISharedState) { setSharedState(key, state); },
      globalState,
      setGlobalState,
      generateTask,
      destoryTask
    };
  }

  function setGlobalState(state: {
    drawerState?: boolean, launcherState?: boolean, taskManagerState?: boolean
  }) {
    setGlobalStateInside(globalState => ({
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
    setSharedState,
    setWindowInfo,
    setActiveTask
  }}>
    {children}
  </TaskManagerContext.Provider>;
}
