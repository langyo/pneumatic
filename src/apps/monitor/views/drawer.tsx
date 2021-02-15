import React, { useState } from 'react';
import { css } from '@emotion/css';
import {
  mdiDatabase, mdiMemory, mdiMenu, mdiRouterNetwork, mdiServer, mdiWall
} from '@mdi/js';

const tagMap = [
  { iconPath: mdiMemory, title: 'Hardware', page: 'hardware' },
  { iconPath: mdiWall, title: 'Firewall', page: 'firewall' },
  { iconPath: mdiRouterNetwork, title: 'Network', page: 'network' },
  { iconPath: mdiDatabase, title: 'Resource', page: 'resource' },
  { iconPath: mdiMenu, title: 'Thread', page: 'thread' },
  { iconPath: mdiServer, title: 'Load Balance', page: 'loadBalance' }
];

import { ToolbarItem } from '../../../utils/frontend/components/toolbarItem';

export function MonitorDrawer({ setPage, setDrawerShow, setWindowInfo }) {
  return <div className={css`
    margin: 0px;
    padding-top: 8px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    align-content: flex-start;
    color: rgba(255, 255, 255, 1);
  `}>
    {tagMap.map(({ iconPath, title, page }) => <ToolbarItem
      iconPath={iconPath}
      title={title}
      onClick={() => (
        setPage(page),
        setWindowInfo({ title }),
        setDrawerShow(false)
      )}
    />)}
  </div>;
}
