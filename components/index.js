import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Hidden
} from "@material-ui/core";

import Icon from "@mdi/react";
import { mdiMenu } from "@mdi/js";

import DrawerInside from "./drawer";
import Overview from "./overview";
import Task from "./task";

const drawerWidth = 240;

export default () => {
  const classes = makeStyles(theme => ({
    root: {
      display: "flex"
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0
    },
    drawerPaper: {
      width: drawerWidth
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

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState("overview");

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Hidden smUp>
            <IconButton
              className={classes.fabMenu}
              onClick={() => setDrawerOpen(!drawerOpen)}
            >
              <Icon path={mdiMenu} size={1} color="#fff" />
            </IconButton>
          </Hidden>
          <Typography variant="h6" noWrap>
            Pneumatic Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Hidden xsDown>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <DrawerInside
            page={page}
            setPage={v => (setPage(v), setDrawerOpen(false))}
          />
        </Drawer>
      </Hidden>
      <Hidden smUp>
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper
          }}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <DrawerInside
            page={page}
            setPage={v => (setPage(v), setDrawerOpen(false))}
          />
        </Drawer>
      </Hidden>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {page === "overview" && <Overview />}
        {page === "task" && <Task />}
      </main>
    </div>
  );
};