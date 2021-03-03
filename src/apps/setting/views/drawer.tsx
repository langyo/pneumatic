import React, { useState } from 'react';
import {
  List, ListItem, ListSubheader, ListItemIcon, ListItemText, Divider
} from '@material-ui/core';
import { Icon } from '@mdi/react';
import {
  mdiApplication
} from '@mdi/js';

export function Drawer({ }) {
  return <List>
    <ListSubheader>
      {'Fast forward'}
    </ListSubheader>
    <ListItem>
      <ListItemIcon>
        <Icon path={mdiApplication} size={1} color='rgba(0, 0, 0, 1)' />
      </ListItemIcon>
      <ListItemText primary='All' />
    </ListItem>
    <Divider />
    <ListSubheader>
      {'Recent'}
    </ListSubheader>
    <ListItem>
      <ListItemIcon>
        <Icon path={mdiApplication} size={1} color='rgba(0, 0, 0, 1)' />
      </ListItemIcon>
      <ListItemText primary='All' />
    </ListItem>
  </List>;
}
