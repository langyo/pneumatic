import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  Tabs,
  Tab
} from '@material-ui/core';

export default ({
  $page,
  setTab
}) => {
  const classes = makeStyles(theme => ({
    outside: {
      margin: 8
    }
  }))();

  return <>
    {
      $page !== 'page.overview' && <Paper className={classes.outside}>
        <Tabs
          value={['page.status', 'page.fetch', 'page.parse'].indexOf($page)}
          onChange={(e, newValue) => setTab(['page.status', 'page.fetch', 'page.parse'][newValue])}
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="统计" />
          <Tab label="爬取" />
          <Tab label="分析" />
        </Tabs>
      </Paper>
    }
  </>;
}