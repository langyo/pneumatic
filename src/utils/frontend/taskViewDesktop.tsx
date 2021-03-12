import React, { useState, useContext, useEffect } from 'react';
import {
  Box, Typography, Tooltip, IconButton, Button, Grid,
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
  AppProviderContext, IAppProviderContext, IApps, IGetAppComponent
} from './appProviderContext';

const loadingComponent = <div className={css`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`}>
  <CircularProgress />
</div>;

export function TaskViewDesktop() {
  const {
    tasks, generateTask, destoryTask,
    propsGenerator, setWindowInfo, setActiveTask,
    globalState: { launcherState, taskManagerPosition }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const {
    apps, appRegistryStatus, loadAppComponent: getAppComponent
  }: IAppProviderContext = useContext(AppProviderContext);
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

      return <Draggable
        position={{ x: left, y: top }}
        handle='.drag-handle-tag'
        onStop={(_e, state: DraggableData) => setWindowInfo(key, {
          left: state.x,
          top: state.y
        })}
      >
        <Box
          position='fixed'
          width={width}
          height={height}
          boxShadow={3}
          borderRadius={4}
          bgcolor='rgba(255, 255, 255, 0.8)'
          zIndex={5000 + priority * 2}
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
                {getAppComponent(pkg, 'drawer') ?
                  getAppComponent(pkg, 'drawer')(propsGenerator(key, page, sharedState)) :
                  loadingComponent}
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
                {getAppComponent(pkg, page) ?
                  getAppComponent(pkg, page)(propsGenerator(key, page, sharedState)) :
                  loadingComponent}
              </Scrollbars>
            </div>
          </div>
          <div className={cx(css`
            position: absolute;
            top: -4px;
            left: -4px;
            height: 8px;
            width: 8px;
            cursor: se-resize;
          `)}
            onMouseDown={() => setDraggingWindow({
              id: key, direction: 'leftTop'
            })}
          />
          <div className={cx(css`
            position: absolute;
            bottom: -4px;
            left: -4px;
            height: 8px;
            width: 8px;
            cursor: ne-resize;
          `)}
            onMouseDown={() => setDraggingWindow({
              id: key, direction: 'leftBottom'
            })}
          />
          <div className={cx(css`
            position: absolute;
            top: -4px;
            right: -4px;
            height: 8px;
            width: 8px;
            cursor: ne-resize;
          `)}
            onMouseDown={() => setDraggingWindow({
              id: key, direction: 'rightTop'
            })}
          />
          <div className={cx(css`
            position: absolute;
            bottom: -4px;
            right: -4px;
            height: 8px;
            width: 8px;
            cursor: se-resize;
          `)}
            onMouseDown={() => setDraggingWindow({
              id: key, direction: 'rightBottom'
            })}
          />
        </Box>
      </Draggable>;
    })}
    <Box
      position='fixed'
      top='10%'
      {...(taskManagerPosition.direction === 'left' ? { left: 4 } : { right: 4 })}
      width={48}
      height='80%'
      bgcolor='rgba(255, 255, 255, 0.8)'
      borderRadius={4}
      boxShadow={3}
      zIndex={9000}
      className={css`
        padding: 4px;
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
    </Box>
  </div >;
}
