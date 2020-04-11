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
      <DialogTitle>{"解析配置"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          解析配置暂时只支持将数据映射到二元折线统计表，未来会提供更多的支持。
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          variant='outlined'
          label='任务名'
        />
        <TextField
          autoFocus
          fullWidth
          variant='outlined'
          label='使用的数据元 X'
        />
        <TextField
          autoFocus
          fullWidth
          variant='outlined'
          label='使用的数据元 Y'
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