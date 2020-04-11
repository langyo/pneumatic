import React, { useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem
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

  const [tableType, setTableType] = useState('line-chart')

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={destory}
    >
      <DialogTitle>{"解析配置"}</DialogTitle>
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
          select
          fullWidth
          label="统计生成类型"
          variant="outlined"
          value={tableType}
          onChange={e => setTableType(e.target.value)}
        >
          <MenuItem value='line-chart'>
            曲线统计图
          </MenuItem>
          <MenuItem value='table'>
            表格
          </MenuItem>
        </TextField>
        {tableType === 'line-chart' && <>
          <TextField
            className={classes.field}
            fullWidth
            variant='outlined'
            label='使用的数据元 X'
          />
          <TextField
            className={classes.field}
            fullWidth
            variant='outlined'
            label='使用的数据元 Y'
          />
        </>}
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