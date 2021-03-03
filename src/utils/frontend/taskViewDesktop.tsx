import React, { useContext, useEffect } from 'react';
import {
  Paper, Typography, Tooltip, IconButton, Button, Grid,
  Dialog, DialogTitle, DialogContent, CircularProgress
} from '@material-ui/core';
import Draggable, { DraggableData } from 'react-draggable';
import { css, cx } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiMenu } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import {
  TaskManagerContext, ITaskManagerContext
} from './taskManagerContext';
import {
  ApplicationProviderContext, IApplicationProviderContext, IApps, IGetAppComponent
} from './appProviderContext';

export function TaskViewDesktop() {
  const {
    tasks, generateTask, destoryTask,
    propsGenerator, setWindowInfo, setActiveTask,
    globalState: { launcherState, taskManagerPosition }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const {
    apps, appRegistryStatus, getAppComponent
  }: IApplicationProviderContext = useContext(ApplicationProviderContext);

  useEffect(() => void 0, [appRegistryStatus]);

  return <div className={css`
    position: fixed;
    width: 100%;
    height: 100%;
  `}>
    {Object.keys(tasks).map((key: string) => {
      const {
        pkg, page, state,
        windowInfo: {
          left, top, width, height, title, priority
        }
      } = tasks[key];

      return <Draggable
        position={{ x: left, y: top }}
        handle='.drag-handle-tag'
        onStop={(_e, state: DraggableData) => setWindowInfo(key, {
          left: state.x,
          top: state.y
        })}
      >
        <div className={css`
          position: fixed;
          z-index: ${5000 + priority};
        `}>
          <Paper
            className={css`
              width: ${width}px;
              height: ${height}px;
            `}
            elevation={3}
          >
            <div className={css`
              width: 100%;
              height: 100%;
            `}
              onMouseDown={() => setActiveTask(key)}
            >
              <div className={cx(css`
                position: absolute;
                width: calc(100% - 4px);
                left: 4px;
                height: 32px;
                display: flex;
                flex-direction: row;
                align-items: center;
                user-select: none;
              `, 'drag-handle-tag')}>
                <Icon className={css`
                  margin: 4px;
                `}
                  path={apps[pkg].icon} size={1} color='rgba(0, 0, 0, 1)'
                />
                <div className={css`
                  margin: 4px;
                `}>
                  <Typography variant='subtitle1'>
                    {apps[pkg].name}
                  </Typography>
                </div>
                <div className={css`
                  margin: 4px;
                `}>
                  <Typography variant='subtitle2'>
                    {title || ''}
                  </Typography>
                </div>
                <div className={css`
                  position: absolute;
                  top: 0px;
                  right: 0px;
                `}>
                  <div className={css`
                    margin: 4px;
                  `}>
                    <IconButton size='small' onClick={() => destoryTask(key)}>
                      <Icon path={mdiClose} size={1} color='rgba(0, 0, 0, 1)' />
                    </IconButton>
                  </div>
                </div>
              </div>
              <div className={css`
                position: absolute;
                bottom: 4px;
                left: 4px;
                width: calc(40% - 4px);
                height: calc(100% - 32px - 4px - 4px);
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
                position: absolute;
                bottom: 4px;
                right: 4px;
                width: calc(60% - 4px);
                height: calc(100% - 32px - 4px - 4px);
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
      box-shadow: ${taskManagerPosition.direction === 'left' ?
        '1px 1px' : '-1px 1px'} 2px rgba(0, 0, 0, 0.5);
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
        const { status, title } = tasks[key].windowInfo;

        return <Tooltip
          placement='right'
          title={`${name}${title !== '' ? ` - ${title}` : ''}`}
        >
          <IconButton
            onClick={() => setActiveTask(key)}
          >
            <Icon
              path={icon} size={1}
              color={status === 'active' ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)'}
            />
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
        <Dialog
          open={launcherState}
          onClose={() => setGlobalState({ launcherState: false })}
        >
          <DialogTitle>{'Launcher'}</DialogTitle>
          <DialogContent>
            <Grid container>
              {Object.keys(apps).map(pkg => {
                const { icon, name } = apps[pkg];
                return <Grid item xs={6} xl={4}>
                  <Button
                    size='large'
                    onClick={() => (generateTask(pkg), setGlobalState({ launcherState: false }))}
                    startIcon={<Icon path={icon} size={1} color='rgba(0, 0, 0, 1)' />}
                  >
                    {name}
                  </Button>
                </Grid>;
              })}
            </Grid>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div >;
}
