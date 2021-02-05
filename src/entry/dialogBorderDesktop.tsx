import React, { useContext } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import {
  mdiUnfoldMoreVertical,
  mdiViewCarouselOutline
} from "@mdi/js";

import { TaskManagerContext } from "./taskManager";

export default function () {
  const { active, list } = useContext(TaskManagerContext);

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
        margin: 0px;
        &::after {
          filter: blur(2px);
        }
        background: linear-gradient(to right, #39c, #6cf, #39c);
        position: absolute;
      `}
    >
      {/* Tag bar */}
      <div
        className={css`
          height: 28px;
          width: 100%;
          position: absolute;
          top: 0;
          backdrop-filter: blur(2px);
          background: rgba(0.5, 0.5, 0.5, 0.1);
          margin: 0px 0px 2px 0px;
          padding: 0px 0px;
        `}
      >
        <div
          className={css`
            position: absolute;
            right: 28px;
            top: 0px;
          `}
        >
          <button
            className={css`
              border: none;
              outline: none;
              background: none;
              width: 24px;
              height: 24px;
              margin: 2px;
              padding: 2px;
              &:hover {
                background: rgba(0.5, 0.5, 0.5, 0.2);
              }
              &:active {
                background: rgba(0.5, 0.5, 0.5, 0.4);
              }
            `}
          >
            <Icon path={mdiViewCarouselOutline} size={0.8} color="#fff" />
          </button>
        </div>
        <div
          className={css`
            position: absolute;
            right: 2px;
            top: 0px;
          `}
        >
          <button
            className={css`
              border: none;
              outline: none;
              background: none;
              width: 24px;
              height: 24px;
              margin: 2px;
              padding: 2px;
              &:hover {
                background: rgba(0.5, 0.5, 0.5, 0.2);
              }
              &:active {
                background: rgba(0.5, 0.5, 0.5, 0.4);
              }
            `}
          >
            <Icon path={mdiUnfoldMoreVertical} size={0.8} color="#fff" />
          </button>
        </div>
      </div>
      {/* App area */}
      <div
        className={css`
          margin: 30px 0px 0px 0px;
          height: calc(100% - 30px);
          width: 100%;
          position: relative;
          color: white;
        `}
      >
      </div>
    </div>
  );
}
