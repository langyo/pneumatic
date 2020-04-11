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
  pageType,

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
    <Zoom in={pageType === 'status'}>
      <Fab className={classes.fab}>
        <Icon path={mdiTableEdit} size={1} />
      </Fab>
    </Zoom>
    <Zoom in={pageType === 'fetch'} onClick={loadFetchDialog}>
      <Fab className={classes.fab}>
        <Icon path={mdiPlus} size={1} />
      </Fab>
    </Zoom>
    <Zoom in={pageType === 'parse'} onClick={loadParseDialog}>
      <Fab className={classes.fab}>
        <Icon path={mdiPlus} size={1} />
      </Fab>
    </Zoom>
  </>;
}