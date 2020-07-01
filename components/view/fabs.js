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

export default ({
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
    <Zoom in={$type === 'fetchPage'} onClick={loadFetchDialog}>
      <Fab className={classes.fab}>
        <Icon path={mdiPlus} size={1} />
      </Fab>
    </Zoom>
    <Zoom in={$type === 'parsePage'} onClick={loadParseDialog}>
      <Fab className={classes.fab}>
        <Icon path={mdiPlus} size={1} />
      </Fab>
    </Zoom>
  </>;
}