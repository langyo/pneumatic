import React, { useState } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import {
  mdiDatabase, mdiMemory, mdiMenu, mdiRouterNetwork, mdiServer, mdiWall
} from "@mdi/js";

const tagMap = [
  { iconPath: mdiMemory, title: "Hardware" },
  { iconPath: mdiWall, title: "Firewall" },
  { iconPath: mdiRouterNetwork, title: "Network" },
  { iconPath: mdiDatabase, title: "Resource" },
  { iconPath: mdiMenu, title: "Task manager" },
  { iconPath: mdiServer, title: "Load Balance" }
];

function ToolbarItem({ iconPath, title, isActive, onClick }) {
  return (
    <div
      className={css`
        width: 80%;
        height: 32px;
        margin: 2px;
        padding: 4px;
        display: flex;
        ${isActive && "background: rgba(0.5, 0.5, 0.5, 0.1);"}
        &:hover {
          background: rgba(0.5, 0.5, 0.5, 0.1);
        }
        &:active {
          background: rgba(0.5, 0.5, 0.5, 0.2);
        }
      `}
      onClick={onClick}
    >
      <div
        className={css`
          margin: 4px;
        `}
      >
        <Icon path={iconPath} size={1} />
      </div>
      <div
        className={css`
          margin: 0px 8px;
          line-height: 32px;
          user-select: none;
        `}
      >
        {title}
      </div>
    </div>
  );
}

export function MonitorDrawer({ }) {
  const [id, setId] = useState(0);

  return <div
    className={css`
      margin: 0px;
      padding-top: 8px;
      height: calc(100% - 8px);
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: top;
      align-items: center;
      align-content: flex-start;
    `}
  >
    {tagMap.map(({ iconPath, title }, index) => (
      <ToolbarItem
        iconPath={iconPath}
        title={title}
        isActive={id === index}
        onClick={() => setId(index)}
      />
    ))}
  </div>;
}
