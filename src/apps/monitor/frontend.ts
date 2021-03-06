import { HardwareMonitor } from './views/hardwareMonitor';
import { FirewallStatus } from './views/firewallStatus';
import { NetworokStatus } from './views/networkStatus';
import { ResourceUsgaeStatus } from './views/resourceUsageStatus';
import { ThreadManager } from './views/threadManager';
import { LoadBalanceStatus } from './views/loadBalanceStatus';

import { Drawer } from './views/drawer';

export const pages = {
  hardware: HardwareMonitor,
  firewall: FirewallStatus,
  network: NetworokStatus,
  resource: ResourceUsgaeStatus,
  thread: ThreadManager,
  loadBalance: LoadBalanceStatus,

  drawer: Drawer
};

export const config = {
  defaultInfo: {
    page: 'hardware',
    windowInfo: {
      title: (_page, _data) => 'Hardware'
    }
  }
};
