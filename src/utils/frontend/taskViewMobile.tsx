import React, { useState, useContext } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import { Fade } from './components/transition';
import {
  TaskManagerContext, IWindowInfo, IState, ITaskManagerContext
} from './taskManagerContext';
import { ApplicationProviderContext, IApp } from './appProviderContext';


export function TaskViewMobile() {
  const {
    tasks, generateTask, destoryTask,
    propsGenerator, setActiveTask,
    globalState: {
      drawerState, launcherState, taskManagerState
    }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const { apps }: { apps: { [pkg: string]: IApp } } = useContext(ApplicationProviderContext);

  const activeTaskId = Object.keys(tasks).find(
    (id: string) => tasks[id].windowInfo.status === 'active' ? id : undefined
  );

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
      <Fade on={!launcherState}>
        {activeTaskId && <>
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
            onClick={() => setGlobalState({
              drawerState: !drawerState
            })}>
            <Icon path={apps[tasks[activeTaskId].pkg].icon} size={1} color='rgba(255, 255, 255, 1)' />
          </div>
          <div className={css`
            position: absolute;
            top: 0px;
            left: 52px;
            height: ${tasks[activeTaskId].windowInfo.title !== '' ? 28 : 48}px;
            line-height: ${tasks[activeTaskId].windowInfo.title !== '' ? 28 : 48}px;
            font-size: ${tasks[activeTaskId].windowInfo.title !== '' ? 16 : 24}px;
            color: rgba(255, 255, 255, 1);
          `}>
            {apps[tasks[activeTaskId].pkg].name}
          </div>
          {tasks[activeTaskId].windowInfo.title && <div className={css`
            position: absolute;
            bottom: 4px;
            left: 52px;
            height: 16px;
            line-height: 16px;
            font-size: 12px;
            color: rgba(255, 255, 255, 1);
          `}>
            {tasks[activeTaskId].windowInfo.title}
          </div>}
        </>}
      </Fade>
      <Fade on={launcherState}>
        <div className={css`
          position: absolute;
          top: 0px;
          left: 20px;
          height: 48px;
          line-height: 48px;
          font-size: 24px;
          color: rgba(255, 255, 255, 1);
        `}>
          {'Launcher'}
        </div>
      </Fade>
      <Fade on={!taskManagerState && Object.keys(tasks).length > 0}>
        {Object.keys(tasks).length > 0 && <div className={css`
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
          onClick={() => setGlobalState({
            taskManagerState: true,
            drawerState: false
          })}
        >
          <Icon path={mdiFullscreenExit} size={1} color='rgba(255, 255, 255, 1)' />
        </div>}
      </Fade>
      <Fade on={taskManagerState}>
        <div className={css`
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: 10000;
          backdrop-filter: blur(2px);
        `}>
          <div className={css`
            position: absolute;
            top: 0px;
            left: 20px;
            height: 48px;
            line-height: 48px;
            font-size: 24px;
            color: rgba(255, 255, 255, 1);
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
            onClick={() => setGlobalState({
              taskManagerState: false
            })}>
            <Icon path={mdiFullscreen} size={1} color='rgba(255, 255, 255, 1)' />
          </div>
        </div>
      </Fade>
    </div>

    <div className={css`
      position: absolute;
      top: 50px;
      height: calc(100% - 50px);
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
    `}>
      <Fade on={taskManagerState}>
        <div className={css`
          position: absolute;
          width: 100%;
          height: calc(100% - 50px);
          z-index: 10000;
          backdrop-filter: blur(2px);
        `}
          onClick={() => setGlobalState({
            taskManagerState: false
          })}
        >
          <Scrollbars className={css`
            width: 100%;
            height: calc(100% - 50px);
          `}>
            <div className={css`
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-context: flex-start;
              align-items: center;
            `}
            >
              {Object.keys(tasks).sort(
                (left, right) =>
                  tasks[left].windowInfo.taskManagerOrder -
                  tasks[right].windowInfo.taskManagerOrder
              ).map((key: string) => {
                const pkg = tasks[key].pkg;
                const { title }: IWindowInfo = tasks[key].windowInfo;

                return <div className={css`
                  margin-top: 4px;
                  height: 48px;
                  width: calc(90% - 12px);
                  border-left: 12px solid ${activeTaskId === key ?
                    'rgba(0, 0, 0, 0.6)' :
                    'rgba(0, 0, 0, 0.2)'};
                  border-radius: 4px;
                  background: rgba(0, 0, 0, 0.2);
                  position: relative;
                `}
                  onClick={() => (
                    setActiveTask(key),
                    setGlobalState({
                      drawerState: false,
                      launcherState: false
                    }))}
                >
                  <div className={css`
                    position: absolute;
                    top: 0px;
                    left: 16px;
                    height: ${title ? 28 : 48}px;
                    line-height: ${title ? 28 : 48}px;
                    font-size: ${title ? 16 : 24}px;
                    color: rgba(255, 255, 255, 1);
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
                    color: rgba(255, 255, 255, 1);
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
                  `}
                    onClick={(event: Event) => {
                      event.stopPropagation();
                      if (activeTaskId === key) {
                        setGlobalState({
                          launcherState: true
                        });
                      }
                      destoryTask(key);
                    }}
                  >
                    <Icon path={mdiClose} size={1} color='rgba(255, 255, 255, 1)' />
                  </div>
                </div>;
              })}
            </div>
          </Scrollbars>
        </div>
        <div className={css`
          position: absolute;
          height: 48px;
          width: 100%;
          bottom: 0px;
          text-align: center;
          font-size: 24px;
          color: rgba(255, 255, 255, 1);
          line-height: 48px;
          z-index: 10000;
          &:hover {
            background: rgba(0, 0, 0, 0.2);
          }
          &:active {
            background: rgba(0, 0, 0, 0.4);
          }
        `}
          onClick={() => setGlobalState({
            launcherState: true,
            drawerState: false,
            taskManagerState: false
          })}
        >
          {'Back to the launcher'}
        </div>
      </Fade>


      {Object.keys(tasks).map((key) => {
        const {
          pkg, page, state,
          windowInfo: {
            status
          }
        } = tasks[key];

        return <Fade on={!launcherState && status === 'active'}>
          <Scrollbars className={css`
            width: 100%;
            height: 100%;
          `}>
            {apps[pkg].contentComponent[page] ?
              apps[pkg].contentComponent[page](propsGenerator(key, page, state)) :
              apps[pkg].contentComponent.default(propsGenerator(key, page, state))}
          </Scrollbars>
        </Fade>;
      })}

      <Fade on={launcherState}>
        <Scrollbars className={css`
          width: 100%;
          height: 100%;
        `}>
          <div className={css`
            display: grid;
            margin-top: 8px;
            grid-template-rows: repeat(auto-fill, 80px);
            grid-template-columns: repeat(auto-fill, 100px);
            gap: 4px;
            justify-items: center;
            justify-content: center;
          `}>
            {Object.keys(apps).map(pkg => {
              const { icon, name } = apps[pkg];
              return <div className={css`
                width: 60px;
                height: 80px;
                padding: 4px;
                display: flex;
                flex-direction: column;
                font-size: 12px;
                line-height: 16px;
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
                onClick={() => (
                  setGlobalState({
                    launcherState: false
                  }),
                  generateTask(pkg)
                )}
              >
                <div className={css`
                  height: 36px;
                  width: 36px;
                  margin: 4px 12px 0px 12px;
                `}>
                  <Icon path={icon} size={1.5} color='rgba(255, 255, 255, 1)' />
                </div>
                {name}
              </div>;
            })}
          </div>
        </Scrollbars>
      </Fade>
    </div>

    <Fade on={drawerState}>
      <div className={css`
        position: absolute;
        top: 50px;
        height: 100%;
        width: 100%;
        z-index: 5000;
        backdrop-filter: blur(2px);
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
          {activeTaskId && (
            apps[tasks[activeTaskId].pkg]
              .drawerComponent[tasks[activeTaskId].page] ?
              apps[tasks[activeTaskId].pkg]
                .drawerComponent[tasks[activeTaskId].page](propsGenerator(
                  activeTaskId,
                  tasks[activeTaskId].page,
                  tasks[activeTaskId].state
                )) :
              apps[tasks[activeTaskId].pkg]
                .drawerComponent.default(propsGenerator(
                  activeTaskId,
                  tasks[activeTaskId].page,
                  tasks[activeTaskId].state
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
          onClick={() => setGlobalState({
            drawerState: false
          })}
        />
      </div>
    </Fade>
  </div >;
}
