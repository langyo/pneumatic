import React, { useState, useContext } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import { useTranslationState, Fade } from './components/fadeTranslation';
import {
  TaskManagerContext, IWindowInfo, IState,
  ITaskInfo, IGenerateTask, IDestoryTask,
  ISetPage, ISetState, ISetWindowInfo, ISetActiveTask
} from './taskManagerContext';
import { ApplicationProviderContext, IApp } from './appProviderContext';


export function TaskViewMobile() {
  const {
    tasks, generateTask, destoryTask,
    setPage, setState, setWindowInfo, setActiveTask
  }: {
    tasks: ITaskInfo, generateTask: IGenerateTask, destoryTask: IDestoryTask,
    setPage: ISetPage, setState: ISetState,
    setWindowInfo: ISetWindowInfo, setActiveTask: ISetActiveTask
  } = useContext(TaskManagerContext);
  const { apps }: { apps: { [pkg: string]: IApp } } = useContext(ApplicationProviderContext);
  const [drawerState, setDrawerState] = useTranslationState(false);
  const [taskManagerState, setTaskManagerState] = useTranslationState(false);
  const [launcherState, setLauncherState] = useTranslationState(Object.keys(tasks).filter(
    (key: string) => tasks[key].windowInfo.status !== 'active'
  ).length === 0);

  const activeTaskId = Object.keys(tasks).find(
    (id: string) => tasks[id].windowInfo.status === 'active' ? id : undefined
  );

  function propsGenerator(key: string, page: string, state: IState) {
    return {
      mediaMode: 'mobile',
      windowInfo: tasks[key].windowInfo,
      setWindowInfo(info: IWindowInfo) { setWindowInfo(key, info); },
      page,
      setPage(page: string) { setPage(key, page); },
      state,
      setState(state: IState) { setState(key, state); },
      isDrawerShow: drawerState,
      setDrawerShow(status: boolean) { setDrawerState(status); },
      generateTask,
      destoryTask
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
      <Fade translationState={{
        exist: !launcherState.exist && !!activeTaskId,
        show: !launcherState.show
      }}>
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
            onClick={() => setDrawerState(!drawerState.exist)}>
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
      <Fade translationState={launcherState}>
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
      <Fade translationState={{
        exist: !taskManagerState.exist && Object.keys(tasks).length > 0,
        show: !taskManagerState.show
      }}>
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
          onClick={() => (setTaskManagerState(true), setDrawerState(false))}
        >
          <Icon path={mdiFullscreenExit} size={1} color='rgba(255, 255, 255, 1)' />
        </div>}
      </Fade>
      <Fade translationState={taskManagerState}>
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
            onClick={() => setTaskManagerState(false)}>
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
      <Scrollbars className={css`
        width: 100%;
        height: 100%;
      `}>
        <Fade translationState={taskManagerState}>
          <div className={css`
            position: absolute;
            height: 100%;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-context: flex-start;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(2px);
          `}>
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
                  setDrawerState(false),
                  setTaskManagerState(false),
                  setLauncherState(false)
                )}
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
                      setLauncherState(true);
                    }
                    destoryTask(key);
                  }}
                >
                  <Icon path={mdiClose} size={1} color='rgba(255, 255, 255, 1)' />
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
              color: rgba(255, 255, 255, 1);
              line-height: 48px;
              &:hover {
                background: rgba(0, 0, 0, 0.2);
              }
              &:active {
                background: rgba(0, 0, 0, 0.4);
              }
            `}
              onClick={() => (
                setLauncherState(true),
                setDrawerState(false),
                setTaskManagerState(false)
              )}
            >
              {'Back to the launcher'}
            </div>
          </div>
        </Fade>
        <Fade translationState={{
          exist: !launcherState.exist,
          show: !launcherState.show
        }}>
          {/* TODO - Abandon 'activeTaskId', generate fade state to every tasks. */}
          {activeTaskId && (
            apps[tasks[activeTaskId].pkg]
              .contentComponent[tasks[activeTaskId].page] ?
              apps[tasks[activeTaskId].pkg]
                .contentComponent[tasks[activeTaskId].page](
                  propsGenerator(
                    activeTaskId,
                    tasks[activeTaskId].page,
                    tasks[activeTaskId].state
                  )) :
              apps[tasks[activeTaskId].pkg]
                .contentComponent.default(propsGenerator(
                  activeTaskId,
                  tasks[activeTaskId].page,
                  tasks[activeTaskId].state
                )))}
        </Fade>
        <Fade translationState={launcherState}>
          <div className={css`
            margin: 8px;
            display: grid;
            grid-template-rows: repeat(auto-fill, 80px);
            grid-template-columns: repeat(4, 25%);
            gap: 8px;
            justify-items: center;
            justify-content: center;
          `}>
            {Object.keys(apps).concat((new Array(99).fill('pneumatic.explorer'))).map(pkg => {
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
                  setLauncherState(false),
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
        </Fade>
      </Scrollbars>
    </div>

    <Fade translationState={drawerState}>
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
          onClick={() => setDrawerState(false)}
        />
      </div>
    </Fade>
  </div >;
}
