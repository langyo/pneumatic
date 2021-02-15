import React, { useState, useContext } from 'react';
import Draggable, { DraggableData } from 'react-draggable';
import { css, cx, keyframes } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiMenu } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import {
  TaskManagerContext, IWindowInfo, IState,
  ITaskInfo, IGenerateTask, IDestoryTask,
  ISetPage, ISetState, ISetWindowInfo, ISetActiveTask
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
    tasks, generateTask, destoryTask,
    setPage, setState, setWindowInfo, setActiveTask
  }: {
    tasks: ITaskInfo, generateTask: IGenerateTask, destoryTask: IDestoryTask,
    setPage: ISetPage, setState: ISetState,
    setWindowInfo: ISetWindowInfo, setActiveTask: ISetActiveTask
  } = useContext(TaskManagerContext);
  const { apps }: { apps: { [pkg: string]: IApp } } = useContext(ApplicationProviderContext);
  const [isLauncherShow, setLauncherShow] = useState(false);
  const [isLauncherExist, setLauncherExist] = useState(false);

  function propsGenerator(key: string, page: string, state: IState) {
    return {
      mediaMode: 'desktop',
      windowInfo: tasks[key].windowInfo,
      setWindowInfo(info: IWindowInfo) { setWindowInfo(key, info); },
      page,
      setPage(page: string) { setPage(key, page); },
      state,
      setState(state: IState) { setState(key, state); },
      isDrawerShow: false,
      setDrawerShow(_status: boolean) { },
      generateTask,
      destoryTask
    };
  }

  const activeTaskId = Object.keys(tasks).find(
    (id: string) => tasks[id].windowInfo.status === 'active' ? id : undefined
  );

  return <div className={css`
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
  `}>
    {Object.keys(tasks).map((key: string) => {
      const {
        pkg, page, state,
        windowInfo: {
          status, left, top, width, height, title, priority
        }
      } = tasks[key];

      return <Draggable
        position={{ x: left, y: top }}
        handle='.drag-handle-tag'
        onStop={(_e: Event, state: DraggableData) => setWindowInfo(key, {
          left: state.x,
          top: state.y
        })}
      >
        <div className={css`
          width: ${width}px;
          height: ${height}px;
          position: fixed;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          backdrop-filter: blur(2px);
          z-index: ${5000 + priority};
        `}>
          <div className={css`
            width: 100%;
            height: 32px;
            position: absolute;
            top: 0px;
            ${status === 'active' ?
              'background: rgba(0, 0, 0, 0.4);' :
              'background: rgba(0, 0, 0, 0.2);'};
            user-select: none;
            border-radius: 4px 4px 0px 0px;
          `}
            onMouseDown={() => setActiveTask(key)}
          >
            <div className={css`
              position: absolute;
              top: 0px;
              left: 4px;
              margin: 4px;
              height: 24px;
              color: rgba(255, 255, 255, 1);
            `}>
              <Icon path={apps[pkg].icon} size={1} color='rgba(255, 255, 255, 1)' />
            </div>
            <div className={css`
              position: absolute;
              top: 0px;
              left: 48px;
              height: 32px;
              line-height: 32px;
              font-size: 16px;
              color: rgba(255, 255, 255, 1);
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
              color: rgba(255, 255, 255, 1);
              border-radius: 4px;
              &:hover {
                background: rgba(0, 0, 0, 0.2);
              }
              &:active {
                background: rgba(0, 0, 0, 0.4);
            `}
              onClick={() => destoryTask(key)}
            >
              <Icon path={mdiClose} size={1} color='rgba(255, 255, 255, 1)' />
            </div>
          </div>
          <div className={css`
            width: calc(40% - 2px);
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            left: 0px;
          `}
            onMouseDown={() => setActiveTask(key)}
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
                apps[pkg].drawerComponent[page](propsGenerator(key, page, state)) :
                apps[pkg].drawerComponent.default(propsGenerator(key, page, state))}
            </Scrollbars>
          </div>
          <div className={css`
            width: 60%;
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            right: 0px;
          `}
            onMouseDown={() => setActiveTask(key)}
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
                apps[pkg].contentComponent[page](propsGenerator(key, page, state)) :
                apps[pkg].contentComponent.default(propsGenerator(key, page, state))}
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
      color: rgba(255, 255, 255, 1);
    `}>
      {Object.keys(tasks).sort(
        (left, right) =>
          tasks[left].windowInfo.taskManagerOrder - tasks[right].windowInfo.taskManagerOrder
      ).map(key => {
        const { icon, name } = apps[tasks[key].pkg];
        const { title } = tasks[key].windowInfo;

        return <div className={css`
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          ${key === activeTaskId && 'background: rgba(0, 0, 0, 0.2);'}
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
          &:hover::after {
            position: absolute;
            line-height: 48px;
            font-size: 16px;
            content: "${`${name}${title !== '' ? ` - ${title}` : ''}`}";
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
          onClick={() => setActiveTask(key)}
        >
          <Icon path={icon} size={1} color='rgba(255, 255, 255, 1)' />
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
        <Icon path={mdiMenu} size={1} color='rgba(255, 255, 255, 1)' />
      </div>
    </div>
    <div className={css`
      ${isLauncherExist ? '' : 'display: none;'}
    `}>
      <div className={css`
        ${isLauncherShow ? fadeIn : fadeOut}
      `}>
        <div className={css`
          position: fixed;
          left: 0px;
          top: 0px;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          z-index: 9999;
        `}
          onClick={() => (setLauncherShow(false), setTimeout(() => setLauncherExist(false), 500))}
        />
        <div className={css`
          position: fixed;
          left: 100px;
          top: 10%;
          width: calc(50% - 100px);
          height: 80%;
          z-index: 10000;
          user-select: none;
        `}>
          <div className={css`
            width: calc(100% - 32px);
            padding: 16px 32px;
            line-height: 36px;
            font-size: 32px;
            text-align: left;
            color: rgba(255, 255, 255, 1);
          `}>
            {'Launcher'}
          </div>
          <div className={css`
            padding: 16px;
            display: grid;
            grid-template-rows: repeat(auto-fill, 100px);
            grid-template-columns: repeat(4, 25%);
            gap: 8px;
            justify-items: center;
            justify-content: center;
          `}>
            {Object.keys(apps).map(pkg => {
              const { icon, name } = apps[pkg];
              return <div className={css`
                width: 120px;
                height: 100px;
                padding: 4px;
                display: flex;
                flex-direction: column;
                font-size: 16px;
                line-height: 20px;
                text-align: center;
                color: rgba(255, 255, 255, 1);
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
                  generateTask(pkg);
                }}
              >
                <div className={css`
                height: 48px;
                width: 48px;
                margin: 4px 36px;
              `}>
                  <Icon path={icon} size={2} color='rgba(255, 255, 255, 1)' />
                </div>
                {name}
              </div>;
            })}
          </div>
        </div>
      </div>
    </div>
  </div>;
}
