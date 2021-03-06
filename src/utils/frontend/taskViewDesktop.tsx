import React, { useState, useContext } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiMenu } from '@mdi/js';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Dialog } from './components/dialog';
import { Button, IconButton } from './components/button';
import { ToolTip } from './components/toolTip';

import {
  TaskManagerContext, ITaskManagerContext, ITask
} from './taskManagerContext';
import {
  AppProviderContext, IAppProviderContext
} from './appProviderContext';
import { ThemeProviderContext } from './themeProviderContext';

export function TaskViewDesktop() {
  const {
    tasks, generateTask, destoryTask,
    propsGenerator, setWindowInfo, setActiveTask,
    globalState: { launcherState, taskManagerPosition }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const {
    apps, loadAppComponent: getAppComponent
  }: IAppProviderContext = useContext(AppProviderContext);
  const { palette } = useContext(ThemeProviderContext);
  const [draggingWindow, setDraggingWindow] = useState(
    { id: '', direction: 'leftBottom' } as {
      id: string,
      direction: 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'
    }
  );
  const [taskOnExit, setTaskOnExit] = useState({} as {
    [key: string]: ITask
  });

  return <div className={css`
    position: fixed;
    width: 100vw;
    height: 100vh;
  `}
    onMouseMove={(event: MouseEvent) => {
      if (draggingWindow.id !== '') {
        const { left, top, width, height } = tasks[draggingWindow.id].windowInfo;
        switch (draggingWindow.direction) {
          case 'leftTop':
            setWindowInfo(draggingWindow.id, {
              left: left + event.movementX,
              width: width - event.movementX,
              top: top + event.movementY,
              height: height - event.movementY
            });
            break;
          case 'leftBottom':
            setWindowInfo(draggingWindow.id, {
              left: left + event.movementX,
              width: width - event.movementX,
              height: height + event.movementY
            });
            break;
          case 'rightTop':
            setWindowInfo(draggingWindow.id, {
              width: width + event.movementX,
              top: top + event.movementY,
              height: height - event.movementY
            });
            break;
          case 'rightBottom':
            setWindowInfo(draggingWindow.id, {
              width: width + event.movementX,
              height: height + event.movementY
            });
            break;
        }
      }
    }}
    onMouseUp={() => setDraggingWindow({ id: '', direction: 'leftBottom' })}
  >
    <TransitionGroup>
      {Object.keys(tasks).map((key: string) => {
        const {
          pkg, page, sharedState,
          windowInfo: {
            left, top, width, height, title, priority
          }
        } = Object.keys(taskOnExit).indexOf(key) >= 0 ? taskOnExit[key] : tasks[key];

        return <CSSTransition key={key} timeout={200} classNames={{
          enter: css`
            opacity: 0;
            transform: translateY(5%) scale(.9);
          `,
          enterActive: css`
            opacity: 1;
            transform: translateY(0) scale(1);
            transition: .2s;
          `,
          exit: css`
            opacity: 1;
            transform: translateY(0) scale(1);
          `,
          exitActive: css`
            opacity: 0;
            transform: translateY(5%) scale(.9);
            transition: .2s;
          `
        }}>
          <div>
            <Dialog
              left={left} top={top} width={width} height={height}
              icon={apps[pkg].icon}
              title={apps[pkg].name} subTitle={title} priority={priority}
              component={getAppComponent(pkg, page)}
              setWindowInfo={obj => setWindowInfo(key, obj)}
              setActive={() => setActiveTask(key)}
              setDestory={() => (
                setTaskOnExit(taskOnExit => ({
                  ...taskOnExit,
                  [key]: tasks[key]
                })),
                setTimeout(() => (
                  destoryTask(key),
                  setTaskOnExit(taskOnExit => Object.keys(taskOnExit).filter(n => n !== key).reduce(
                    (obj, key) => ({ ...obj, [key]: taskOnExit[key] }), {}
                  ))
                ), 200)
              )}
            />
          </div>
        </CSSTransition>
      })}
    </TransitionGroup>
    <div className={css`
      position: fixed;
      top: 10%;
      ${taskManagerPosition.direction === 'left' ? 'left: 4px;' : 'right: 4px;'}
      width: 40px;
      height: 80%;
      background: ${palette(.6).primary};
      border-radius: 4px;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, .6);
      z-index: 9000;
      padding: 4px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    `}>
      {Object.keys(tasks).sort(
        (left, right) =>
          tasks[left].windowInfo.taskManagerOrder - tasks[right].windowInfo.taskManagerOrder
      ).map(key => {

        const { icon, name } = apps[tasks[key].pkg];
        const { status, title } = tasks[key].windowInfo;

        return <div className={css`
          margin: 4px;
        `}>
          <ToolTip
            position='right'
            content={<div className={css`
              display: flex;
              align-items: center;
              width: 200px;
              &::before {
                content: '';
                position: absolute;
                top: 0px;
                right: 0px;
                height: 100%;
                width: 16px;
                background: linear-gradient(to right, transparent, ${palette(.8).primary});
              }
            `}>
              <IconButton
                className={css`
                  margin-right: 4px;
                `}
                path={mdiClose} size={.5}
                onClick={() => destoryTask(key)}
              />
              {`${name}${title !== '' ? ` - ${title}` : ''}`}
            </div>}
          >
            <IconButton
              path={icon}
              color={status === 'active' ? palette.text : palette(.3).text}
              onClick={() => setActiveTask(key)}
            />
          </ToolTip>
        </div>
      })}
      <div className={css`
        position: absolute;
        bottom: 4px;
      `}>
        <div className={css`
          margin: 4px;
        `}>
          <ToolTip content='Launcher' position='right'>
            <IconButton
              path={mdiMenu}
              onClick={() => setGlobalState({ launcherState: !launcherState })}
            />
          </ToolTip>
        </div>
        <CSSTransition in={launcherState} timeout={200} unmountOnExit classNames={{
          enter: css`
            opacity: 0;
          `,
          enterActive: css`
            opacity: 1;
            transition: .2s;
          `,
          exit: css`
            opacity: 1;
          `,
          exitActive: css`
            opacity: 0;
            transition: .2s;
          `,
          exitDone: css`
            display: none;
          `
        }}>
          <div className={css`
            position: fixed;
            left: 0px;
            top: 0px;
            right: 0px;
            bottom: 0px;
            background: rgba(0, 0, 0, .8);
            z-index: 9001;
          `}
            onClick={() => setGlobalState({ launcherState: false })}
          >
            <div className={css`
              position: absolute;
              left: 10%;
              top: 10%;
              width: 80%;
              height: 80%;
            `}>
              <div className={css`
                width: 100%;
                height: 100%;
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                grid-template-rows: repeat(auto-fill, 120px);
                grid-gap: 4px;
              `}>
                {Object.keys(apps).map(pkg => {
                  const { icon, name } = apps[pkg];
                  return <Button
                    className={css`
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      height: 120px;
                      font-size: 16px;
                      color: ${palette.text}
                    `}
                    onClick={(event: MouseEvent) => (
                      generateTask(pkg),
                      setGlobalState({ launcherState: false }),
                      event.stopPropagation()
                    )}
                  >
                    <Icon path={icon} size={2} />
                    <div className={css`
                      height: 8px;
                    `} />
                    {name}
                  </Button>;
                })}
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  </div >;
}
