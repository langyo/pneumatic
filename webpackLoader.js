import webpack from 'webpack';
import chalk from 'chalk';

webpack({
  
}, (err, status) => {
  if(err || status.hasErrors()) throw new Error(err || status.hasErrors());

  const now = (new Date()).toLocaleTimeString();
  console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Webpack has been compiled the static file.`);
});
