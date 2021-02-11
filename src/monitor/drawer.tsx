import React, { useState } from 'react';
import { css } from '@emotion/css';
import {
  mdiDatabase, mdiMemory, mdiMenu, mdiRouterNetwork, mdiServer, mdiWall
} from '@mdi/js';

const tagMap = [
  { iconPath: mdiMemory, title: 'Hardware' },
  { iconPath: mdiWall, title: 'Firewall' },
  { iconPath: mdiRouterNetwork, title: 'Network' },
  { iconPath: mdiDatabase, title: 'Resource' },
  { iconPath: mdiMenu, title: 'Task manager' },
  { iconPath: mdiServer, title: 'Load Balance' }
];

import { ToolbarItem } from '../utils/toolbarItem';

export function MonitorDrawer({ }) {
  return <div className={css`
    margin: 0px;
    padding-top: 8px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items: center;
    align-content: flex-start;
    color: #fff;
  `}>
    {tagMap.map(({ iconPath, title }, index) => (
      <ToolbarItem
        iconPath={iconPath}
        title={title}
      />
    ))}
  </div>;
}
