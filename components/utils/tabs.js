import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  Tabs, 
  Tab
} from '@material-ui/core';

export default ({
  pageType,
  setTab
}) => {
  const classes = makeStyles(theme => ({
    outside: {
      margin: 8
    }
  }))();

  return (
    <Paper className={classes.outside}>
      <Tabs
        value={['statusPage', 'fetchPage', 'parsePage'].indexOf(pageType)}
        onChange={(e, newValue) => setTab(['statusPage', 'fetchPage', 'parsePage'][newValue])}
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="统计" />
        <Tab label="爬取" />
        <Tab label="分析" />
      </Tabs>
    </Paper>
  );
}