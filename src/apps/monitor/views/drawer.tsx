import React, { useState } from 'react';
import { List } from '../../../utils/frontend/components/list';
import { Button } from '../../../utils/frontend/components/button';
import { css } from '@emotion/css';
import { Icon } from '@mdi/react';
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

export function Drawer({ setPage, setWindowInfo }) {
  return <List items={tagMap.map(({ iconPath, title, page }) => <Button className={css`
    height: 32px;
    line-height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
  `}
    onClick={() => (setPage(page), setWindowInfo({ title }))}
  >
    <div className={css`
      margin: 0px 12px;
    `}>
      <Icon path={iconPath} size={1} color='#fff' />
    </div>
    {title}
  </Button>)} />;
}
