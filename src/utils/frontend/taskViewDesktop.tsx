import React, { useContext } from 'react';
import { PageHeader, Card, Button, Tooltip, Popover, Row, Col } from 'antd';
import Draggable, { DraggableData } from 'react-draggable';
import { css, cx } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose, mdiMenu } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';

import { Fade, Grow } from './components/transition';
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

  console.log(tasks)

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
          <Card className={css`
            width: ${width}px;
            height: ${height}px;
          `}
          >
            <div className={css`
              width: 100%;
              height: 100%;
            `}
              onMouseDown={() => setActiveTask(key)}
            >
              <PageHeader
                title={apps[pkg].name}
                subTitle={title || ''}
                backIcon={<Icon path={apps[pkg].icon} size={1} color='rgba(0, 0, 0, 1)' />}
                onBack={() => { }}
                className={cx(css`
                  user-select: none;
                `, 'drag-handle-tag')}
                extra={[
                  <Button
                    type='text'
                    icon={<Icon path={mdiClose} size={1} color='rgba(0, 0, 0, 1)' />}
                    onClick={() => destoryTask(key)}
                  />
                ]}
              >
                <div className={css`
                  width: 100%;
                  height: 100%;
                  display: flex;
                  flex-direction: row;
                `}>
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
              </PageHeader>
            </div>
          </Card>
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
          <Button
            size='large'
            type={key === activeTaskId ? 'default' : 'text'}
            onClick={() => setActiveTask(key)}
            icon={<Icon path={icon} size={1} color='rgba(0, 0, 0, 1)' />}
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
          <Popover
            placement='rightBottom'
            title='Launcher'
            visible={launcherState}
            content={<Row justify='start' align='start'>
              {Object.keys(apps).map(pkg => {
                const { icon, name } = apps[pkg];
                return <Col span={6}>
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
            </Row>}
          >
            <Button
              size='large'
              type='text'
              onClick={() => setGlobalState({ launcherState: !launcherState })}
              icon={<Icon path={mdiMenu} size={1} color='rgba(0, 0, 0, 1)' />}
            />
          </Popover>
        </Tooltip>
      </div>
    </div>
  </div >;
}
