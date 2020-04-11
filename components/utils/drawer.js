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
  mdiChartBar,
  mdiPlus,
  mdiInformationOutline
} from "@mdi/js";

export default ({
  page,
  showingTask,
  setPage,
  tasks,
  loadCreateNewTaskDialog,
  loadAboutDialog
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
        onClick={() => setPage({ type: "overview", initState: {} })}
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
          selected={page !== 'overview' && showingTask === key}
          onClick={() => setPage({ type: 'status', initState: { taskKey: key } })}
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
    </List>
  );
};
