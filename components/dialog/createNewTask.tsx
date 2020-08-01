import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Backdrop,
  CircularProgress
} from '@material-ui/core';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import makeStyles from '@material-ui/core/styles/makeStyles';

import {
  setState,
  setData,
  destoryModel,
  wait
} from 'nickelcat-action-preset';

export const controller = {
  $init: () => ({
    isOpen: true,
    isFetching: false
  }),

  submit: [
    setState({ isFetching: true }),
    wait(1000),
    setData(({ taskName }) => ({
      tasks: {
        [taskName]: {
          status: 'sleep',
          fetch: [],
          parse: [],
          data: {}
        }
      }
    })),
    setState({ isFetching: false, isOpen: false }),
    wait(1000),
    destoryModel((payload, { modelType, modelID }) => ({ type: modelType, id: modelID }))
  ],

  destory: [
    setState({ isOpen: false }),
    wait(1000),
    destoryModel((payload, { modelType, modelID }) => ({ type: modelType, id: modelID }))
  ]
};

export const component = ({
  isOpen,
  isFetching,

  submit,
  destory
}) => {
  const theme = useTheme();
  const classes = makeStyles(theme => ({
    field: {
      marginTop: theme.spacing(2)
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff'
    }
  }))();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [taskName, setTaskName] = useState('');

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={destory}
    >
      <DialogTitle>{"创建新任务组"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          在具体指定一批爬取与解析方案之前，您只需要先为整个任务组设置一个标识名。
        </DialogContentText>
        <TextField
          className={classes.field}
          autoFocus
          fullWidth
          variant='outlined'
          label='标识名'
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={destory} color="primary">
          取消
        </Button>
        <Button onClick={() => submit({ taskName })} color="primary" autoFocus>
          确认
        </Button>
      </DialogActions>
      <Backdrop open={isFetching} className={classes.backdrop}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Dialog>
  );
}