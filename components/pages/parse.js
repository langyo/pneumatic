import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Paper,
  Typography,
  Fab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";

import Icon from "@mdi/react";
import { mdiPlus, mdiFileEdit } from "@mdi/js";

export default () => {
  const classes = makeStyles(theme => ({
    outside: {
      marginTop: 20,
      padding: 10
    },
    fab: {
      position: "absolute",
      right: theme.spacing(3),
      bottom: theme.spacing(3)
    }
  }))();

  return [
    <Paper className={classes.outside}>
      <Typography variant="h6">{"当前共有 1 个页面分析任务"}</Typography>
      <List>
        <ListItem>
          <ListItemText primary="价格走势" secondary="等待数据中" />
          <ListItemSecondaryAction>
            <IconButton>
              <Icon path={mdiFileEdit} size={1} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Paper>,
    <Fab className={classes.fab}>
      <Icon path={mdiPlus} size={1} />
    </Fab>
  ];
};
