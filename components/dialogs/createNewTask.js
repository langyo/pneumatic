import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import makeStyles from '@material-ui/core/styles/makeStyles';

export default ({
  isOpen,

  destory
}) => {
  const theme = useTheme();
  const classes = makeStyles(theme => ({

  }))();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={destory}
    >
      <DialogTitle>{"创建新任务组"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          在具体指定爬取与解析方案之前，您只需要先为整个任务组设置一个标识名。
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          variant='outlined'
          label='标识名'
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={destory} color="primary">
          取消
        </Button>
        <Button onClick={destory} color="primary" autoFocus>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}