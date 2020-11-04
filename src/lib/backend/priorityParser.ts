function matchName(expr: string, str: string): boolean {
  // Expression does not allow two consecutive '*'.
  if (expr.indexOf('**') >= 0) {
    throw new Error('Expression does not allow two consecutive \'*\'.');
  }

  const subExpr = expr.split('*');
  let pos = 0;
  for (const expr of subExpr) {
    if (expr === '') { continue; }
    while (true) {
      pos = str.indexOf(expr[0], pos);
      if (pos === -1) return false;

      let hasMatched = true;
      for (let i = 0; i < expr.length; ++i, ++pos) {
        if (expr[i] === '?') { continue; }
        else if (expr[i] !== str[pos]) {
          hasMatched = false;
          break;
        }
      }
      if (hasMatched) { break; }
    }
  }
  return true;
}

function splitThroughRegex(expr: string, str: string): string[] {
  let ret: string[] = [];
  let lastPos = 0, pos = Math.min(str.indexOf(expr), str.indexOf('/'));

  while(pos > -1) {
    if (str[pos] === expr) {
      ret.push(str.substr(lastPos, pos));
      pos += expr.length;
      lastPos = pos;
    } else {
      for (
        pos = str.indexOf('/', pos + 1);
        str[pos - 1] === '\\';
        pos = str.indexOf('/', pos + 1)
      ) {
        if (pos < 0) {
          throw new Error('Incomplete regular expressions.');
        }
        pos += 1;
      }
    }
    pos = Math.min(str.indexOf(expr, pos), str.indexOf('/', pos));
  }
  ret.push(str.substr(lastPos));
  return ret;
}

function compareLevel(
  op: '>' | '<', oldLevel: number, newLevel: number
): number {
  if (op === '>') {
    if (oldLevel >= 0 && newLevel > 0 || oldLevel < 0 && newLevel < 0) {
      return Math.max(oldLevel, newLevel);
    } else if (oldLevel >= 0 && newLevel < 0) {
      return newLevel;
    } else {
      // oldLevel < 0 && newLevel >= 0
      return oldLevel;
    }
  } else {
    // op === '<'
    if (oldLevel >= 0 && newLevel > 0 || oldLevel < 0 && newLevel < 0) {
      return Math.min(oldLevel, newLevel);
    } else if (oldLevel >= 0 && newLevel < 0) {
      return oldLevel;
    } else {
      // oldLevel < 0 && newLevel >= 0
      return newLevel;
    }
  }
}

export function levelExprParser(
  routePriorityMap: { [route: string]: number },
  sourceRoutePath: string,
  expr: string
): number {
  // First split it into several determinants separated by '&'.
  const subExpr = splitThroughRegex('&', expr).map(n => n.trim());
  
  let matchPriority = 0;
  // Parse each expression.
  for(const expr of subExpr) {
    // Recognize the operator corresponding to the first character.
    if (['>', '<', '=', '^', '~'].indexOf(expr[0]) < 0) {
      throw new Error('The first character must be a comparison operator.');
    }
    const op = expr[0] === '^' ? '>' : expr[0] === '~' ? '=' : expr[0];

    // When the operator is an equal operator, no wildcards or regular
    // expressions can appear.
    if (op === '=' && ['*', '?', '/'].indexOf(expr) >= 0) {
      throw new Error('No wildcards or regular expressions can appear.');
    }

    const paths = splitThroughRegex('.', expr.substr(1).trim());

    // Cannot have more than one "**".
    if (
      paths.indexOf('**') >= 0 &&
      paths.indexOf('**') !== paths.lastIndexOf('**')
    ) {
      throw new Error('Cannot have more than one "**".');
    }

    // Handle the case that all wildcards are universal.
    if (paths.length === 1 && (paths[0] === '*' || paths[0] === '**')) {
      return op === '>' ? -1 : 1;
    }

    // Handle the case where the operator is an equal operator.
    for (const route of Object.keys(routePriorityMap)) {
      if (expr.substr(1).trim() === route) {
        return routePriorityMap[route];
      }
      // At present, no registered route can match it. The error is
      // temporarily thrown, and the cache mechanism will be added later.
      throw new Error('[TODO] Features not implemented.');
    }

    // Handle the other cases.
    let hasMatched = false;
    for (const route of Object.keys(routePriorityMap)) {
      const otherPaths = route.split('.');

      if (paths.indexOf('**') >= 0) {
        // Scan from the left and right sides and ignore the middle part.
        const left = paths.splice(0, paths.indexOf('**'));
        const right = paths.splice(paths.indexOf('**') + 1);

        let hasSuccess = true;
        for (let i = 0; i < left.length; ++i) {
          if (!matchName(left[i], otherPaths[i])) {
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
            if (!matchName(right[i], otherPaths[i])) {
              hasSuccess = false;
              break;
            }
          }
        }

        if (hasSuccess) {
          hasMatched = true;
          matchPriority = compareLevel(
            op as any, matchPriority, routePriorityMap[route]
          );
        }
      } else {
        // Check one by one in order.
        if (otherPaths.length !== paths.length) { continue; }

        let hasSuccess = true;
        for (let i = 0; i < paths.length; ++i) {
          if (!matchName(paths[i], otherPaths[i])) {
            hasSuccess = false;
            break;
          }
        }
        if (hasSuccess) {
          hasMatched = true;
          matchPriority = compareLevel(
            op as any, matchPriority, routePriorityMap[route]
          );
        }
      }
    }
    if (!hasMatched) {
      // There is no matching result, which is put in the cache list to wait
      // for the newly registered route.
      throw new Error('[TODO] Features not implemented.');
    }
  }

  return matchPriority;
}
