import React, { useContext } from 'react';
import {
  Button, IconButton, Drawer, Grid, AppBar, Toolbar, Typography, Paper,
  List, ListItem, ListItemText, ListItemSecondaryAction, ListSubheader
} from '@material-ui/core';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiArrowRight, mdiClose, mdiFullscreen } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import {
  TaskManagerContext, IWindowInfo, ITaskManagerContext
} from './taskManagerContext';
import {
  ApplicationProviderContext, IApplicationProviderContext
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
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    user-select: none;
  `}>
    <Drawer
      anchor='top'
      open={taskManagerState}
      onClose={() => setGlobalState({ taskManagerState: false })}
    >
      <List subheader={
        <ListSubheader>
          {'Tasks'}
        </ListSubheader>
      }>
        {Object.keys(tasks).sort(
          (left, right) =>
            tasks[left].windowInfo.taskManagerOrder -
            tasks[right].windowInfo.taskManagerOrder
        ).map((key: string) => {
          const pkg = tasks[key].pkg;
          const { title }: IWindowInfo = tasks[key].windowInfo;

          return <ListItem>
            <ListItemText
              primary={apps[pkg].name}
              secondary={title}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => (
                setActiveTask(key),
                setGlobalState({
                  launcherState: false,
                  taskManagerState: false
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
        <ListItem button onClick={() => setGlobalState({
          launcherState: true,
          taskManagerState: false
        })}>
          <ListItemText
            primary={'Back to the launcher'}
          />
        </ListItem>
      </List>
    </Drawer>

    <AppBar position='sticky'>
      <Toolbar className={css`
        display: flex;
        flex-direction: row;
      `}>
        {Object.keys(tasks).map((key) => {
          const { pkg, windowInfo: { status, title } } = tasks[key];
          return <>
            {status === 'active' && !launcherState && <>
              <div className={css`
                margin-right: 8px;
              `}>
                <IconButton onClick={() => setGlobalState({
                  drawerState: true
                })}>
                  <Icon path={apps[pkg].icon} size={1} color='rgba(255, 255, 255, 1)' />
                </IconButton>
              </div>
              {title !== '' && <div className={css`
                display: flex;
                flex-direction: column;
              `}>
                <Typography variant='subtitle1'>
                  {apps[pkg].name}
                </Typography>
                <Typography variant='subtitle2'>
                  {title}
                </Typography>
              </div>}
              {title === '' && <Typography variant='h6'>
                {apps[pkg].name}
              </Typography>}
            </>}
          </>;
        })}
        {launcherState && <Typography variant='h6'>
          {'Launcher'}
        </Typography>}
        {Object.keys(tasks).length > 0 && <div className={css`
          margin-left: auto;
        `}>
          <IconButton onClick={() => setGlobalState({
            taskManagerState: true
          })} >
            <Icon path={mdiFullscreen} size={1} color='rgba(255, 255, 255, 1)' />
          </IconButton>
        </div>}
      </Toolbar>
    </AppBar>

    {launcherState && <div className={css`
      width: 100%;
      padding: 8px;
    `}>
      <Grid container>
        {Object.keys(apps).map(pkg => {
          const { icon, name } = apps[pkg];
          return <Grid item xs={6}>
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
    </div>}

    {Object.keys(tasks).map((key) => {
      const {
        pkg, page, state, windowInfo: { status }
      } = tasks[key];
      return <>
        {status === 'active' && !launcherState && <Scrollbars className={css`
          width: 100%;
          height: 100%;
        `}>
          {getAppComponent(pkg, page)(propsGenerator(key, page, state))}
        </Scrollbars>}
        {status === 'active' && !launcherState && <Drawer
          anchor='left'
          open={drawerState}
          onClose={() => setGlobalState({ drawerState: false })}
        >
          <div className={css`
            width: ${window.innerHeight * 0.4};
            height: 100%;
          `}>
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
            `}>
              {getAppComponent(pkg, 'drawer')(propsGenerator(key, page, state))}
            </Scrollbars>
          </div>
        </Drawer>}
      </>;
    })}
  </div >;
}
