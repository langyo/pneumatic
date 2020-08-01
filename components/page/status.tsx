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

export const controller = {
  $init: ({ taskKey }) => ({
    taskKey
  }),
  
};

export const component = ({
  taskKey,
  tasks
}) => {
  const classes = makeStyles(theme => ({
    paper: {
      padding: 8,
      margin: 8
    },
    title: {
      marginLeft: 16
    }
  }))();

  if (tasks[taskKey].parse.length === 0)
    return <Paper className={classes.paper}>
      <Typography variant="h6" className={classes.title}>{'您尚未添加任何数据分析统计单元'}</Typography>
    </Paper>;

  return tasks[taskKey].parse.map(({ title, type, sourceTable, rules }, index) => {
    switch (type) {
      case 'line-chart':
        return <Card className={classes.paper} key={index}>
          <CardHeader
            avatar={<Icon path={mdiFileTableBoxOutline} size={1} />}
            title={title}
          />
          <CardContent>
            <LineChart width={400} height={200} data={tasks[taskKey].data[sourceTable]}>
              <Line type="monotone" dataKey={rules.yAxis} stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey={rules.xAxis} />
              <YAxis dataKey={rules.yAxis} />
              <Tooltip />
            </LineChart>
          </CardContent>
        </Card>;
      default:
        return <Paper className={classes.paper} key={index}>
          <Typography variant="h6">{title}</Typography>
          <Typography variant="h6">{`Unknown Object - ${type}`}</Typography>
        </Paper>;
    }
  });
};
