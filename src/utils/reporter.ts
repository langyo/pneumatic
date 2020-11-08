import { blue, red, green, bgYellow, yellow, white } from 'chalk';

export function parseEnterReport(
  type: 'frontend' | 'backend' | 'static',
  path: string
) {
  console.log(
    bgYellow.black((new Date()).toLocaleString()),
    green('Parsing'),
    blue(`${type} - ${path}`)
  );
}

export function parseCrashReport(
  type: 'frontend' | 'backend' | 'static',
  path: string, reason: string
) {
  console.log(
    bgYellow.black((new Date()).toLocaleString()),
    red('Error when parsing'),
    blue(`${type} - ${path}`),
    white('-'),
    yellow(reason)
  );
}

export function parseDoneReport(
  type: 'frontend' | 'backend' | 'static',
  path: string
) {
  console.log(
    bgYellow.black((new Date()).toLocaleString()),
    green('Parsed'),
    blue(`${type} - ${path}`)
  );
}

export function serverEnterReport(ip: string, url: string) {
  console.log(
    bgYellow.black((new Date()).toLocaleString()),
    blue(ip),
    white(url)
  );
}

export function serverCrashReport(ip: string, reason: string) {
  console.log(
    bgYellow.black((new Date()).toLocaleString()),
    blue(ip),
    red('Error'),
    white(reason)
  );
}
