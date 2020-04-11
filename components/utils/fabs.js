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
  pageType
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
    <Zoom in={pageType === 'fetch'}>
      <Fab className={classes.fab}>
        <Icon path={mdiPlus} size={1} />
      </Fab>
    </Zoom>
    <Zoom in={pageType === 'parse'}>
      <Fab className={classes.fab}>
        <Icon path={mdiPlus} size={1} />
      </Fab>
    </Zoom>
  </>;
}