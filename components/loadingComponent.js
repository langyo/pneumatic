import { renderToString } from 'react';

import {
  Paper,
  Typography,
  CircularProgress
} from '@material-ui/core';
import {
  ServerStyleSheets,
  ThemeProvider,
  createMuiTheme,
  makeStyles
} from '@material-ui/styles';

const Component = () => {
  const classes = makeStyles(() => ({
    root: {
      width: 300,
      height: 100,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 'auto',
      marginBottom: 'auto'
    },
    center: {
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }))();

  return <Paper className={classes.root}>
    <CircularProgress className={classes.center}/>
    <Typography className={classes.center} variant='body1'>{"LOADING"}</Typography>
  </Paper>;
}; 

const theme = createMuiTheme({
  palette: {
    primary: { main: '#3399cc' },
    secondary: { main: '#66ccff' }
  }
});

const sheets = new ServerStyleSheets();
const html = sheets.collect(<ThemeProvider theme={theme}>
  <Component />
</ThemeProvider>);
const css = sheets.toString();

export const loadHtml = () => html;
export const loadCss = () => css;

