import React, { useContext } from 'react';
import Draggable, { DraggableData } from 'react-draggable';
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
      drawerState, launcherState, taskManagerState, taskManagerPosition
    }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const { apps }: { apps: { [pkg: string]: IApp } } = useContext(ApplicationProviderContext);
  console.log('launcherState', launcherState)
  console.log('taskManagerState', taskManagerState)

  return <div className={css`
    position: fixed;
    height: 100%;
    width: 100%;
    user-select: none;
  `}>
    <Fade on={!taskManagerState && Object.keys(tasks).length > 0}>
      <Draggable
        position={{
          x: taskManagerPosition.direction === 'left' ? 4 : window.innerWidth - 48,
          y: taskManagerPosition.top
        }}
        onStop={(_e: Event, state: DraggableData) => {
          if (
            Math.abs(state.y - taskManagerPosition.top) > 10 ||
            state.x < window.innerWidth / 2 && state.x > 4 + 10 ||
            state.x >= window.innerWidth / 2 && state.x < window.innerWidth - 48 - 10
          ) {
            setGlobalState({
              taskManagerPosition: {
                direction: state.x < window.innerWidth / 2 ? 'left' : 'right',
                top: state.y
              }
            });
          } else {
            setGlobalState({
              taskManagerState: true,
              drawerState: false
            });
          }
        }}>
        <div className={css`
          position: fixed;
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          z-index: 10000;
          background: rgba(0, 0, 0, 0.2);
          &:hover {
            background: rgba(0, 0, 0, 0.4);
          }
          &:active {
            background: rgba(0, 0, 0, 0.8);
          }
        `}
        >
          <Icon path={mdiFullscreen} size={1} color='rgba(255, 255, 255, 1)' />
        </div>
      </Draggable>
    </Fade>

    <Fade on={taskManagerState}>
      <div className={css`
        position: fixed;
        height: 100%;
        width: 100%;
        z-index: 10000;
      `}>
        <div className={css`
          position: absolute;
          top: 0px;
          height: 48px;
          width: 100%;
          backdrop-filter: blur(2px);
        `}>
          <div className={css`
            position: absolute;
            height: 100%;
            width: 100%;
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
              <Icon path={mdiFullscreenExit} size={1} color='rgba(255, 255, 255, 1)' />
            </div>
          </div>
        </div>
        <div className={css`
          position: absolute;
          top: 50px;
          height: calc(100% - 50px);
          width: 100%;
          backdrop-filter: blur(2px);
        `}>
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
                    border-left: 12px solid ${tasks[key].windowInfo.status === 'active' ?
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
                        if (tasks[key].windowInfo.status === 'active') {
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
        </div>
      </div>
    </Fade>

    <Fade on={launcherState}>
      <div className={css`
        position: absolute;
        top: 0px;
        height: 48px;
        width: 100%;
        background: rgba(0, 0, 0, 0.2);
      `}>
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
      </div>
      <div className={css`
        position: absolute;
        top: 50px;
        height: calc(100% - 50px);
        width: 100%;
        background: rgba(0, 0, 0, 0.2);
      `}>
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
      </div>
    </Fade>

    {Object.keys(tasks).map((key) => {
      const {
        pkg, page, state,
        windowInfo: {
          status, title
        }
      } = tasks[key];

      return <>
        <Fade on={!launcherState && status === 'active'}>
          <div className={css`
            position: absolute;
            top: 0px;
            height: 48px;
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
          `}>
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
              <Icon path={apps[pkg].icon} size={1} color='rgba(255, 255, 255, 1)' />
            </div>
            <div className={css`
              position: absolute;
              top: 0px;
              left: 52px;
              height: ${title !== '' ? 28 : 48}px;
              line-height: ${title !== '' ? 28 : 48}px;
              font-size: ${title !== '' ? 16 : 24}px;
              color: rgba(255, 255, 255, 1);
            `}>
              {apps[pkg].name}
            </div>
            {title && <div className={css`
              position: absolute;
              bottom: 4px;
              left: 52px;
              height: 16px;
              line-height: 16px;
              font-size: 12px;
              color: rgba(255, 255, 255, 1);
            `}>
              {title}
            </div>}
          </div>

          <div className={css`
            position: absolute;
            top: 50px;
            height: calc(100% - 50px);
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
          `}>
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
            `}>
              {apps[pkg].contentComponent[page] ?
                apps[pkg].contentComponent[page](propsGenerator(key, page, state)) :
                apps[pkg].contentComponent.default(propsGenerator(key, page, state))}
            </Scrollbars>
          </div>
        </Fade>

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
              {apps[pkg].drawerComponent[page] ?
                apps[pkg].drawerComponent[page](propsGenerator(key, page, state)) :
                apps[pkg].drawerComponent.default(propsGenerator(key, page, state))}
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
      </>;
    })}
  </div>;
}
