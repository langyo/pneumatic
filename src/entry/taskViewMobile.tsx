import React, { useContext } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import { mdiClose } from "@mdi/js";

import { TaskManagerContext, ITask } from "./taskManager";

export default function () {
  const tasks: ITask[] = useContext(TaskManagerContext);

  return <div
    className={css`
      position: fixed;
      height: 100%;
      width: 100%;
      z-index: 10000;
      background-color: rgba(0.5, 0.5, 0.5, 0.2);
    `}
  >
    <div className={css`
      position: absolute;
      top: 8px;
      right: 8px;
      margin: 4px;
      border-radius: 4px;
      &:hover {
        background-color: rgba(0.5, 0.5, 0.5, 0.1)
      }
      &:active {
        background-color: rgba(0.5, 0.5, 0.5, 0.2)
      }
    `}>
      <Icon path={mdiClose} size={1} color="#fff" />
    </div>
  </div>;
}
