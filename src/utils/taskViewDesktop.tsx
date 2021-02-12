import React, { useState, useContext } from 'react';
import Draggable from 'react-draggable';
import { css, cx, keyframes } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiMenu } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';
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

export function TaskViewDesktop() {
  const {
    tasks, setTasks,
    activeTasks, setActiveTasks
  }: {
    tasks: ITasksState, setTasks: ITaskSetState,
    activeTasks: IActiveTasksState, setActiveTasks: IActiveTasksSetState
  } = useContext(TaskManagerContext);
  const { apps }: { apps: { [pkg: string]: IApp } } = useContext(ApplicationProviderContext);
  const [isLauncherShow, setLauncherShow] = useState(false);
  const [isLauncherExist, setLauncherExist] = useState(false);

  function propsGenerator(
    key: string, pkg: string, page: string, args: { [key: string]: string }
  ) {
    return {
      args,
      mediaMode: 'desktop',
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
      isDrawerOpen: false,
      setDrawerStatus(_status: boolean) { },
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
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  `}>
    {Object.keys(tasks).map((key: string) => {
      const pkg = tasks[key].pkg;
      const page = tasks[key].page;
      const args = tasks[key].args;
      const {
        left, top, width, height, title
      }: IWindowInfo = tasks[key].windowInfo;

      return <Draggable
        defaultPosition={{ x: left, y: top }}
        handle='.drag-handle-tag'
      >
        <div className={css`
          width: ${width}px;
          height: ${height}px;
          position: fixed;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          backdrop-filter: blur(2px);
          ${activeTasks.indexOf(key) >= 0 ? `z-index: 5000;` : ''}
        `}>
          <div className={css`
            width: 100%;
            height: 32px;
            position: absolute;
            top: 0px;
            ${activeTasks.indexOf(key) >= 0 ?
              'background: rgba(0, 0, 0, 0.4);' :
              'background: rgba(0, 0, 0, 0.2);'};
            user-select: none;
            border-radius: 4px 4px 0px 0px;
          `}
            onMouseDown={() => setActiveTasks([key])}
          >
            <div className={css`
              position: absolute;
              top: 0px;
              left: 4px;
              margin: 4px;
              height: 24px;
              color: #fff;
            `}>
              <Icon path={apps[pkg].icon} size={1} color='#fff' />
            </div>
            <div className={css`
              position: absolute;
              top: 0px;
              left: 48px;
              height: 32px;
              line-height: 32px;
              font-size: 16px;
              color: #fff;
            `}>
              {`${apps[pkg].name}${title ? ` - ${title}` : ''}`}
            </div>
            <div className={cx(css`
              position: absolute;
              top: 0px;
              left: 0px;
              width: calc(100% - 32px);
              height: 32px;
            `, 'drag-handle-tag')} />
            <div className={css`
              position: absolute;
              top: 0px;
              right: 0px;
              height: 24px;
              margin: 4px;
              color: #fff;
              border-radius: 4px;
              &:hover {
                background: rgba(0, 0, 0, 0.2);
              }
              &:active {
                background: rgba(0, 0, 0, 0.4);
            `}>
              <Icon path={mdiClose} size={1} color='#fff' />
            </div>
          </div>
          <div className={css`
            width: calc(40% - 2px);
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            left: 0px;
          `}
            onMouseDown={() => setActiveTasks([key])}
          >
            <div className={css`
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 0px 0px 0px 4px;
              background: rgba(0, 0, 0, 0.2);
            `} />
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
              position: absolute;
            `}>
              {apps[pkg].drawerComponent[page] ?
                apps[pkg].drawerComponent[page](propsGenerator(key, pkg, page, args)) :
                apps[pkg].drawerComponent.default(propsGenerator(key, pkg, page, args))}
            </Scrollbars>
          </div>
          <div className={css`
            width: 60%;
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            right: 0px;
          `}
            onMouseDown={() => setActiveTasks([key])}
          >
            <div className={css`
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 0px 0px 4px 0px;
              background: rgba(0, 0, 0, 0.2);
            `} />
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
              position: absolute;
            `}>
              {apps[pkg].contentComponent[page] ?
                apps[pkg].contentComponent[page](propsGenerator(key, pkg, page, args)) :
                apps[pkg].contentComponent.default(propsGenerator(key, pkg, page, args))}
            </Scrollbars>
          </div>
        </div>
      </Draggable>;
    })}
    <div className={css`
      position: fixed;
      top: 10%;
      left: 0px;
      height: calc(80% - 8px);
      width: 48px;
      padding: 4px;
      z-index: 10000;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0px 4px 4px 0px;
      backdrop-filter: blur(2px);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      user-select: none;
      color: #fff;
    `}>
      {Object.keys(tasks).map(key => {
        const { icon, name } = apps[tasks[key].pkg];
        const { title } = tasks[key].windowInfo;
        const isActive = activeTasks.indexOf(key) >= 0;

        return <div className={css`
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          ${isActive && 'background: rgba(0, 0, 0, 0.2);'}
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
          &:hover::after {
            position: absolute;
            line-height: 48px;
            font-size: 16px;
            content: "${`${name}${title.trim() !== '' ? ` - ${title}` : ''}`}";
            white-space: nowrap;
            left: 72px;
            height: 48px;
            margin: -12px;
            padding: 0px 4px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.4);
            ${fadeIn}
          }
          &:active {
            background: rgba(0, 0, 0, 0.4);
          }
        `}
          onClick={() => setActiveTasks([key])}
        >
          <Icon path={icon} size={1} color='#fff' />
        </div>
      })}
      <div className={css`
        position: absolute;
        left: 4px;
        bottom: 8px;
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
        onClick={() => (isLauncherShow ?
          (setLauncherShow(false), setTimeout(() => setLauncherExist(false), 500)) :
          (setLauncherShow(true), setLauncherExist(true)))}
      >
        <Icon path={mdiMenu} size={1} color='#fff' />
      </div>
    </div>
    {isLauncherExist && <div className={css`
      position: fixed;
      left: 100px;
      top: 10%;
      width: calc(50% - 100px);
      height: 80%;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      z-index: 10000;
      ${isLauncherShow ? fadeIn : fadeOut}
    `}>
      <div className={css`
        margin: 8px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: flex-start;
        user-select: none;
      `}>
        {Object.keys(apps).map(key => {
          const {
            icon, name,
            defaultPage, defaultArgs, defaultWindowInfo
          } = apps[key];
          return <div className={css`
            width: 120px;
            height: 100px;
            padding: 4px;
            display: flex;
            flex-direction: column;
            font-size: 16px;
            line-height: 20px;
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
              setTimeout(() => setLauncherExist(false), 500);

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
              height: 48px;
              width: 48px;
              margin: 4px 36px;
            `}>
              <Icon path={icon} size={2} color='#fff' />
            </div>
            {name}
          </div>;
        })}
      </div>
    </div>}
  </div>;
}
