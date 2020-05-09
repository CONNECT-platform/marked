const reg = /^\s*(?<key>(?:[^\"\'\`\=]*(?:\"[^\"]*\")?(?:\'[^\']*\')?(?:\`[^\`]*\`)?)+)\s*\=\s*(?<value>(?:[^\"\'\`\=]*(?:\"[^\"]*\")?(?:\'[^\']*\')?(?:\`[^\`]*\`)?)+)\s*$/


function normalize(x: string) {
  x = x.trim();
  if (
    (x.startsWith('"') && x.endsWith('"')) ||
    (x.startsWith('`') && x.endsWith('`')) ||
    (x.startsWith("'") && x.endsWith("'"))
  ) x = x.substr(1, x.length - 2);
  return x;
}


function commaSplit(x: string) {
  let res: string[] = [];
  let curr: string | undefined = undefined;
  let strmark: string | undefined = undefined;
  for (let c of x) {
    if (strmark) {
      if (c === strmark) {
        (curr as any) += c;
        strmark = undefined;
      } else (curr as any) += c;
    } else if (c === '"' || c === '`' || c === "'") {
      strmark = c;
      curr = curr || '';
      curr += c;
    } else if (c === ',') {
      res.push(curr || '');
      curr = undefined;
    } else {
      curr = curr || '';
      curr += c;
    }
  }

  if (curr) res.push(curr);
  return res;
}


export function extractCompProps(propString: string) {
  const props = commaSplit(propString).reduce((props, part) => {
    const match = reg.exec(part);
    if (match && match.groups) {
      let { key, value } = match.groups;
      if (!!key && !!value) {
        props[normalize(key)] = normalize(value);
      }
    }
    return props;
  }, {} as {[prop: string]: string});

  return props;
}