import { blue, red, green, yellow, white } from 'chalk';
import { log, registerCallback, ILog } from 'nickelcat/logManager';

registerCallback((log: ILog) => {
  console.log(
    white.bold((new Date(log.time)).toLocaleString()),
    blue(log.eventType.toUpperCase()),
    green(log.path),
    white(log.extraInfo)
  );
});

export function parseEnterReport(
  type: 'frontend' | 'backend' | 'static',
  path: string
) {
  log('info', 'Parsing', type, path);
}

export function parseCrashReport(
  type: 'frontend' | 'backend' | 'static',
  path: string, reason: string
) {
  log('error', type, path, reason);
}

export function parseDoneReport(
  type: 'frontend' | 'backend' | 'static',
  path: string
) {
  log('info', 'Parsed', type, path);
}

export function serverEnterReport(ip: string, url: string) {
  log('info', 'New connection', ip, url);
}

export function serverCrashReport(ip: string, reason: string) {
  log('error', 'Connection crashed', ip, reason);
}
