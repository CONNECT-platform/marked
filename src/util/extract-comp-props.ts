function normalize(x: string) {
  x = x.trim();
  if (
    (x.startsWith('"') && x.endsWith('"')) ||
    (x.startsWith('`') && x.endsWith('`')) ||
    (x.startsWith("'") && x.endsWith("'"))
  ) x = x.substr(1, x.length - 2);
  return x.trim();
}


export function extractCompProps(propString: string) {
  const props: {[key: string]: string} = {};
  let mode: ('key' | 'value') = 'key';
  let curr: string | undefined = undefined;
  let currkey: string | undefined = undefined;
  let strmark: string | undefined = undefined;

  for (let c of propString) {
    if (strmark) {
      if (c === strmark) {
        (curr as any) += c;
        strmark = undefined;
      } else (curr as any) += c;
    } else {
      if (c === '"' || c === '`' || c === "'") {
        strmark = c;
        curr = curr || ''; curr += c;
      } else if (c === '=') {
        if (mode === 'key') {
          currkey = curr; curr = undefined;
          mode = 'value';
        } else { curr = curr || ''; curr += c; }
      } else if (c === ',') {
        if (mode === 'value') {
          props[normalize(currkey || '')] = normalize(curr || '');
          curr = undefined; mode = 'key';
        } else { curr = curr || ''; curr += c; }
      } else { curr = curr || ''; curr += c; }
    }
  }

  if (currkey) {
    props[normalize(currkey)] = normalize(curr || '');
  }

  return props;
}
