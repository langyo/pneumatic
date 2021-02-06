import React, { useState } from "react";
import { css } from "@emotion/css";

import { HardwareMonitor } from "./pages/hardwareMonitor";
import { FirewallStatus } from "./pages/firewallStatus";
import { NetworokStatus } from "./pages/networkStatus";
import { ResourceUsgaeStatus } from "./pages/resourceUsageStatus";
import { ThreadManager } from "./pages/threadManager";
import { LoadBalanceStatus } from "./pages/loadBalanceStatus";


export function ExplorerContent({ id }) {
  return <div
    className={css`
      margin: 0px;
      height: 100%;
      width: 100%;
      background: rgba(0.5, 0.5, 0.5, 0.1);
    `}
  >
    {id === 0 && <HardwareMonitor />}
    {id === 1 && <FirewallStatus />}
    {id === 2 && <NetworokStatus />}
    {id === 3 && <ResourceUsgaeStatus />}
    {id === 4 && <ThreadManager />}
    {id === 5 && <LoadBalanceStatus />}
  </div>;
}
