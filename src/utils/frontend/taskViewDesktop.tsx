import React, { useContext } from 'react';
import { Row, Col, Card, Button, Tooltip } from 'antd';
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
          width: ${width}px;
          height: ${height}px;
          position: fixed;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          backdrop-filter: blur(2px);
          z-index: ${5000 + priority};
        `}>
          <div className={css`
            width: 100%;
            height: 32px;
            position: absolute;
            top: 0px;
            ${status === 'active' ?
              'background: rgba(0, 0, 0, 0.4);' :
              'background: rgba(0, 0, 0, 0.2);'};
            user-select: none;
            border-radius: 4px 4px 0px 0px;
          `}
            onMouseDown={() => setActiveTask(key)}
          >
            <div className={css`
              position: absolute;
              top: 0px;
              left: 4px;
              margin: 4px;
              height: 24px;
              color: rgba(255, 255, 255, 1);
            `}>
              <Icon path={apps[pkg].icon} size={1} color='rgba(255, 255, 255, 1)' />
            </div>
            <div className={css`
              position: absolute;
              top: 0px;
              left: 48px;
              height: 32px;
              line-height: 32px;
              font-size: 16px;
              color: rgba(255, 255, 255, 1);
            `}>
              {`${apps[pkg].name}${title ? ` - ${title}` : ''}`}
            </div>
            <div className={cx(css`
              position: absolute;
              top: 0px;
              left: 0px;
              width: calc(100% - 32px);
              height: 32px;
            `, 'drag-handle-tag')} />
            <div className={css`
              position: absolute;
              top: 0px;
              right: 0px;
              height: 24px;
              margin: 4px;
              color: rgba(255, 255, 255, 1);
              border-radius: 4px;
              &:hover {
                background: rgba(0, 0, 0, 0.2);
              }
              &:active {
                background: rgba(0, 0, 0, 0.4);
            `}
              onClick={() => destoryTask(key)}
            >
              <Icon path={mdiClose} size={1} color='rgba(255, 255, 255, 1)' />
            </div>
          </div>
          <div className={css`
            width: calc(40% - 2px);
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            left: 0px;
          `}
            onMouseDown={() => setActiveTask(key)}
          >
            <div className={css`
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 0px 0px 0px 4px;
              background: rgba(0, 0, 0, 0.2);
            `} />
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
            `}>
              {getAppComponent(pkg, 'drawer')(propsGenerator(key, page, state))}
            </Scrollbars>
          </div>
          <div className={css`
            width: 60%;
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            right: 0px;
          `}
            onMouseDown={() => setActiveTask(key)}
          >
            <div className={css`
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 0px 0px 4px 0px;
              background: rgba(0, 0, 0, 0.2);
            `} />
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
            `}>
              {getAppComponent(pkg, page)(propsGenerator(key, page, state))}
            </Scrollbars>
          </div>
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
        '0px 4px 4px 0px' : '4px 0px 0px 4px'};
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
          <Button
            size='large'
            type='text'
            onClick={() => setGlobalState({ launcherState: !launcherState })}
            icon={<Icon path={mdiMenu} size={1} color='rgba(0, 0, 0, 1)' />}
          />
        </Tooltip>
      </div>
    </div>
    <Fade on={launcherState}>
      <div className={css`
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        z-index: 9999;
      `}
        onClick={() => setGlobalState({
          launcherState: false
        })}
      />
      <div className={css`
        position: fixed;
        left: 100px;
        top: 10%;
        width: calc(100% - 200px);
        height: 80%;
        z-index: 10000;
        user-select: none;
      `}
        onClick={() => setGlobalState({
          launcherState: false
        })}
      >
        <div className={css`
          margin: 16px 0px;
          padding: 16px 32px;
          width: calc(100% - 32px);
          height: 36px;
          line-height: 36px;
          font-size: 32px;
          text-align: left;
          color: rgba(255, 255, 255, 1);
        `}>
          {'Launcher'}
        </div>
        <div className={css`
          width: calc(100% - 32px);
          height: calc(100% - 36px - 16px * 2);
          position: absolute;
        `}>
          <Scrollbars className={css`
            width: 100%;
            height: 100%;
          `}>
            <div className={css`
              padding: 16px;
              display: grid;
              grid-template-rows: repeat(auto-fill, 100px);
              grid-template-columns: repeat(auto-fill, 150px);
              gap: 8px;
              justify-items: center;
              justify-content: center;
            `}>
              {Object.keys(apps).map(pkg => {
                const { icon, name } = apps[pkg];
                return <div className={css`
                  width: 120px;
                  height: 100px;
                  display: flex;
                  flex-direction: column;
                  font-size: 16px;
                  line-height: 20px;
                  text-align: center;
                  color: rgba(255, 255, 255, 1);
                  border-radius: 4px;
                  &:hover {
                    background: rgba(0, 0, 0, 0.2);
                  }
                  &:active {
                    background: rgba(0, 0, 0, 0.4);
                  }
                `}
                  onClick={() => generateTask(pkg)}
                >
                  <div className={css`
                    height: 48px;
                    width: 48px;
                    margin: 4px 36px;
                  `}>
                    <Icon path={icon} size={2} color='rgba(255, 255, 255, 1)' />
                  </div>
                  {name}
                </div>;
              })}
            </div>
          </Scrollbars>
        </div>
      </div>
    </Fade>
  </div >;
}
