import portUsed from 'port-used';
import chalk from 'chalk';

export default async () => {
  if (process.env.port) {
    // Check if the arugment is a number.
    if (!(0 <= (+process.env.port) && (+process.env.port) <= 65535)) {
      console.log(chalk.red(`You must provide an available port number!`));
      console.log(chalk.red(`Please check the command arguments and restart this server.`));
      process.exit();
    }
    // Check if this port has been used.
    if (await portUsed.check(+process.env.port)) {
      console.log(chalk.yellow(`The port ${process.env.port} has been used, you must close the process which using this port.`));
      console.log(chalk.yellow('You can click Ctrl + C to kill this process, and provide another port to restart.'));
      console.log(chalk.yellow('Otherwise, it will start after you close the process which using this port.'));
      await portUsed.waitUntilFree({ port: process.env.port });
    }
    return process.env.port;
  } else {
    // Scanning the ports.
    for (let port of [80, 8080, 8000, 8888, 3000]) {
      if (portUsed.check(port)) return port;
    }
    for (let port = 3001; port <= 65535; ++port) {
      if (portUsed.check(port)) return port;
    }
    console.log(chalk.red('Are you kidding me? There are not any ports we can use!'));
    console.log(chalk.red('Maybe your environment has been banned the permission about the network ports?'));
    process.exit(1);
  }
};
