import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Paper, Typography, Fab } from "@material-ui/core";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

import Icon from "@mdi/react";
import { mdiSemanticWeb } from "@mdi/js";

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

  const data = [
    { time: "09:00", money: 3.72 },
    { time: "10:00", money: 3.73 },
    { time: "11:00", money: 3.92 },
    { time: "12:00", money: 3.7 },
    { time: "13:00", money: 3.52 },
    { time: "14:00", money: 3.47 }
  ];

  return [
    <Paper className={classes.outside}>
      <Typography variant="h6">{"价格走势"}</Typography>
      <LineChart width={400} height={200} data={data}>
        <Line type="monotone" dataKey="money" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </Paper>,
    <Fab className={classes.fab}>
      <Icon path={mdiSemanticWeb} size={1} />
    </Fab>
  ];
};
