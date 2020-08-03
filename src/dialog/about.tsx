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

import {
  setState,
  destoryModel,
  wait
} from 'nickelcat-action-preset';

export const controller = {
  $init: () => ({
    isOpen: true
  }),

  destory: [
    setState({ isOpen: false }),
    wait(1000),
    destoryModel((payload, { modelType, modelID }) => ({ type: modelType, id: modelID }))
  ]
};

export const component = ({
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
      <DialogTitle>{"关于"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {`该作品由伊欧(@langyo)开发，是 NickelCat Framework 的示例应用。
            源代码以 Apache-2.0 协议开源。
            版本 ${require('../../package.json').version}。`}
        </DialogContentText>
        <Button onClick={() => window.open('https://github.com/langyo/pneumatic')}>访问源代码仓库</Button>
        <Button onClick={() => window.open('https://github.com/langyo')}>访问作者 Github 主页</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={destory} color="primary" autoFocus>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}