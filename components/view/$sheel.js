import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Hidden
} from "@material-ui/core";

import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

export default ({
  setDrawerOpen
}) => {
  const classes = makeStyles(theme => ({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    fabMenu: {
      marginRight: theme.spacing(2)
    },
    toolbar: theme.mixins.toolbar
  }))();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Hidden smUp>
            <IconButton
              className={classes.fabMenu}
              onClick={setDrawerOpen}
            >
              <Icon path={mdiMenu} size={1} color="#fff" />
            </IconButton>
          </Hidden>
          <Typography variant="h6" noWrap>
            Pneumatic Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
  );
};
