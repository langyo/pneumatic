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

export const controller = {
  $init: ({ taskKey }) => ({
    taskKey
  }),
  
};

export default ({
  taskKey,
  tasks
}) => {
  const classes = makeStyles(theme => ({
    outside: {
      margin: 8,
      padding: 8
    },
    title: {
      marginLeft: 16
    }
  }))();

  return <Paper className={classes.outside}>
    <Typography variant="h6" className={classes.title}>{`当前共有 ${tasks[taskKey].fetch.length} 个页面爬取任务`}</Typography>
    <List>
      {tasks[taskKey].fetch.map(({ title, rule, interval, parseCode }, index) =>
        <ListItem key={index}>
          <ListItemText
            primary={title}
            secondary={rule.type === 'static' ? rule.href : ''}
          />
          <ListItemSecondaryAction>
            <IconButton>
              <Icon path={mdiFileEdit} size={1} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>)}
    </List>
  </Paper>;
};
