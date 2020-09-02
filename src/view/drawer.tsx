import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  Hidden,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";

import Icon from "@mdi/react";
import {
  mdiViewDashboard,
  mdiClose,
  mdiChartBar,
  mdiPlus,
  mdiInformationOutline
} from "@mdi/js";

import {
  setState,
  createModel
} from 'nickelcat-action-preset';
import {
  togglePage
} from 'nickelcat-action-routes';

export const controller = {
  init: ({ taskKey }) => ({
    drawerOpen: false,
    showingTask: taskKey
  }),

  setDrawerState: [
    setState(({ open }) => ({ drawerOpen: open }))
  ],

  loadAboutDialog: [
    createModel(payload => ({
      type: 'dialog.about',
      initState: {}
    }))
  ]
};

export default ({
  drawerOpen,
  setPage,
  setDrawerOpen,
  loadAboutDialog
}) => {
  const drawerWidth = 240;
  const classes = makeStyles(theme => ({
    divider: {
      marginTop: 12,
      marginBottom: 12
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
    }
  }))();
  const drawerBody = <List>
    <ListItem button onClick={loadAboutDialog}>
      <ListItemIcon>
        <Icon path={mdiInformationOutline} size={1} />
      </ListItemIcon>
      <ListItemText primary={"关于"} />
    </ListItem>
  </List>;

  return (
    <>
      <Hidden smUp>
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper
          }}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          {drawerBody}
        </Drawer>
      </Hidden>
      <Hidden xsDown>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          {drawerBody}
        </Drawer>
      </Hidden>
    </>
  );
};
