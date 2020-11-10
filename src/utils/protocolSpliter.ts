import { parseCrashReport } from './reporter';

export interface IProtocol {
  platform: string,
  major: string,
  minor: string
};

export function protocolSpliter(
  protocol: string
): IProtocol {
  const platform = protocol.indexOf('>') >= 0
    ? protocol.substr(0, protocol.indexOf('>')).trim()
    : protocol;
  const major = protocol.indexOf('>') >= 0
    ? protocol.indexOf(':') > protocol.indexOf('>')
      ? protocol.substr(protocol.indexOf('>') + 1, protocol.indexOf(':')).trim()
      : protocol.substr(protocol.indexOf('>')).trim()
    : '';
  const minor = protocol.indexOf('>') >= 0 && protocol.indexOf(':') > protocol.indexOf('>')
    ? protocol.substr(protocol.indexOf(':') + 1).trim() : '';

  return { platform, major, minor };
}