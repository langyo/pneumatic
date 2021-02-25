import React, { useContext } from 'react';
import {
  Button, IconButton, Drawer, Tooltip, AppBar, Toolbar,
  List, ListItem, ListItemText, ListItemSecondaryAction
} from '@material-ui/core';
import Draggable, { DraggableData } from 'react-draggable';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiArrowRight, mdiClose, mdiFullscreen } from '@mdi/js';

import {
  TaskManagerContext, IWindowInfo, IState, ITaskManagerContext
} from './taskManagerContext';
import {
  ApplicationProviderContext, IApplicationProviderContext, IApps, IGetAppComponent
} from './appProviderContext';


export function TaskViewMobile() {
  const {
    tasks, generateTask, destoryTask,
    propsGenerator, setActiveTask,
    globalState: {
      drawerState, launcherState, taskManagerState, taskManagerPosition
    }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const {
    apps, getAppComponent
  }: IApplicationProviderContext = useContext(ApplicationProviderContext);

  return <div className={css`
    position: fixed;
    height: 100%;
    width: 100%;
    user-select: none;
  `}>
    {!taskManagerState && Object.keys(tasks).length > 0 && <div className={css`
      position: absolute;
      z-index: 10000;
    `}>
      <Draggable
        position={{
          x: taskManagerPosition.direction === 'left' ? 4 : window.innerWidth - 40,
          y: taskManagerPosition.top
        }}
        onStop={(_e, state: DraggableData) => {
          if (
            Math.abs(state.y - taskManagerPosition.top) > 10 ||
            state.x < window.innerWidth / 2 && state.x > 4 + 10 ||
            state.x >= window.innerWidth / 2 && state.x < window.innerWidth - 40 - 10
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
        <Button
          variant='outlined'
          startIcon={<Icon path={mdiFullscreen} size={1} color='rgba(0, 0, 0, 1)' />}
        />
      </Draggable>
    </div>}

    <Drawer
      anchor='top'
      open={taskManagerState}
      onClose={() => setGlobalState({ taskManagerState: false })}
    >
      <List>
        {Object.keys(tasks).sort(
          (left, right) =>
            tasks[left].windowInfo.taskManagerOrder -
            tasks[right].windowInfo.taskManagerOrder
        ).map((key: string) => {
          const pkg = tasks[key].pkg;
          const { title }: IWindowInfo = tasks[key].windowInfo;

          return <ListItem >
            <ListItemText
              primary={apps[pkg].name}
              secondary={title}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => (
                setActiveTask(key),
                setGlobalState({
                  drawerState: false,
                  launcherState: false
                })
              )}>
                <Icon path={mdiArrowRight} size={1} color='rgba(0, 0, 0, 1)' />
              </IconButton>
              <IconButton onClick={() => {
                if (tasks[key].windowInfo.status === 'active') {
                  setGlobalState({
                    launcherState: true
                  });
                }
                destoryTask(key);
                setGlobalState({ taskManagerState: false });
              }}>
                <Icon path={mdiClose} size={1} color='rgba(0, 0, 0, 1)' />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>;
        })}
      </List>
    </Drawer>

    {launcherState && <AppBar title='Launcher'>
      <Toolbar>
        <Button
          onClick={() => setGlobalState({
            launcherState: true,
            drawerState: false,
            taskManagerState: false
          })}
        />
        {Object.keys(apps).map(pkg => {
          const { icon, name } = apps[pkg];
          <Tooltip title={name} placement='top'>
            <Button
              startIcon={<Icon path={icon} size={1} color='rgba(0, 0, 0, 1)' />}
              onClick={() => (generateTask(pkg), setGlobalState({ launcherState: false }))}
            />
          </Tooltip>
        })}
      </Toolbar>
    </AppBar>}

    {Object.keys(tasks).map((key) => {
      const {
        pkg, page, state, windowInfo: { title }
      } = tasks[key];

      return <>
        <AppBar>
          <IconButton onClick={() => setGlobalState({ drawerState: !drawerState })}>
            <Icon path={apps[pkg].icon} size={1} color='rgba(0, 0, 0, 1)' />
          </IconButton>
          <Toolbar>
            {`${apps[pkg].name} ${title}`}
          </Toolbar>
        </AppBar>
        {getAppComponent(pkg, page)(propsGenerator(key, page, state))}

        <Drawer
          anchor='left'
          open={drawerState}
          onClose={() => setGlobalState({ drawerState: false })}
        >
          {getAppComponent(pkg, 'drawer')(propsGenerator(key, page, state))}
        </Drawer>
      </>;
    })}
  </div>;
}
