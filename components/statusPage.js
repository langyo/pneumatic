import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Card,
  CardHeader,
  CardContent,
  Paper,
  Typography,
  IconButton,
  Fab
} from "@material-ui/core";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import Icon from "@mdi/react";
import {
  mdiFileTableBoxOutline,
  mdiTableEdit
} from "@mdi/js";

export default ({
  taskKey,
  tasks
}) => {
  const classes = makeStyles(theme => ({
    paper: {
      padding: 8,
      margin: 8
    }
  }))();

  return [
    ...tasks[taskKey].analyze.map(({ target, data }) => {
      switch (target.type) {
        case 'single-var-line-chart':
          return <Card className={classes.paper}>
            <CardHeader
              avatar={<Icon path={mdiFileTableBoxOutline} size={1} />}
              title={target.title}
            />
            <CardContent>
              <LineChart width={400} height={200} data={data}>
                <Line type="monotone" dataKey="money" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey={target.rule.xAxis} />
                <YAxis dataKey={target.rule.yAxis} />
                <Tooltip />
              </LineChart>
            </CardContent>
          </Card>;
        default:
          return <Paper className={classes.paper}>
            <Typography variant="h6">{target.title}</Typography>
            <Typography variant="h6">{`Unknown Object - ${target.type}`}</Typography>
          </Paper>
      }
    })
  ];
};
