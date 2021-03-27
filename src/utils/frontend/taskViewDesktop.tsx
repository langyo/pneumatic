import React, { useState, useContext, useEffect } from 'react';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiMenu } from '@mdi/js';
import { CSSTransition } from 'react-transition-group';
import { Dialog } from './components/dialog';
import { Button, IconButton } from './components/button';
import { ToolTip } from './components/toolTip';

import {
  TaskManagerContext, ITaskManagerContext
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
    apps, appRegistryStatus, loadAppComponent: getAppComponent
  }: IAppProviderContext = useContext(AppProviderContext);
  const { palette } = useContext(ThemeProviderContext);
  const [draggingWindow, setDraggingWindow] = useState(
    { id: '', direction: 'leftBottom' } as {
      id: string,
      direction: 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom'
    }
  );

  useEffect(() => void 0, [appRegistryStatus]);

  return <div className={css`
    position: fixed;
    width: 100vw;
    height: 100vh;
  `}
    onMouseMove={e => {
      if (draggingWindow.id !== '') {
        const { left, top, width, height } = tasks[draggingWindow.id].windowInfo;
        switch (draggingWindow.direction) {
          case 'leftTop':
            setWindowInfo(draggingWindow.id, {
              left: left + e.movementX,
              width: width - e.movementX,
              top: top + e.movementY,
              height: height - e.movementY
            });
            break;
          case 'leftBottom':
            setWindowInfo(draggingWindow.id, {
              left: left + e.movementX,
              width: width - e.movementX,
              height: height + e.movementY
            });
            break;
          case 'rightTop':
            setWindowInfo(draggingWindow.id, {
              width: width + e.movementX,
              top: top + e.movementY,
              height: height - e.movementY
            });
            break;
          case 'rightBottom':
            setWindowInfo(draggingWindow.id, {
              width: width + e.movementX,
              height: height + e.movementY
            });
            break;
        }
      }
    }}
    onMouseUp={() => setDraggingWindow({ id: '', direction: 'leftBottom' })}
  >
    {Object.keys(tasks).map((key: string) => {
      const {
        pkg, page, sharedState,
        windowInfo: {
          left, top, width, height, title, priority
        }
      } = tasks[key];

      return <Dialog
        left={left} top={top} width={width} height={height}
        icon={apps[pkg].icon}
        title={apps[pkg].name} subTitle={title} priority={priority}
        bodyComponent={
          getAppComponent(pkg, page) &&
          getAppComponent(pkg, page)(propsGenerator(key, page, sharedState))
        }
        drawerComponent={
          getAppComponent(pkg, 'drawer') &&
          getAppComponent(pkg, 'drawer')(propsGenerator(key, page, sharedState))
        }
        setWindowInfo={obj => setWindowInfo(key, obj)}
        setActive={() => setActiveTask(key)}
        setDestory={() => destoryTask(key)}
      />;
    })}
    <div className={css`
      position: fixed;
      top: 10%;
      ${taskManagerPosition.direction === 'left' ? 'left: 4px;' : 'right: 4px;'}
      width: 40px;
      height: 80%;
      background: ${palette(0.6).primary};
      border-radius: 4px;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
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
              max-width: 192px;
              &::before {
                content: '';
                position: absolute;
                top: 0px;
                right: 0px;
                height: 100%;
                width: 32px;
                background: linear-gradient(to right, transparent, ${palette(0.6).primary});
              }
            `}>
              <IconButton
                className={css`
                  margin-right: 4px;
                `}
                path={mdiClose} color={palette.text} size={0.5}
                onClick={() => destoryTask(key)}
              />
              {`${name}${title !== '' ? ` - ${title}` : ''}`}
            </div>}
          >
            <IconButton
              path={icon}
              color={status === 'active' ? palette.text : palette(0.3).text}
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
              color={palette.text}
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
            background: rgba(0, 0, 0, 0.8);
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
            `}
              onClick={e => e.stopPropagation()}
            >
              <div className={css`
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
              `}>
                <div className={css`
                  display: grid;
                  grid-template-columns: repeat(6, 160px);
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
                      onClick={() => (generateTask(pkg), setGlobalState({ launcherState: false }))}
                    >
                      <Icon path={icon} size={2} color={palette.text} />
                      <div className={css`
                        height: 8px;
                      `} />
                      {name}
                    </Button>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
      </div>
    </div>
  </div >;
}
