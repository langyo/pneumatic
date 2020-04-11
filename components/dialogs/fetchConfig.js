import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment
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
    field: {
      marginTop: theme.spacing(2)
    }
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
        <TextField
          className={classes.field}
          autoFocus
          fullWidth
          variant='outlined'
          label='任务名'
        />
        <TextField
          className={classes.field}
          autoFocus
          fullWidth
          variant='outlined'
          label='URL 地址模板'
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