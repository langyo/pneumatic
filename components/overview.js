import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Paper, Grid, Typography } from "@material-ui/core";

import Icon from "@mdi/react";
import { mdiDatabase } from "@mdi/js";

export default () => {
  const classes = makeStyles(theme => ({
    paper: {
      padding: 8
    }
  }))();

  return [
    <Paper className={classes.paper}>
      <Grid container>
        <Grid item xs />
        <Grid item xs={3}>
          <Icon path={mdiDatabase} size={2.8} color="#666" />
        </Grid>
        <Grid item xs={1} />
        <Grid item xs={6}>
          <Typography variant="h6">{"当前任务数量"}</Typography>
          <Typography variant="h6">{"1 / 2"}</Typography>
        </Grid>
        <Grid item xs />
      </Grid>
    </Paper>
  ];
};
