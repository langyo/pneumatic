import React, { useState, useContext } from 'react';
import { css, keyframes } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { generate } from 'shortid';

import {
  TaskManagerContext, IWindowInfo,
  ITasksState, ITaskSetState,
  IActiveTasksState, IActiveTasksSetState
} from './taskManagerContext';
import { ApplicationProviderContext, IApp } from './appProviderContext';

const fadeIn = `animation: ${keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`} 0.5s ease 1`;
const fadeOut = `animation: ${keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`} 0.55s ease 1`;

export function TaskViewMobile() {
  const {
    tasks, setTasks,
    activeTasks, setActiveTasks
  }: {
    tasks: ITasksState, setTasks: ITaskSetState,
    activeTasks: IActiveTasksState, setActiveTasks: IActiveTasksSetState
  } = useContext(TaskManagerContext);
  const { apps }: { apps: { [pkg: string]: IApp } } = useContext(ApplicationProviderContext);
  const [isDrawerShow, setDrawerShow] = useState(false);
  const [isDrawerExist, setDrawerExist] = useState(false);
  const [isTaskManagerShow, setTaskManagerShow] = useState(false);
  const [isTaskManagerExist, setTaskManagerExist] = useState(false);
  const [isLauncherShow, setLauncherShow] = useState(activeTasks.length === 0);

  function propsGenerator(
    key: string, pkg: string, page: string, args: { [key: string]: string }
  ) {
    return {
      args,
      mediaMode: 'mobile',
      title: tasks[key].windowInfo.title,
      setTitle(title: string) {
        setTasks({
          ...tasks,
          [key]: {
            ...tasks[key],
            windowInfo: {
              ...tasks[key].windowInfo,
              title
            }
          }
        });
      },
      page,
      setPage(page: string) {
        if (Object.keys(apps[pkg].contentComponent).indexOf(page) < 0) {
          throw Error(`Unknown page '${page}' at the package '${pkg}'.`);
        }
        setTasks({
          ...tasks,
          [key]: {
            ...tasks[key],
            page
          }
        });
      },
      isDrawerShow,
      setDrawerShow(status: boolean) {
        setDrawerShow(status);
        if (!status) {
          setTimeout(() => setDrawerExist(false), 500);
        }
      },
      createApplication({ pkg, page, args }: {
        pkg: string, page: string, args: { [key: string]: string }
      }) {
        const key = generate();
        setTasks({
          ...tasks,
          [key]: {
            pkg, page, args,
            windowInfo: {
              top: 50, left: 50, height: 400, width: 600,
              ...(apps[pkg].defaultWindowInfo || {})
            }
          }
        });
      }
    };
  }

  return <div className={css`
    position: fixed;
    height: 100%;
    width: 100%;
    user-select: none;
  `}>
    <div className={css`
      position: absolute;
      top: 0px;
      height: 48px;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
    `}>
      {!isLauncherShow && activeTasks.length > 0 && <>
        <div className={css`
          position: absolute;
          top: 0px;
          left: 4px;
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
          &:active {
            background: rgba(0, 0, 0, 0.4);
          }
        `}
          onClick={() => (
            setDrawerShow(!isDrawerShow),
            isDrawerShow ? setTimeout(() => setDrawerExist(false), 500) : setDrawerExist(true)
          )}>
          <Icon path={apps[tasks[activeTasks[0]].pkg].icon} size={1} color='#fff' />
        </div>
        <div className={css`
          position: absolute;
          top: 0px;
          left: 52px;
          height: ${tasks[activeTasks[0]].windowInfo.title.trim() !== '' ? 28 : 48}px;
          line-height: ${tasks[activeTasks[0]].windowInfo.title.trim() !== '' ? 28 : 48}px;
          font-size: ${tasks[activeTasks[0]].windowInfo.title.trim() !== '' ? 16 : 24}px;
          color: #fff;
        `}>
          {apps[tasks[activeTasks[0]].pkg].name}
        </div>
        {tasks[activeTasks[0]].windowInfo.title && <div className={css`
          position: absolute;
          bottom: 4px;
          left: 52px;
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          color: #fff;
        `}>
          {tasks[activeTasks[0]].windowInfo.title}
        </div>}
      </>}
      {isLauncherShow &&
        <div className={css`
          position: absolute;
          top: 0px;
          left: 20px;
          height: 48px;
          line-height: 48px;
          font-size: 24px;
          color: #fff;
        `}>
          {'Launcher'}
        </div>
      }
      {!isTaskManagerShow && Object.keys(tasks).length > 0 &&
        <div className={css`
          position: absolute;
          top: 0px;
          right: 4px;
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
          &:active {
            background: rgba(0, 0, 0, 0.4);
          }
        `}
          onClick={() => (
            setTaskManagerShow(true), setTaskManagerExist(true),
            setDrawerShow(false), setTimeout(() => setDrawerExist(false), 500)
          )}
        >
          <Icon path={mdiFullscreenExit} size={1} color='#fff' />
        </div>
      }
      {isTaskManagerExist && <div className={css`
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 10000;
        backdrop-filter: blur(2px);
        ${isTaskManagerShow ? fadeIn : fadeOut};
      `}>
        <div className={css`
          position: absolute;
          top: 0px;
          left: 20px;
          height: 48px;
          line-height: 48px;
          font-size: 24px;
          color: #fff;
          user-select: none;
        `}>
          {'Task Manager'}
        </div>
        <div className={css`
          position: absolute;
          top: 0px;
          right: 4px;
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
          &:active {
            background: rgba(0, 0, 0, 0.4);
          }
        `}
          onClick={() => (
            setTaskManagerShow(false), setTimeout(() => setTaskManagerExist(false), 500)
          )}>
          <Icon path={mdiFullscreen} size={1} color='#fff' />
        </div>
      </div>}
    </div>
    <div className={css`
      position: absolute;
      top: 50px;
      height: calc(100% - 50px);
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
    `}>
      {isTaskManagerExist && <div className={css`
        position: absolute;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-context: flex-start;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(2px);
        ${isTaskManagerShow ? fadeIn : fadeOut}
      `}>
        {Object.keys(tasks).map((key: string) => {
          const pkg = tasks[key].pkg;
          const { title }: IWindowInfo = tasks[key].windowInfo;

          return <div className={css`
            margin-top: 4px;
            height: 48px;
            width: calc(90% - 12px);
            border-left: 12px solid ${activeTasks.indexOf(key) >= 0 ?
              'rgba(0, 0, 0, 0.6)' :
              'rgba(0, 0, 0, 0.2)'};
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.2);
            position: relative;
            ${fadeIn}
          `}
            onClick={() => (
              setActiveTasks([key]),
              setDrawerShow(false), setTimeout(() => setDrawerExist(false), 500),
              setTaskManagerShow(false), setTimeout(() => setTaskManagerExist(false), 500),
              setLauncherShow(false)
            )}
          >
            <div className={css`
              position: absolute;
              top: 0px;
              left: 16px;
              height: ${title ? 28 : 48}px;
              line-height: ${title ? 28 : 48}px;
              font-size: ${title ? 16 : 24}px;
              color: #fff;
            `}>
              {apps[pkg].name}
            </div>
            {title && <div className={css`
              position: absolute;
              bottom: 4px;
              left: 16px;
              height: 16px;
              line-height: 16px;
              font-size: 12px;
              color: #fff;
            `}>
              {title}
            </div>}
            <div className={css`
              position: absolute;
              top: 8px;
              right: 4px;
              margin: 4px;
              border-radius: 4px;
              &:hover {
                background: rgba(0, 0, 0, 0.2);
              }
              &:active {
                background: rgba(0, 0, 0, 0.4);
              }
            `}>
              <Icon path={mdiClose} size={1} color='#fff' />
            </div>
          </div>;
        })}
        <div className={css`
          position: absolute;
          height: 48px;
          width: 100%;
          bottom: 0px;
          text-align: center;
          font-size: 24px;
          color: #fff;
          line-height: 48px;
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
          &:active {
            background: rgba(0, 0, 0, 0.4);
          }
        `}
          onClick={() => (
            setLauncherShow(true),
            setDrawerShow(false), setTimeout(() => setDrawerExist(false), 500),
            setTaskManagerShow(false), setTimeout(() => setTaskManagerExist(false), 500)
          )}
        >
          {'Back to the launcher'}
        </div>
      </div>}
      {!isLauncherShow && activeTasks.length > 0 && (
        apps[tasks[activeTasks[0]].pkg]
          .contentComponent[tasks[activeTasks[0]].page] ?
          apps[tasks[activeTasks[0]].pkg]
            .contentComponent[tasks[activeTasks[0]].page](
              propsGenerator(
                activeTasks[0],
                tasks[activeTasks[0]].pkg,
                tasks[activeTasks[0]].page,
                tasks[activeTasks[0]].args
              )) :
          apps[tasks[activeTasks[0]].pkg]
            .contentComponent.default(propsGenerator(
              activeTasks[0],
              tasks[activeTasks[0]].pkg,
              tasks[activeTasks[0]].page,
              tasks[activeTasks[0]].args
            )))}
      {isLauncherShow && <div className={css`
        margin: 8px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
      `}>
        {Object.keys(apps).map(key => {
          const {
            icon, name,
            defaultPage, defaultArgs, defaultWindowInfo
          } = apps[key];
          return <div className={css`
            padding: 0px calc((25% - 60px) / 2 - 4px);
          `}>
            <div className={css`
              width: 60px;
              height: 80px;
              padding: 4px;
              display: flex;
              flex-direction: column;
              font-size: 12px;
              line-height: 16px;
              text-align: center;
              color: #fff;
              border-radius: 4px;
              &:hover {
                background: rgba(0, 0, 0, 0.2);
              }
              &:active {
                background: rgba(0, 0, 0, 0.4);
              }
            `}
              onClick={() => {
                setLauncherShow(false);

                const id = generate();
                setTasks({
                  ...tasks,
                  [id]: {
                    pkg: key,
                    page: defaultPage || 'default',
                    args: defaultArgs || {},
                    windowInfo: defaultWindowInfo ? {
                      left: 100,
                      top: 50,
                      width: 600,
                      height: 400,
                      title: '',
                      ...defaultWindowInfo
                    } : {
                        left: 100,
                        top: 50,
                        width: 600,
                        height: 400,
                        title: ''
                      }
                  }
                });
                setActiveTasks([id]);
              }}
            >
              <div className={css`
                height: 36px;
                width: 36px;
                margin: 4px 12px 0px 12px;
              `}>
                <Icon path={icon} size={1.5} color='#fff' />
              </div>
              {name}
            </div>
          </div>;
        })}
      </div>}
    </div>
    {
      isDrawerExist && <div className={css`
        position: absolute;
        top: 50px;
        height: 100%;
        width: 100%;
        z-index: 5000;
        backdrop-filter: blur(2px);
        ${isDrawerShow ? fadeIn : fadeOut}
      `}>
        <div className={css`
          position: absolute;
          left: 0px;
          top: 0px;
          height: 100%;
          width: 60%;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 0px 4px 4px 0px;
        `}>
          {activeTasks.length > 0 && (
            apps[tasks[activeTasks[0]].pkg]
              .drawerComponent[tasks[activeTasks[0]].page] ?
              apps[tasks[activeTasks[0]].pkg]
                .drawerComponent[tasks[activeTasks[0]].page](propsGenerator(
                  activeTasks[0],
                  tasks[activeTasks[0]].pkg,
                  tasks[activeTasks[0]].page,
                  tasks[activeTasks[0]].args
                )) :
              apps[tasks[activeTasks[0]].pkg]
                .drawerComponent.default(propsGenerator(
                  activeTasks[0],
                  tasks[activeTasks[0]].pkg,
                  tasks[activeTasks[0]].page,
                  tasks[activeTasks[0]].args
                )))}
        </div>
        <div className={css`
          position: absolute;
          right: 0px;
          top: 0px;
          height: 100%;
          width: 40%;
          background: rgba(0, 0, 0, 0.2);
        `}
          onClick={() => (setDrawerShow(false), setTimeout(() => setDrawerExist(false), 500))}
        />
      </div>
    }
  </div >;
}
