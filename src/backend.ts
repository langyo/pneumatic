import { Writable } from 'stream';
import * as reporter from './utils/reporter';
import {
  protocolSpliter,
  IProtocol,
  allocatePriority,
  exprVerify,
  splitThroughRegex,
  vmLoader
} from './utils';

export async function protocolParser(
  protocol: string, path: string
): Promise<IProtocol> {
  const { platform, major, minor } = protocolSpliter(protocol);

  switch (platform) {
    case 'js.node':
      switch (major) {
        case 'http':
          if (!/^[0-9]+$/.test(minor)) {
            throw new Error('The port must be a number!');
          }
          break;
        default:
          throw new Error(`Unsupport protocol '${major}'.`);
      }
      break;
    default:
      throw new Error(`Unsupport platform '${platform}'!`);
  }

  return { platform, major, minor };
}

// Routes that have been prioritized
export let routePriority: { [route: string]: number } = {
  $head: 1,
  $begin: 1,
  $foot: -1,
  $feet: -1,
  $end: -1,
  $static: 10000,
  $staticFileService: 10000,
  $page: 30000,
  $pageService: 30000,
  $errPage: -10000
};
// Routes that have not been given available priority.
export let routePriorityCache: { [route: string]: string } = {};

// Returns true when a priority is successfully assigned.
export function pirorityParser(
  expr: string,
  sourceRoutePath: string
): boolean {
  // First split it into several determinants separated by '&'.
  const subExpr = splitThroughRegex('&', expr).map(n => n.trim());

  let matchPriority = 0;
  // Parse each expression.
  for (const expr of subExpr) {
    // Recognize the operator corresponding to the first character.
    const op = ['>', '<', '='].indexOf(expr[0]) >= 0 ? expr[0] : '=';

    // When the operator is an equal operator, no wildcards or regular
    // expressions can appear.
    if (op === '=' && ['*', '?', '/'].indexOf(expr) >= 0) {
      throw new Error('No wildcards or regular expressions can appear.');
    }

    const paths = splitThroughRegex(
      '.', ['>', '<', '='].indexOf(expr[0]) >= 0 ? expr.substr(1).trim() : expr
    );

    // Cannot have more than one "**".
    if (
      paths.indexOf('**') >= 0 &&
      paths.indexOf('**') !== paths.lastIndexOf('**')
    ) {
      throw new Error('Cannot have more than one "**".');
    }

    // Handle the case that all wildcards are universal.
    if (paths.length === 1 && (paths[0] === '*' || paths[0] === '**')) {
      routePriority[sourceRoutePath] = op === '>' ? -1 : 1;
      return true;
    }

    // Handle the case where the operator is an equal operator.
    for (const route of Object.keys(routePriority)) {
      if (expr.substr(1).trim() === route) {
        routePriority[sourceRoutePath] = routePriority[route];
        return true;
      }
      // At present, no registered route can match it.
      routePriorityCache[sourceRoutePath] = expr;
      return false;
    }

    // Handle the other cases.
    let hasMatched = false;
    for (const route of Object.keys(routePriority)) {
      const otherPaths = route.split('.');

      if (paths.indexOf('**') >= 0) {
        // Scan from the left and right sides and ignore the middle part.
        const left = paths.splice(0, paths.indexOf('**'));
        const right = paths.splice(paths.indexOf('**') + 1);

        let hasSuccess = true;
        for (let i = 0; i < left.length; ++i) {
          if (!exprVerify(left[i], otherPaths[i])) {
            hasSuccess = false;
            break;
          }
        }
        if (hasSuccess) {
          for (
            let i = otherPaths.length - 1;
            i >= otherPaths.length - right.length;
            --i
          ) {
            if (!exprVerify(right[i], otherPaths[i])) {
              hasSuccess = false;
              break;
            }
          }
        }

        if (hasSuccess) {
          hasMatched = true;
          matchPriority = allocatePriority(
            op as any, matchPriority, routePriority[route]
          );
        }
      } else {
        // Check one by one in order.
        if (otherPaths.length !== paths.length) { continue; }

        let hasSuccess = true;
        for (let i = 0; i < paths.length; ++i) {
          if (!exprVerify(paths[i], otherPaths[i])) {
            hasSuccess = false;
            break;
          }
        }
        if (hasSuccess) {
          hasMatched = true;
          matchPriority = allocatePriority(
            op as any, matchPriority, routePriority[route]
          );
        }
      }
    }
    if (!hasMatched) {
      // There is no matching result, which is put in the cache list to wait
      // for the newly registered route.
      routePriorityCache[sourceRoutePath] = expr;
      return false;
    }
  }

  routePriority[sourceRoutePath] = matchPriority;

  // Handle the remaining routes in the cache.
  for (const path of Object.keys(routePriorityCache)) {
    if (pirorityParser(routePriorityCache[path], path)) {
      delete routePriorityCache[path];
    }
  }

  return true;
}

export function serviceParser() {

}

export let routeTasks: {
  [id: number]: {
    match: ({ path: string, query: { [key: string]: string } }),
    call: (stream: Writable) => Promise<void>
  }
} = {};
