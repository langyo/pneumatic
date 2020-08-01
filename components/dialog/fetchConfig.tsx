import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
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
    setData(({ }) => ({
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
  const [url, setUrl] = useState('');
  const [timeOut, setTimeOut] = useState(30);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={destory}
    >
      <DialogTitle>{"爬取配置"}</DialogTitle>
      <DialogContent>
        <TextField
          className={classes.field}
          autoFocus
          fullWidth
          variant='outlined'
          label='任务名'
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
        />
        <TextField
          className={classes.field}
          autoFocus
          fullWidth
          variant='outlined'
          label='URL 地址模板'
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <TextField
          className={classes.field}
          fullWidth
          type='number'
          variant='outlined'
          label='间隔时间'
          InputProps={{
            endAdornment: <InputAdornment position='end'>{'分钟'}</InputAdornment>
          }}
          value={timeOut}
          onChange={e => setTimeOut(+e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={destory} color="primary">
          取消
        </Button>
        <Button onClick={submit} color="primary" autoFocus>
          确认
        </Button>
      </DialogActions>
      <Backdrop open={isFetching} className={classes.backdrop}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </Dialog>
  );
}