import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Fab,
  Zoom
}from '@material-ui/core';

import Icon from "@mdi/react";
import {
  mdiTableEdit,
  mdiPlus
} from "@mdi/js";

import {
  createModel
} from 'nickelcat-action-preset';

export const controller = {
  loadFetchDialog: [
    createModel(payload => ({
      type: 'dialog.fetchConfig',
      initState: {}
    }))
  ],
  loadParseDialog: [
    createModel(payload => ({
      type: 'dialog.parseConfig',
      initState: {}
    }))
  ]
};

export const component = ({
  $type,

  loadFetchDialog,
  loadParseDialog
}) => {
  const classes = makeStyles(theme => ({
    fab: {
      position: 'absolute',
      right: theme.spacing(3),
      bottom: theme.spacing(3)
    }
  }))();

  return <>
    <Zoom in={$type === 'statusPage'}>
      <Fab className={classes.fab}>
        <Icon path={mdiTableEdit} size={1} />
      </Fab>
    </Zoom>
    <Zoom in={$type === 'fetchPage'}>
      <Fab className={classes.fab} onClick={loadFetchDialog}>
        <Icon path={mdiPlus} size={1} />
      </Fab>
    </Zoom>
    <Zoom in={$type === 'parsePage'}>
      <Fab className={classes.fab} onClick={loadParseDialog}>
        <Icon path={mdiPlus} size={1} />
      </Fab>
    </Zoom>
  </>;
}