import React, { useContext } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import { mdiFullscreenExit } from "@mdi/js";

import { TaskManagerContext, ITask } from "./taskManager";
import { ApplicationProviderContext, IApp } from './applicationProvider';

export function DialogMobile({
  icon, title, drawerComponent, contextComponent
}) {
  const tasks: ITask[] = useContext(TaskManagerContext);
  const apps: { [pkg: string]: IApp } = useContext(ApplicationProviderContext);

  return <div
    className={css`
      position: fixed;
      height: 100%;
      width: 100%;
      z-index: 10000;
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
      <div
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
      </div>
      <div className={css`
        position: absolute;
        top: 0px;
        left: 52px;
        height: 48px;
        line-height: 48px;
        font-size: 24px;
        color: #fff;
      `}>
        {title}
      </div>
      <div
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
      </div>
    </div>
    <div className={css`
      position: absolute;
      top: 50px;
      height: calc(100% - 50px);
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
    `}>
      {contextComponent}
    </div>
  </div>;
}
