import React, { useContext } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

import { TaskManagerContext, ITask } from "./taskManager";
import { ApplicationProviderContext, IApp } from './applicationProvider';

export function TaskViewMobile() {
  const tasks: ITask[] = useContext(TaskManagerContext);
  const apps: IApp[] = useContext(ApplicationProviderContext);

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
      <div className={css`
        position: absolute;
        top: 0px;
        left: 16px;
        height: 48px;
        line-height: 48px;
        font-size: 24px;
        color: #fff;
      `}>
        {'Task Manager'}
      </div>
    </div>
    <div className={css`
      position: absolute;
      top: 50px;
      height: calc(100% - 100px);
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
    `}>
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
    </div>
    <div className={css`
      position: absolute;
      bottom: 0px;
      height: 48px;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      &:active {
        background-color: rgba(0, 0, 0, 0.2);
      }
    `}>
      <div className={css`
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 24px;
        color: #fff;
      `}>
        {'Click to return'}
      </div>
    </div>
  </div>;
}
