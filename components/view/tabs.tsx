import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  Tabs,
  Tab
} from '@material-ui/core';

import {
  togglePage
} from 'nickelcat-action-preset';

export const controller = {
  $init: ({ taskKey }) => ({
    showingTask: taskKey
  }),

  setTab: [
    togglePage(({ type, initState }) => ({
      type,
      initState
    }))
  ]
};

export const component = ({
  $page,
  showingTask,
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
          onChange={(e, newValue) => setTab({
            type: ['page.status', 'page.fetch', 'page.parse'][newValue],
            initState: { taskKey: showingTask }
          })}
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