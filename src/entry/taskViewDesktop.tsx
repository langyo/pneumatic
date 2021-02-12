import React, { useState, useContext } from 'react';
import Draggable from 'react-draggable';
import { css, cx } from '@emotion/css';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { Scrollbars } from 'react-custom-scrollbars';
import { generate } from 'shortid';

import {
  TaskManagerContext, IWindowInfo,
  ITasksState, ITaskSetState,
  IActiveTasksState, IActiveTasksSetState
} from './taskManager';
import { ApplicationProviderContext, IApp } from './applicationProvider';

export function TaskViewDesktop() {
  const {
    tasks, setTasks,
    activeTasks, setActiveTasks
  }: {
    tasks: ITasksState, setTasks: ITaskSetState,
    activeTasks: IActiveTasksState, setActiveTasks: IActiveTasksSetState
  } = useContext(TaskManagerContext);
  const apps: { [pkg: string]: IApp } = useContext(ApplicationProviderContext);

  function propsGenerator(
    key: string, pkg: string, page: string, args: { [key: string]: string }
  ) {
    return {
      args,
      mediaMode: 'desktop',
      title: tasks[key].windowInfo.title,
      setTitle: (title: string) => {
        setTasks({
          ...tasks,
          [key]: {
            ...tasks[key],
            windowInfo: {
              ...tasks[key].windowInfo,
              title
            }
          }
        });
      },
      page,
      setPage: (page: string) => {
        if (Object.keys(apps[pkg].contentComponent).indexOf(page) < 0) {
          throw Error(`Unknown page '${page}' at the package '${pkg}'.`);
        }
        setTasks({
          ...tasks,
          [key]: {
            ...tasks[key],
            page
          }
        });
      },
      createApplication: ({ pkg, page, args }: {
        pkg: string, page: string, args: { [key: string]: string }
      }) => {
        const key = generate();
        setTasks({
          ...tasks,
          [key]: {
            pkg, page, args,
            windowInfo: {
              top: 50, left: 50, height: 400, width: 600,
              ...(apps[pkg].defaultWindowInfo || {})
            }
          }
        });
      }
    };
  }

  return <>
    {Object.keys(tasks).map((key: string) => {
      const pkg = tasks[key].pkg;
      const page = tasks[key].page;
      const args = tasks[key].args;
      const {
        left, top, width, height, title
      }: IWindowInfo = tasks[key].windowInfo;

      return <Draggable
        defaultPosition={{ x: left, y: top }}
        handle='.drag-handle-tag'
      >
        <div className={css`
          width: ${width}px;
          height: ${height}px;
          position: fixed;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          backdrop-filter: blur(2px);
          ${activeTasks.indexOf(key) >= 0 ? `z-index: 10000;` : ''}
        `}>
          <div className={css`
            width: 100%;
            height: 32px;
            position: absolute;
            top: 0px;
            ${activeTasks.indexOf(key) >= 0 ?
              'background-color: rgba(0, 0, 0, 0.2);' :
              'background-color: rgba(0, 0, 0, 0.1);'};
            user-select: none;
            border-radius: 4px 4px 0px 0px;
          `}
            onMouseDown={() => setActiveTasks([key])}
          >
            <div className={css`
              position: absolute;
              top: 0px;
              left: 4px;
              margin: 4px;
              height: 24px;
              color: #fff;
            `}>
              <Icon path={apps[pkg].icon} size={1} color='#fff' />
            </div>
            <div className={css`
              position: absolute;
              top: 0px;
              left: 48px;
              height: 32px;
              line-height: 32px;
              font-size: 16px;
              color: #fff;
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
              color: #fff;
              border-radius: 4px;
              &:hover {
                background-color: rgba(0, 0, 0, 0.1);
              }
              &:active {
                background-color: rgba(0, 0, 0, 0.2);
            `}>
              <Icon path={mdiClose} size={1} color='#fff' />
            </div>
          </div>
          <div className={css`
            width: calc(40% - 2px);
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            left: 0px;
          `}
            onMouseDown={() => setActiveTasks([key])}
          >
            <div className={css`
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 0px 0px 0px 4px;
              background-color: rgba(0, 0, 0, 0.1);
            `} />
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
              position: absolute;
            `}>
              {apps[pkg].drawerComponent[page] ?
                apps[pkg].drawerComponent[page](propsGenerator(key, pkg, page, args)) :
                apps[pkg].drawerComponent.default(propsGenerator(key, pkg, page, args))}
            </Scrollbars>
          </div>
          <div className={css`
            width: 60%;
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            right: 0px;
          `}
            onMouseDown={() => setActiveTasks([key])}
          >
            <div className={css`
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 0px 0px 4px 0px;
              background-color: rgba(0, 0, 0, 0.1);
            `} />
            <Scrollbars className={css`
              width: 100%;
              height: 100%;
              position: absolute;
            `}>
              {apps[pkg].contentComponent[page] ?
                apps[pkg].contentComponent[page](propsGenerator(key, pkg, page, args)) :
                apps[pkg].contentComponent.default(propsGenerator(key, pkg, page, args))}
            </Scrollbars>
          </div>
        </div>
      </Draggable>;
    })}
    <div className={css`
      position: fixed;
      top: 10%;
      left: 0px;
      height: calc(80% - 16px);
      width: 48px;
      padding: 4px;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 0px 4px 4px 0px;
      backdrop-filter: blur(2px);
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      user-select: none;
      color: #fff;
    `}>
      {Object.keys(tasks).map(key => {
        const { icon } = apps[tasks[key].pkg];
        const isActive = activeTasks.indexOf(key) >= 0;

        return <div className={css`
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          ${isActive && 'background: rgba(0, 0, 0, 0.1);'}
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }
          &:active {
            background-color: rgba(0, 0, 0, 0.2);
          }
        `}
          onClick={() => setActiveTasks([key])}
        >
          <Icon path={icon} size={1} color='#fff' />
        </div>
      })}
    </div>
  </>;
}
