import React, { useState, useContext } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import { mdiClose, mdiFullscreenExit } from "@mdi/js";

import { TaskManagerContext, ITask } from "./taskManager";
import { ApplicationProviderContext, IApp } from './applicationProvider';

export function TaskViewMobile({ isManageMode, setManageMode }) {
  const tasks: ITask[] = useContext(TaskManagerContext);
  const apps: { [pkg: string]: IApp } = useContext(ApplicationProviderContext);

  const activeTasks = tasks.filter(({ status }) => status === 'active');
  const icon = apps[activeTasks[0].pkg].icon;
  const title = `${apps[activeTasks[0].pkg].name}${activeTasks[0].title ? ` - ${activeTasks[0].title}` : ''}`;
  const drawerComponent = apps[activeTasks[0].pkg].drawerComponent;
  const contentComponent = apps[activeTasks[0].pkg].contentComponent;

  return <div
    className={css`
      position: fixed;
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      user-select: none;
    `}
  >
    <div className={css`
      position: absolute;
      top: 0px;
      height: 48px;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
    `}>
      {!isManageMode && <div
        className={css`
          position: absolute;
          top: 0px;
          left: 4px;
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }
          &:active {
            background-color: rgba(0, 0, 0, 0.2);
          }
        `}
      >
        <Icon path={icon} size={1} color='#fff' />
      </div>}
      {isManageMode && <div className={css`
        position: absolute;
        top: 0px;
        left: 16px;
        height: 48px;
        line-height: 48px;
        font-size: 24px;
        color: #fff;
        user-select: none;
      `}>
        {'Task Manager'}
      </div>}
      {!isManageMode && <div className={css`
        position: absolute;
        top: 0px;
        left: 52px;
        height: 48px;
        line-height: 48px;
        font-size: 24px;
        color: #fff;
      `}>
        {title}
      </div>}
      {!isManageMode && <div
        className={css`
          position: absolute;
          top: 0px;
          right: 4px;
          margin: 4px;
          padding: 8px;
          border-radius: 4px;
          &:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }
          &:active {
            background-color: rgba(0, 0, 0, 0.2);
          }
        `}
      >
        <Icon path={mdiFullscreenExit} size={1} color='#fff' />
      </div>}
    </div>
    <div className={css`
      position: absolute;
      top: 50px;
      height: calc(100% - 50px);
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
    `}>
      {isManageMode && <>
        <div className={css`
          display: flex;
          flex-direction: column;
          justify-context: flex-start;
          align-items: center;
        `}>
          {tasks.map(({ pkg, status, title }) => <div className={css`
            margin-top: 4px;
            height: 48px;
            width: calc(90% - 12px);
            border-left: 12px solid ${status === 'active' ? 'rgba(51, 153, 160, 0.8)' : 'rgba(0, 0, 0, 0.1)'};
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.1);
            position: relative;
          `}>
            <div className={css`
              position: absolute;
              top: 0px;
              left: 16px;
              height: ${title ? 28 : 48}px;
              line-height: ${title ? 28 : 48}px;
              font-size: ${title ? 16 : 24}px;
              color: #fff;
            `}>
              {apps[pkg].name}
            </div>
            {title && <div className={css`
              position: absolute;
              bottom: 4px;
              left: 16px;
              height: 16px;
              line-height: 16px;
              font-size: 12px;
              color: #fff;
            `}>
              {title}
            </div>}
            <div className={css`
              position: absolute;
              top: 8px;
              right: 4px;
              margin: 4px;
              border-radius: 4px;
              &:hover {
                background-color: rgba(0, 0, 0, 0.1);
              }
              &:active {
                background-color: rgba(0, 0, 0, 0.2);
              }
            `}>
              <Icon path={mdiClose} size={1} color="#fff" />
            </div>
          </div>)}
        </div>
        <div className={css`
          position: absolute;
          bottom: 0px;
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 24px;
          color: #fff;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.1);
          &:active {
            background-color: rgba(0, 0, 0, 0.2);
          }
        `}>
          {'Click to return'}
        </div>
      </>}
      {!isManageMode && contentComponent({})}
    </div>
  </div>;
}
