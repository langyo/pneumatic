import React, { useState, useContext } from "react";
import Draggable from 'react-draggable';
import { css, cx } from "@emotion/css";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

import { TaskManagerContext } from "./taskManager";

export function DialogDesktop({
  icon, title, drawerComponent, contextComponent, defaultPos
}) {
  return <Draggable
    defaultPosition={defaultPos}
    handle='.drag-handle-tag'
  >
    <div
      className={css`
        width: 600px;
        height: 400px;
        position: fixed;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      `}
    >
      <div
        className={css`
          width: 100%;
          height: 32px;
          position: absolute;
          top: 0px;
          background-color: rgba(0, 0, 0, 0.1);
          user-select: none;
          border-radius: 4px;
        `}
      >
        {icon && <div
          className={css`
            position: absolute;
            top: 0px;
            left: 4px;
            margin: 4px;
            height: 24px;
            color: #fff;
          `}
        >
          <Icon path={icon} size={1} color='#fff' />
        </div>}
        <div
          className={css`
            position: absolute;
            top: 0px;
            left: ${icon ? '48px' : '16px'};
            height: 32px;
            line-height: 32px;
            font-size: 16px;
            color: #fff;
          `}
        >
          {title}
        </div>
        <div className={cx(css`
            position: absolute;
            top: 0px;
            left: 0px;
            width: calc(100% - 32px);
            height: 32px;
          `, 'drag-handle-tag')} />
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
            }
          `}
        >
          <Icon path={mdiClose} size={1} color='#fff' />
        </div>
      </div>
      <div
        className={css`
          width: 200px;
          height: calc(100% - 34px);
          position: absolute;
          bottom: 0px;
          left: 0px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        `}
      >
        {drawerComponent}
      </div>
      <div
        className={css`
          width: calc(100% - 202px);
          height: calc(100% - 34px);
          position: absolute;
          bottom: 0px;
          right: 0px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        `}
      >
        {contextComponent}
      </div>
    </div>
  </Draggable>;
}
