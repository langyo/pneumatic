import React from "react";

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
  mdiServerNetwork,
  mdiPlus
} from "@mdi/js";

export default ({ page, setPage }) => {
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
        <ListItemText primary={"概览"} secondary={"正在运行 1 个计划"} />
      </ListItem>
      <Divider />
      <ListItem
        button
        selected={page === "task"}
        onClick={() => setPage("task")}
      >
        <ListItemIcon>
          <Icon path={mdiChartBar} size={1} />
        </ListItemIcon>
        <ListItemText primary={"Steam"} secondary={"休眠中，可以检阅"} />
        <ListItemSecondaryAction>
          <IconButton size="small">
            <Icon path={mdiClose} size={0.75} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon path={mdiServerNetwork} size={1} />
        </ListItemIcon>
        <ListItemText primary={"MCBBS"} secondary={"正在爬取: thread 994209"} />
        <ListItemSecondaryAction>
          <IconButton size="small">
            <Icon path={mdiClose} size={0.75} />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem button>
        <ListItemIcon>
          <Icon path={mdiPlus} size={1} />
        </ListItemIcon>
        <ListItemText primary={"添加任务"} />
      </ListItem>
    </List>
  );
};
