import {
  protocolSpliter,
  IProtocol,
  webpackCompiler
} from './utils';

export async function protocolParser(
  protocol: string, path: string
): Promise<IProtocol> {
  const { platform, major, minor } = protocolSpliter(protocol);

  switch (platform) {
    case 'js.browser':
      switch (major) {
        case 'component':
          break;
        case 'border':
          // TODO - Write the border component parser.
        default:
          throw new Error(`Unsupport protocol '${major}'.`);
      }
      break;
    default:
      throw new Error(`Unsupport platform '${platform}'!`);
  }

  return { platform, major, minor };
}

let compiledSourceCode: { [route: string]: string } = {};
let compiledtaticSourceCode: string[] = [];

export function componentParser() {

}

export function initParser() {

}
