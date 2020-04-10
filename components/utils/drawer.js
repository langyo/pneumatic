import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import {
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
  mdiChartBar
} from "@mdi/js";

export default ({
  page,
  setPage,
  tasks
}) => {
  const classes = makeStyles(theme => ({
    divider: {
      marginTop: 12,
      marginBottom: 12
    }
  }))();

  return (
    <List>
      <ListItem
        button
        selected={page === "overview"}
        onClick={() => setPage("overview")}
      >
        <ListItemIcon>
          <Icon path={mdiViewDashboard} size={1} />
        </ListItemIcon>
        <ListItemText primary={"概览"} secondary={`正在运行 ${Object.keys(tasks).length} 个计划`} />
      </ListItem>
      <Divider className={classes.divider} />
      {Object.keys(tasks).map(key => <ListItem
        button
        selected={page === `task-${key}`}
        onClick={() => setPage(`task-${key}`)}
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
      </ListItem>)}
    </List>
  );
};