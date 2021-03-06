import { bold, green, yellow, red, blue, bgWhite, bgYellow } from 'chalk';

type ILogLevel = 'info' | 'debug' | 'warn' | 'error';
const logLevelMap = {
  info: bgWhite(green('INFO')),
  debug: bgWhite(blue('DEBUG')),
  warn: bgWhite(yellow('WARN')),
  error: bgYellow(red('ERROR'))
}

export function log(type: ILogLevel, message: string | any, ...extraMessage: string[] | any[]) {
  if (type === 'warn' || type === 'error') {
    console.error(
      bold((new Date()).toLocaleString()),
      logLevelMap[type],
      type === 'error' ? red(message) : message,
      extraMessage.length > 0 ? blue(extraMessage.join(' ')) : ''
    );
  } else {
    console.log(
      bold((new Date()).toLocaleString()),
      logLevelMap[type],
      message,
      extraMessage.length > 0 ? blue(extraMessage.join(' ')) : ''
    );
  }
}