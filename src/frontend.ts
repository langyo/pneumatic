import { IRuntimeObject } from 'nickelcat';
import {
  protocolSpliter,
  IProtocol,
  webpackCompiler
} from './utils';

export async function protocolParser(protocol: string): Promise<IProtocol> {
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
let compiledSourceCodeMap: { [route: string]: string } = {};
let compiledStaticSourceCode: string[] = [];
let compiledStaticSourceCodeMap: string[] = [];

export async function componentParser(
  component: IRuntimeObject,
  path: string,
  filePath: string
) {
  switch (component.type) {
    case 'preset.renderReactComponent':
      const { code, sourceMap } = await webpackCompiler(`
window.__nickelcat_action_preset.modelManager.storageComponent(
  ${path},
  require(${filePath}).component.args.func
);
      `, 'web', {
        externals: {
          'react': '__react',
          'react-dom': '__react_dom',
          'nickelcat': '__nickelcat',
          'nickelcat-action-preset': '__nickelcat_action_preset',
          'nickelcat-action-routes': '__nickelcat_action_routes'
        }
      });
      compiledSourceCode[path] = code;
      compiledSourceCodeMap[path] = sourceMap;
      break;
    case 'preset.renderVueComponent':
    case 'preset.renderEjsComponent':
    case 'preset.renderStaticHtml':
    default:
      throw new Error(`Unsupport component type '${component.type}'`);
  }
}

export async function initParser() {

}

export async function entry(ref: any, path: string, filePath: string) {
  if (typeof ref.protocol !== 'undefined') {
    // When it has the export 'protocol', it will be parsed as a component.
    if (typeof ref.protocol !== 'string') {
      throw new Error('You must use a string as the protocol identifier.')
    }
    const protocol = await protocolParser(ref.protocol);

    if (typeof ref.component === 'undefined') {
      throw new Error(
        'When exporting a protocol, you must export a component at the same time'
      );
    }
    if (protocol.major === 'component') {
      componentParser(ref.component, path, filePath);
    }
  } else {
    // It will be parsed as some static action streams.

  }
}
