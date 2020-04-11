import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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
        value={['status', 'fetch', 'parse'].indexOf(pageType)}
        onChange={(e, newValue) => setTab(['status', 'fetch', 'parse'][newValue])}
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