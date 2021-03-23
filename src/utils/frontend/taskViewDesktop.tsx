import React, { useState, useContext, useEffect } from 'react';
import { Tooltip } from '@material-ui/core';
import { css, cx } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';
import { Dialog } from './components/dialog';
import { Button, IconButton } from './components/button';

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

        return <Tooltip
          placement='right'
          title={`${name}${title !== '' ? ` - ${title}` : ''}`}
        >
          <IconButton
            className={css`
              margin: 4px;
            `}
            path={icon}
            color={status === 'active' ? palette.text : palette(0.3).text}
            onClick={() => setActiveTask(key)}
          />
        </Tooltip>
      })}
      <div className={css`
        position: absolute;
        bottom: 4px;
      `}>
        <Tooltip
          placement='right'
          title={`Launcher`}
        >
          <IconButton
            className={css`
              margin: 4px;
            `}
            path={mdiMenu}
            color={palette.text}
            onClick={() => setGlobalState({ launcherState: !launcherState })}
          />
        </Tooltip>
        <div className={css`
          position: fixed;
          left: 0px;
          top: 0px;
          right: 0px;
          bottom: 0px;
          background: rgba(0, 0, 0, 0.8);
          display: ${launcherState ? '' : 'none'};
          z-index: 9001;
        `}
          onClick={() => setGlobalState({ launcherState: false })}
        >
          <div className={css`
            position: absolute;
            left: 20%;
            top: 30%;
            width: 60%;
            height: 40%;
            display: grid;
            grid-template-columns: repeat(3, 33.3%);
            grid-template-rows: repeat(auto-fill, 40px);
            grid-gap: 4px;
          `}>
            {Object.keys(apps).map(pkg => {
              const { icon, name } = apps[pkg];
              return <Button
                className={css`
                  display: flex;
                  align-items: center;
                  height: 32px;
                  line-height: 32px;
                  font-size: 16px;
                  color: ${palette.text}
                `}
                onClick={() => (generateTask(pkg), setGlobalState({ launcherState: false }))}
              >
                <Icon path={icon} size={1} color={palette.text} />
                {name}
              </Button>;
            })}
          </div>
        </div>
      </div>
    </div>
  </div >;
}
