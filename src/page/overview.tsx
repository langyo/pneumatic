import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Paper,
  Grid,
  Typography,
  Button
} from "@material-ui/core";

import Icon from "@mdi/react";
import { mdiDatabase } from "@mdi/js";

import {
  setState,
  fetch,
  deal
} from 'nickelcat-action-preset';

export const controller = {
  $init: () => ({
    testValue: 1
  }),

  onTestFetch: [
    fetch(
      '/api/test',
      ({ testValue }) => ({ testValue }),
      [
        deal(async ({ testValue }) => ({ testValue: testValue + 1 }))
      ]
    ).catch([
      setState((error) => ({ testValue: 'fail' }))
    ]),
    setState(({ testValue }) => ({ testValue }))
  ]
};

export const component = ({
  tasks,

  testValue,
  onTestFetch
}) => {
  const classes = makeStyles(theme => ({
    paper: {
      padding: 8,
      margin: 8
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
          <Typography variant="h6">{Object.keys(tasks).length}</Typography>
        </Grid>
        <Grid item xs />
      </Grid>
    </Paper>,
    <Button onClick={() => onTestFetch({ testValue })}>{testValue}</Button>
  ];
};
