import React, { useState } from 'react';
import {
  List, ListItem, ListSubheader, ListItemIcon, ListItemText, Divider
} from '@material-ui/core';
import { Icon } from '@mdi/react';
import {
  mdiServerNetwork, mdiFolderOutline
} from '@mdi/js';

export function Drawer({ }) {
  return <List>
    <ListSubheader>
      {'Device'}
    </ListSubheader>
    <ListItem>
      <ListItemIcon>
        <Icon path={mdiServerNetwork} size={1} color='rgba(0, 0, 0, 1)' />
      </ListItemIcon>
      <ListItemText primary='All' />
    </ListItem>
    <Divider />
    <ListSubheader>
      {'Fast forward'}
    </ListSubheader>
    <ListItem>
      <ListItemIcon>
        <Icon path={mdiFolderOutline} size={1} color='rgba(0, 0, 0, 1)' />
      </ListItemIcon>
      <ListItemText primary='nickelcat' />
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <Icon path={mdiFolderOutline} size={1} color='rgba(0, 0, 0, 1)' />
      </ListItemIcon>
      <ListItemText primary='pneumatic' />
    </ListItem>
  </List>;
}