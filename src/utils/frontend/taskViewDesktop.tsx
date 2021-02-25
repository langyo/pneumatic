import React, { useContext } from 'react';
import { Paper, Button, Tooltip, Popover, IconButton } from '@material-ui/core';
import Draggable, { DraggableData } from 'react-draggable';
import { css, cx } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiMenu } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import {
  TaskManagerContext, ITaskManagerContext
} from './taskManagerContext';
import {
  ApplicationProviderContext, IApps, IGetAppComponent
} from './appProviderContext';

export function TaskViewDesktop() {
  const {
    tasks, generateTask, destoryTask,
    propsGenerator, setWindowInfo, setActiveTask,
    globalState: { launcherState, taskManagerPosition }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const { apps, getAppComponent }: {
    apps: IApps, getAppComponent: IGetAppComponent
  } = useContext(ApplicationProviderContext);

  const activeTaskId = Object.keys(tasks).find(
    (id: string) => tasks[id].windowInfo.status === 'active' ? id : undefined
  );

  return <div className={css`
    position: fixed;
    width: 100%;
    height: 100%;
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
          position: fixed;
          z-index: ${5000 + priority};
        `}>
          <Paper className={css`
            width: ${width}px;
            height: ${height}px;
          `}
          >
            <div className={cx(css`
              width: 100%;
              height: 100%;
            `, 'drag-handle-tag')}
              onMouseDown={() => setActiveTask(key)}
            >
              <Icon path={apps[pkg].icon} size={1} color='rgba(0, 0, 0, 1)' />
              {apps[pkg].name}
              {title || ''}
              <IconButton onClick={() => destoryTask(key)}>
                <Icon path={mdiClose} size={1} color='rgba(0, 0, 0, 1)' />
              </IconButton>
              <div className={css`
                width: 40%;
                height: 100%;
              `}
                onMouseDown={() => setActiveTask(key)}
              >
                <Scrollbars className={css`
                  width: 100%;
                  height: 100%;
                `}>
                  {getAppComponent(pkg, 'drawer')(propsGenerator(key, page, state))}
                </Scrollbars>
              </div>
              <div className={css`
                width: 60%;
                height: 100%;
              `}
                onMouseDown={() => setActiveTask(key)}
              >
                <Scrollbars className={css`
                  width: 100%;
                  height: 100%;
                `}>
                  {getAppComponent(pkg, page)(propsGenerator(key, page, state))}
                </Scrollbars>
              </div>
            </div>
          </Paper>
        </div>
      </Draggable>;
    })}
    <div className={css`
      position: fixed;
      top: 10%;
      ${taskManagerPosition.direction === 'left' ?
        'left: 0px;' : 'right: 0px;'}
      width: 48px;
      height: calc(80% - 8px);
      padding: 4px;
      z-index: 9000;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(240, 240, 240, 1);
      ${taskManagerPosition.direction === 'left' ?
        'border-left: none;' : 'border-right: none;'}
      border-radius: ${taskManagerPosition.direction === 'left' ?
        '0px 2px 2px 0px' : '2px 0px 0px 2px'};
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    `}>
      {Object.keys(tasks).sort(
        (left, right) =>
          tasks[left].windowInfo.taskManagerOrder - tasks[right].windowInfo.taskManagerOrder
      ).map(key => {
        const { icon, name } = apps[tasks[key].pkg];
        const { title } = tasks[key].windowInfo;

        return <Tooltip
          placement='right'
          title={`${name}${title !== '' ? ` - ${title}` : ''}`}
        >
          <IconButton
            onClick={() => setActiveTask(key)}
          >
            <Icon path={icon} size={1} color='rgba(0, 0, 0, 1)' />
          </IconButton>
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
            onClick={() => setGlobalState({ launcherState: !launcherState })}
          >
            <Icon path={mdiMenu} size={1} color='rgba(0, 0, 0, 1)' />
          </IconButton>
        </Tooltip>
        <Popover
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          open={launcherState}
        >
          {Object.keys(apps).map(pkg => {
            const { icon, name } = apps[pkg];
            return <Tooltip title={name} placement='top'>
              <IconButton
                onClick={() => (generateTask(pkg), setGlobalState({ launcherState: false }))}
              >
                <Icon path={icon} size={1} color='rgba(0, 0, 0, 1)' />
              </IconButton>
            </Tooltip>;
          })}
        </Popover>
      </div>
    </div>
  </div >;
}
