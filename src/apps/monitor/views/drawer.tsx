import React, { useState } from 'react';
import {
  List, ListItem, ListSubheader, ListItemIcon, ListItemText, Divider
} from '@material-ui/core';
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
  return <List>
    {tagMap.map(({ iconPath, title, page }) => <ListItem
      button
      onClick={() => (setPage(page), setWindowInfo({ title }))}
    >
      <ListItemIcon>
        <Icon path={iconPath} size={1} color='rgba(0, 0, 0, 1' />
      </ListItemIcon>
      <ListItemText primary={title} />
    </ListItem>)}
  </List>;
}
