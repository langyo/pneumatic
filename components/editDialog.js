import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Paper,
  Typography,
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
    }
  }))();

  return [
    <Paper className={classes.outside}>
      <Typography variant="h6">{"当前共有 3 个页面爬取任务"}</Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="https://xxx.xxx.xxx/xxxx"
            secondary="距离下一次爬取开始还有 5 分钟"
          />
          <ListItemSecondaryAction>
            <IconButton>
              <Icon path={mdiFileEdit} size={1} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Paper>
  ];
};
