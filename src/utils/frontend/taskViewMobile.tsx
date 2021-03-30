import React, { useContext, useEffect } from 'react';
import { Button, IconButton } from './components/button';
import { Drawer } from './components/drawer';
import { List } from './components/list';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiArrowRight, mdiClose, mdiFullscreen } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import {
  TaskManagerContext, IWindowInfo, ITaskManagerContext
} from './taskManagerContext';
import {
  AppProviderContext, IAppProviderContext
} from './appProviderContext';
import { ThemeProviderContext } from './themeProviderContext';

export function TaskViewMobile() {
  const {
    tasks, generateTask, destoryTask,
    propsGenerator, setActiveTask,
    globalState: {
      drawerState, launcherState, taskManagerState, taskManagerPosition
    }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const {
    apps, appRegistryStatus, loadAppComponent: getAppComponent
  }: IAppProviderContext = useContext(AppProviderContext);
  const { palette } = useContext(ThemeProviderContext);

  useEffect(() => void 0, [appRegistryStatus]);

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
      on={taskManagerState}
      onClose={() => setGlobalState({ taskManagerState: false })}
    >
      <List items={[
        ...Object.keys(tasks).sort(
          (left, right) =>
            tasks[left].windowInfo.taskManagerOrder -
            tasks[right].windowInfo.taskManagerOrder
        ).map((key: string) => {
          const pkg = tasks[key].pkg;
          const { title }: IWindowInfo = tasks[key].windowInfo;

          return <div className={css`
            width: 100%;
            height: 36px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}>
            <div className={css`
              margin: 0px 4px;
              display: flex;
              flex-direction: column;
              justify-content: center;
            `}>
              <div className={css`
                height: 20px;
                line-height: 20px;
                font-size: 16px;
              `}>
                {apps[pkg].name}
              </div>
              {title && <div className={css`
                height: 12px;
                line-height: 12px;
                font-size: 10px;
              `}>
                {title}
              </div>}
            </div>
            <div className={css`
              margin: 4px;
              display: flex;
              align-items: center;
            `}>
              <IconButton
                path={mdiArrowRight}
                onClick={() => (
                  setActiveTask(key),
                  setGlobalState({
                    launcherState: false,
                    taskManagerState: false
                  })
                )} />
              <IconButton
                path={mdiClose}
                onClick={() => {
                  if (tasks[key].windowInfo.status === 'active') {
                    setGlobalState({
                      launcherState: true
                    });
                  }
                  destoryTask(key);
                  setGlobalState({ taskManagerState: false });
                }} />
            </div>
          </div>;
        }),
        <Button className={css`
          margin: 8px;
          height: 32px;
          line-height: 32px;
          font-size: 24px;
          color: ${palette.text};
        `}
          onClick={() => setGlobalState({
            launcherState: true,
            taskManagerState: false
          })}>
          {'Back to the launcher'}
        </Button>
      ]} />
    </Drawer>

    <div className={css`
      position: sticky;
      height: 48px;
      padding: 0px 8px;
      background: rgba(0, 0, 0, .2);
      color: white;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    `}>
      {Object.keys(tasks).map(key => {
        const { pkg, windowInfo: { status, title } } = tasks[key];
        return <>
          {status === 'active' && !launcherState && <>
            <div className={css`
              margin-right: 8px;
            `}>
              <IconButton
                path={apps[pkg].icon}
                onClick={() => setGlobalState({
                  drawerState: true
                })}
              />
            </div>
            {title !== '' && <div className={css`
              height: 36px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            `}>
              <div className={css`
                height: 20px;
                line-height: 20px;
                font-size: 16px;
              `}>
                {apps[pkg].name}
              </div>
              <div className={css`
                height: 12px;
                line-height: 12px;
                font-size: 10px;
              `}>
                {title}
              </div>
            </div>}
            {title === '' && <div className={css`
              height: 32px;
              line-height: 32px;
              font-size: 16px;
            `}>
              {apps[pkg].name}
            </div>}
          </>}
        </>;
      })}
      {launcherState && <div className={css`
        font-size: 24px;
      `}>
        {'Launcher'}
      </div>}
      {Object.keys(tasks).length > 0 && <div className={css`
          margin-left: auto;
        `}>
        <IconButton
          path={mdiFullscreen}
          onClick={() => setGlobalState({
            taskManagerState: true
          })}
        />
      </div>}
    </div>

    {launcherState && <div className={css`
      width: 100%;
    `}>
      <div className={css`
        margin: 4px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
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
            height: 80px;
            font-size: 16px;
            color: ${palette.text}
          `}
            onClick={event => (
              generateTask(pkg),
              setGlobalState({ launcherState: false }),
              event.stopPropagation()
            )}
          >
            <Icon path={icon} size={1.5} />
            <div className={css`
              height: 8px;
            `} />
            {name}
          </Button>;
        })}
      </div>
    </div>}

    {Object.keys(tasks).map((key) => {
      const {
        pkg, page, sharedState,
        windowInfo: { status }
      } = tasks[key];
      return <>
        {status === 'active' && !launcherState && <Scrollbars className={css`
          width: 100%;
          height: 100%;
        `}>
          {getAppComponent(pkg, page) &&
            getAppComponent(pkg, page)(propsGenerator(key, page, sharedState))}
        </Scrollbars>}
        {status === 'active' && !launcherState && <Drawer
          anchor='left'
          on={drawerState}
          onClose={() => setGlobalState({ drawerState: false })}
        >
          <div className={css`
            width: ${document.body.clientWidth * .4};
            height: 100%;
          `}>
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
            `}>
              {getAppComponent(pkg, 'drawer') &&
                getAppComponent(pkg, 'drawer')(propsGenerator(key, page, sharedState))}
            </Scrollbars>
          </div>
        </Drawer>}
      </>;
    })}
  </div >;
}
