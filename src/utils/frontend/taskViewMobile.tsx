import React, { useContext } from 'react';
import { Button, Drawer, PageHeader, List, Row, Col, Tooltip } from 'antd';
import Draggable, { DraggableData } from 'react-draggable';
import { css } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiArrowRight, mdiClose, mdiFullscreen, mdiFullscreenExit } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import { Fade } from './components/transition';
import {
  TaskManagerContext, IWindowInfo, IState, ITaskManagerContext
} from './taskManagerContext';
import {
  ApplicationProviderContext, IApps, IGetAppComponent
} from './appProviderContext';


export function TaskViewMobile() {
  const {
    tasks, generateTask, destoryTask,
    propsGenerator, setActiveTask,
    globalState: {
      drawerState, launcherState, taskManagerState, taskManagerPosition
    }, setGlobalState
  }: ITaskManagerContext = useContext(TaskManagerContext);
  const { apps, getAppComponent }: {
    apps: IApps, getAppComponent: IGetAppComponent
  } = useContext(ApplicationProviderContext);

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
        onStop={(_e: Event, state: DraggableData) => {
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
          icon={<Icon path={mdiFullscreen} size={1} color='rgba(0, 0, 0, 1)' />}
        />
      </Draggable>
    </div>}

    <Drawer
      placement='top'
      title='Task Manager'
      visible={taskManagerState}
      closable={false}
      onClose={() => setGlobalState({ taskManagerState: false })}
    >
      <List
        footer={<Button
          type='text'
          title='Back to the launcher'
          onClick={() => setGlobalState({ launcherState: true, taskManagerState: false })}
        />}
        dataSource={Object.keys(tasks).sort(
          (left, right) =>
            tasks[left].windowInfo.taskManagerOrder -
            tasks[right].windowInfo.taskManagerOrder
        )}
        renderItem={(key: string) => {
          const pkg = tasks[key].pkg;
          const { title }: IWindowInfo = tasks[key].windowInfo;

          return <List.Item
            actions={[<Button
              size='small'
              type='text'
              icon={<Icon path={mdiArrowRight} size={1} color='rgba(0, 0, 0, 1)' />}
              onClick={() => (
                setActiveTask(key),
                setGlobalState({
                  drawerState: false,
                  launcherState: false
                })
              )}
            />,
            <Button
              size='small'
              type='text'
              icon={<Icon path={mdiClose} size={1} color='rgba(0, 0, 0, 1)' />}
              onClick={(event: Event) => {
                event.stopPropagation();
                if (tasks[key].windowInfo.status === 'active') {
                  setGlobalState({
                    launcherState: true
                  });
                }
                destoryTask(key);
                setGlobalState({ taskManagerState: false });
              }}
            />]}
          >
            <List.Item.Meta
              title={apps[pkg].name}
              description={title}
            />
          </List.Item>;
        }}
      />
    </Drawer>

    {launcherState && <PageHeader ghost={false} title='Launcher'>
      <Row justify='start' align='start'>
        <Button
          onClick={() => setGlobalState({
            launcherState: true,
            drawerState: false,
            taskManagerState: false
          })}
        />
        {Object.keys(apps).map(pkg => {
          const { icon, name } = apps[pkg];
          return <Col span={4}>
            <Tooltip title={name} placement='top'>
              <Button
                size='large'
                shape='circle'
                icon={<Icon path={icon} size={1} color='rgba(0, 0, 0, 1)' />}
                onClick={() => (generateTask(pkg), setGlobalState({ launcherState: false }))}
              />
            </Tooltip>
          </Col>;
        })}
      </Row>
    </PageHeader>}

    {Object.keys(tasks).map((key) => {
      const {
        pkg, page, state, windowInfo: { title }
      } = tasks[key];

      return <>
        <PageHeader
          ghost={false}
          title={apps[pkg].name}
          subTitle={title}
          backIcon={<Icon path={apps[pkg].icon} size={1} color='rgba(0, 0, 0, 1)' />}
          onBack={() => setGlobalState({ drawerState: !drawerState })}
        >
          {getAppComponent(pkg, page)(propsGenerator(key, page, state))}
        </PageHeader>

        <Drawer
          placement='left'
          visible={drawerState}
          closable={false}
          onClose={() => setGlobalState({ drawerState: false })}
        >
          {getAppComponent(pkg, 'drawer')(propsGenerator(key, page, state))}
        </Drawer>
      </>;
    })}
  </div>;
}
