import React, { useState } from 'react';
import { css } from '@emotion/css';

import { HardwareMonitor } from './hardwareMonitor';
import { FirewallStatus } from './firewallStatus';
import { NetworokStatus } from './networkStatus';
import { ResourceUsgaeStatus } from './resourceUsageStatus';
import { ThreadManager } from './threadManager';
import { LoadBalanceStatus } from './loadBalanceStatus';


export const MonitorContentMap = {
  hardware: HardwareMonitor,
  firewall: FirewallStatus,
  network: NetworokStatus,
  resource: ResourceUsgaeStatus,
  thread: ThreadManager,
  loadBalance: LoadBalanceStatus
};
