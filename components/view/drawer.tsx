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
  togglePage,
  createModel
} from 'nickelcat-action-preset';

export const controller = {
  $init: ({ taskKey }) => ({
    drawerOpen: false,
    showingTask: taskKey
  }),

  setPage: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    })),
    setState(({ initState: { taskKey }}) => ({ showingTask: taskKey })),
    setState(() => ({ drawerOpen: false }))
  ],
  setDrawerState: [
    setState(({ open }) => ({ drawerOpen: open }))
  ],

  loadCreateNewTaskDialog: [
    createModel(payload => ({
      type: 'dialog.createNewTask',
      initState: {}
    }))
  ],
  loadAboutDialog: [
    createModel(payload => ({
      type: 'dialog.about',
      initState: {}
    }))
  ]
};

export const component = ({
  $page,
  drawerOpen,
  showingTask,
  setPage,
  setDrawerOpen,
  tasks,
  loadCreateNewTaskDialog,
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
    <ListItem
      button
      selected={$page === "page.overview"}
      onClick={() => setPage({ type: "page.overview", initState: {} })}
    >
      <ListItemIcon>
        <Icon path={mdiViewDashboard} size={1} />
      </ListItemIcon>
      <ListItemText primary={"概览"} secondary={`正在运行 ${Object.keys(tasks).length} 个计划`} />
    </ListItem>
    <Divider className={classes.divider} />
    {
      Object.keys(tasks).map(key => <ListItem
        button
        selected={$page !== 'page.overview' && showingTask === key}
        onClick={() => setPage({ type: 'page.status', initState: { taskKey: key } })}
        key={key}
      >
        <ListItemIcon>
          <Icon path={mdiChartBar} size={1} />
        </ListItemIcon>
        <ListItemText primary={key} secondary={
          tasks[key].status === 'sleep' ? '休眠中' :
            tasks[key].status === 'working' ? '运行中' :
              '未知'
        } />
        <ListItemSecondaryAction>
          <IconButton size="small">
            <Icon path={mdiClose} size={0.75} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>)
    }
    <ListItem button onClick={loadCreateNewTaskDialog}>
      <ListItemIcon>
        <Icon path={mdiPlus} size={1} />
      </ListItemIcon>
      <ListItemText primary={"创建新任务"} />
    </ListItem>
    <Divider className={classes.divider} />
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