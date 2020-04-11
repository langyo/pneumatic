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
      <DialogTitle>{"爬取配置"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          爬取配置方案目前暂只支持一个普通的 URL，未来更新会加入对带参数动态生成的多份 URL 提供支持。
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
          label='地址'
        />
        <TextField
          autoFocus
          fullWidth
          disabled
          variant='outlined'
          label='解析数据元列表'
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