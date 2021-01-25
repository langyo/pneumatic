import React, { useState } from "react";
import { css } from "@emotion/css";
import Icon from "@mdi/react";
import {
  mdiDatabase,
  mdiMemory,
  mdiMenu,
  mdiRouterNetwork,
  mdiServer,
  mdiWall
} from "@mdi/js";

import { HardwareMonitor } from "./hardwareMonitor.tsx";
import { FirewallStatus } from "./firewallStatus.tsx";
import { NetworokStatus } from "./networkStatus.tsx";
import { ResourceUsgaeStatus } from "./resourceUsageStatus.tsx";
import { ThreadManager } from "./threadManager.tsx";
import { LoadBalanceStatus } from "./loadBalanceStatus.tsx";

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

const tagMap = [
  {
    iconPath: mdiMemory,
    title: "性能监视"
  },
  {
    iconPath: mdiWall,
    title: "防火墙状态"
  },
  {
    iconPath: mdiRouterNetwork,
    title: "网络统计"
  },
  {
    iconPath: mdiDatabase,
    title: "资源使用率"
  },
  {
    iconPath: mdiMenu,
    title: "任务管理"
  },
  {
    iconPath: mdiServer,
    title: "负载均衡"
  }
];

export function Monitor({}) {
  const [id, setId] = useState(0);

  return (
    <div>
      <div
        className={css`
          margin: 0px;
          padding-top: 8px;
          height: calc(100% - 8px);
          width: 200px;
          background: rgba(0.5, 0.5, 0.5, 0.2);
          position: absolute;
          top: 0px;
          left: 0px;
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
      </div>
      <div
        className={css`
          margin: 0px;
          height: 100%;
          width: calc(100% - 200px);
          background: rgba(0.5, 0.5, 0.5, 0.1);
          position: absolute;
          top: 0px;
          left: 200px;
        `}
      >
        {id === 0 && <HardwareMonitor />}
        {id === 1 && <FirewallStatus />}
        {id === 2 && <NetworokStatus />}
        {id === 3 && <ResourceUsgaeStatus />}
        {id === 4 && <ThreadManager />}
        {id === 5 && <LoadBalanceStatus />}
      </div>
    </div>
  );
}
