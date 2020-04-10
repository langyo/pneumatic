import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Card,
  CardHeader,
  CardContent,
  Paper,
  Typography
} from "@material-ui/core";

export default ({
  taskKey,
  tasks
}) => {
  const classes = makeStyles(theme => ({
    paper: {
      padding: 8,
      margin: 8
    },
    headTitle: {
      marginLeft: 16
    },
    fab: {
      position: 'absolute',
      bottom: theme.spacing(3),
      right: theme.spacing(3)
    }
  }))();

  return [
    <Paper className={classes.paper}>
      <Typography variant="h6" className={classes.headTitle}>{'解析'}</Typography>
    </Paper>
  ];
};
