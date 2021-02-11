import React, { useState } from "react";
import { css } from "@emotion/css";

import { HardwareMonitor } from "./pages/hardwareMonitor";
import { FirewallStatus } from "./pages/firewallStatus";
import { NetworokStatus } from "./pages/networkStatus";
import { ResourceUsgaeStatus } from "./pages/resourceUsageStatus";
import { ThreadManager } from "./pages/threadManager";
import { LoadBalanceStatus } from "./pages/loadBalanceStatus";


export const MonitorContentMap = {
  hardware: HardwareMonitor,
  firewall: FirewallStatus,
  network: NetworokStatus,
  resource: ResourceUsgaeStatus,
  thread: ThreadManager,
  loadBalance: LoadBalanceStatus
};
