import React, { useState, useContext } from "react";
import Draggable from 'react-draggable';
import { css, cx } from "@emotion/css";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";
import { Scrollbars } from 'react-custom-scrollbars';

import { TaskManagerContext, ITask } from "./taskManager";
import { ApplicationProviderContext, IApp } from './applicationProvider';

export function TaskViewDesktop() {
  const {
    tasks, setTasks,
    activeTasks, setActiveTasks
  }: {
    tasks: ITask[], setTasks: (tasks: ITask[]) => void,
    activeTasks: number[], setActiveTasks: (ids: number[]) => void
  } = useContext(TaskManagerContext);
  const apps: { [pkg: string]: IApp } = useContext(ApplicationProviderContext);
  const [isManageMode, setManageMode] = useState(false);

  return <>
    {tasks.map(({ pkg, title, status, left, top, width, height }, index) => <Draggable
      defaultPosition={{ x: left, y: top }}
      handle='.drag-handle-tag'
    >
      <div
        className={css`
          width: ${width}px;
          height: ${height}px;
          position: fixed;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          ${activeTasks.indexOf(index) >= 0 ? `backdrop-filter: blur(4px); z-index: 10000;` : ''}
        `}
      >
        <div
          className={css`
            width: 100%;
            height: 32px;
            position: absolute;
            top: 0px;
            ${activeTasks.indexOf(index) >= 0 ?
              'background-color: rgba(0, 0, 0, 0.2);' :
              'background-color: rgba(0, 0, 0, 0.1);'};
            user-select: none;
            border-radius: 4px 4px 0px 0px;
          `}
          onMouseDown={() => setActiveTasks([index])}
        >
          <div
            className={css`
              position: absolute;
              top: 0px;
              left: 4px;
              margin: 4px;
              height: 24px;
              color: #fff;
            `}
          >
            <Icon path={apps[pkg].icon} size={1} color='#fff' />
          </div>
          <div
            className={css`
              position: absolute;
              top: 0px;
              left: 48px;
              height: 32px;
              line-height: 32px;
              font-size: 16px;
              color: #fff;
            `}
          >
            {`${apps[pkg].name}${title ? ` - ${title}` : ''}`}
          </div>
          <div
            className={cx(css`
              position: absolute;
              top: 0px;
              left: 0px;
              width: calc(100% - 32px);
              height: 32px;
            `, 'drag-handle-tag')}
          />
          <div
            className={css`
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
            `}
          >
            <Icon path={mdiClose} size={1} color='#fff' />
          </div>
        </div>
        <div
          className={css`
            width: calc(40% - 2px);
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            left: 0px;
          `}
          onMouseDown={() => setActiveTasks([index])}
        >
          <div
            className={css`
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 0px 0px 0px 4px;
              background-color: rgba(0, 0, 0, 0.1);
            `}
          />
          <Scrollbars
            className={css`
              width: 100%;
              height: 100%;
              position: absolute;
            `}
          >
            {apps[pkg].drawerComponent({})}
          </Scrollbars>
        </div>
        <div
          className={css`
            width: 60%;
            height: calc(100% - 34px);
            position: absolute;
            bottom: 0px;
            right: 0px;
          `}
          onMouseDown={() => setActiveTasks([index])}
        >
          <div
            className={css`
              width: 100%;
              height: 100%;
              position: absolute;
              border-radius: 0px 0px 4px 0px;
              background-color: rgba(0, 0, 0, 0.1);
            `}
          />
          <Scrollbars
            className={css`
              width: 100%;
              height: 100%;
              position: absolute;
            `}
          >
            {apps[pkg].contentComponent({})}
          </Scrollbars>
        </div>
      </div>
    </Draggable>)}
  </>;
}
