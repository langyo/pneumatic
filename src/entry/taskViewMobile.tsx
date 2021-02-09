import React, { useState, useContext } from "react";
import { css, keyframes } from "@emotion/css";
import Icon from "@mdi/react";
import { mdiClose, mdiFullscreen, mdiFullscreenExit } from "@mdi/js";

import { TaskManagerContext, ITask } from "./taskManager";
import { ApplicationProviderContext, IApp } from './applicationProvider';

const fadeIn = `animation: ${keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`} 0.5s ease 1`;
const fadeOut = `animation: ${keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`} 0.5s ease 1`;

export function TaskViewMobile() {
  const {
    tasks, setTasks,
    activeTasks, setActiveTasks
  }: {
    tasks: ITask[], setTasks: (tasks: ITask[]) => void,
    activeTasks: number[], setActiveTasks: (ids: number[]) => void
  } = useContext(TaskManagerContext);
  const apps: { [pkg: string]: IApp } = useContext(ApplicationProviderContext);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isDrawerExist, setDrawerExist] = useState(false);
  const [isTaskManagerOpen, setTaskManagerOpen] = useState(false);
  const [isTaskManagerExist, setTaskManagerExist] = useState(false);

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
        onClick={() => (
          setDrawerOpen(!isDrawerOpen),
          isDrawerOpen ? setTimeout(() => setDrawerExist(false), 500) : setDrawerExist(true)
        )}
      >
        <Icon path={apps[tasks[activeTasks[0]].pkg].icon} size={1} color='#fff' />
      </div>
      <div className={css`
        position: absolute;
        top: 4px;
        left: 52px;
        height: ${tasks[activeTasks[0]].title ? 20 : 32}px;
        line-height: ${tasks[activeTasks[0]].title ? 20 : 32}px;
        font-size: ${tasks[activeTasks[0]].title ? 16 : 24}px;
        color: #fff;
      `}>
        {apps[tasks[activeTasks[0]].pkg].name}
      </div>
      {tasks[activeTasks[0]].title && <div className={css`
        position: absolute;
        bottom: 4px;
        left: 52px;
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #fff;
      `}>
        {tasks[activeTasks[0]].title}
      </div>}
      {!isTaskManagerOpen && <div
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
        onClick={() => (
          setTaskManagerOpen(true), setTaskManagerExist(true),
          setDrawerOpen(false), setTimeout(() => setDrawerExist(false), 500)
        )}
      >
        <Icon path={mdiFullscreenExit} size={1} color='#fff' />
      </div>}
      {isTaskManagerExist && <div className={css`
        position: absolute;
        height: 100%;
        width: 100%;
        z-index: 10000;
        backdrop-filter: blur(4px);
        ${isTaskManagerOpen ? fadeIn : fadeOut};
      `}>
        <div className={css`
          position: absolute;
          top: 0px;
          left: 20px;
          height: 48px;
          line-height: 48px;
          font-size: 24px;
          color: #fff;
          user-select: none;
        `}>
          {'Task Manager'}
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
          onClick={() => (
            setTaskManagerOpen(false), setTimeout(() => setTaskManagerExist(false), 500)
          )}
        >
          <Icon path={mdiFullscreen} size={1} color='#fff' />
        </div>
      </div>}
    </div>
    <div className={css`
      position: absolute;
      top: 50px;
      height: calc(100% - 50px);
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
    `}>
      {isTaskManagerExist && <div
        className={css`
          position: absolute;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-context: flex-start;
          align-items: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
          ${isTaskManagerOpen ? fadeIn : fadeOut}
        `}>
        {tasks.map(({ pkg, status, title }, index) => <div
          className={css`
            margin-top: 4px;
            height: 48px;
            width: calc(90% - 12px);
            border-left: 12px solid ${activeTasks.indexOf(index) >= 0 ?
              'rgba(51, 153, 160, 0.8)' :
              'rgba(0, 0, 0, 0.1)'};
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.1);
            position: relative;
            ${fadeIn}
          `}
          onClick={() => (
            setActiveTasks([index]),
            setDrawerOpen(false), setTimeout(() => setDrawerExist(false), 500),
            setTaskManagerOpen(false), setTimeout(() => setTaskManagerExist(false))
          )}
        >
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
      </div>}
      {apps[tasks[activeTasks[0]].pkg].contentComponent({})}
    </div>
    {isDrawerExist && <div className={css`
      position: absolute;
      top: 50px;
      height: 100%;
      width: 100%;
      z-index: 5000;
      backdrop-filter: blur(4px);
      ${isDrawerOpen ? fadeIn : fadeOut}
    `}>
      <div className={css`
        position: absolute;
        left: 0px;
        top: 0px;
        height: 100%;
        width: 60%;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 0px 4px 4px 0px;
      `}>
        {apps[tasks[activeTasks[0]].pkg].drawerComponent({})}
      </div>
      <div
        className={css`
          position: absolute;
          right: 0px;
          top: 0px;
          height: 100%;
          width: 40%;
          background-color: rgba(0, 0, 0, 0.1);
        `}
        onClick={() => (setDrawerOpen(false), setTimeout(() => setDrawerExist(false), 500))}
      />
    </div>}
  </div>;
}
