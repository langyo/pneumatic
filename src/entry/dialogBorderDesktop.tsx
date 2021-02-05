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
    </div>
  );
}
