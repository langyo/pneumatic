import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import {
  Paper,
  Typography
} from "@material-ui/core";

export const controller = {
  init: () => ({}),
};

export default ({ }) => {
  const classes = makeStyles(theme => ({
    paper: {
      padding: 8,
      margin: 8
    }
  }))();

  return <Paper className={classes.paper}>
    <Typography variant="h6">{'Index page.'}</Typography>
  </Paper>;
};
