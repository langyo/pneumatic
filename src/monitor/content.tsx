import React, { useState } from "react";
import { css } from "@emotion/css";

import { HardwareMonitor } from "./pages/hardwareMonitor";
import { FirewallStatus } from "./pages/firewallStatus";
import { NetworokStatus } from "./pages/networkStatus";
import { ResourceUsgaeStatus } from "./pages/resourceUsageStatus";
import { ThreadManager } from "./pages/threadManager";
import { LoadBalanceStatus } from "./pages/loadBalanceStatus";


export function MonitorContent({ id }: { id: number }) {
  return <>
    {id === 0 && <HardwareMonitor />}
    {id === 1 && <FirewallStatus />}
    {id === 2 && <NetworokStatus />}
    {id === 3 && <ResourceUsgaeStatus />}
    {id === 4 && <ThreadManager />}
    {id === 5 && <LoadBalanceStatus />}
  </>;
}
