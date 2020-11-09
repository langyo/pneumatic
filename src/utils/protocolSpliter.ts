export function protocolSpliter(str: string): {
  platform: string,
  major: string,
  minor: string
} {
  const platform = str.indexOf('>') >= 0
    ? str.substr(0, str.indexOf('>')).trim()
    : str;
  const major = str.indexOf('>') >= 0
    ? str.indexOf(':') > str.indexOf('>')
      ? str.substr(str.indexOf('>') + 1, str.indexOf(':')).trim()
      : str.substr(str.indexOf('>')).trim()
    : '';
  const minor = str.indexOf('>') >= 0 && str.indexOf(':') > str.indexOf('>')
    ? str.substr(str.indexOf(':') + 1).trim() : '';

  // Verify the platform.
  if ([
    'js.browser', 'js.node', 'js.electron', 'js.cordova', 'js.flutter'
  ].indexOf(platform) < 0) {
    throw new Error(`Unknown platform '${platform}'!`);
  }

  return { platform, major, minor };
}