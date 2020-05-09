import { RendererLike } from '@connectv/html';

import { ComponentMap } from './comp-map';
import { extractCompProps } from './util/extract-comp-props';


export function quotedComponents(map: ComponentMap) {
  return function(_: {}, renderer: RendererLike<unknown, unknown>, content: unknown) {
    let ref = <marker>{content}</marker>;
    if (ref.childNodes[0].textContent?.startsWith(':')) {
      const parts = ref.childNodes[0].textContent.substr(1).split(' ');
      const name = parts[0];

      if (name in map) {
        const Comp = map[name];
        const props = extractCompProps(parts.slice(1).join(' '));
        const children: Node[] = [];
        ref.childNodes.forEach((child, index) => { if (index >= 1) children.push(child); });

        return renderer.create(Comp, props, children);
      }
      else {
        throw new Error('Unrecognized Quoted Component:: ' + name);
      }
    }
    else {
      const children: Node[] = [];
      ref.childNodes.forEach(child => children.push(child));
      return <blockquote>{children}</blockquote>;
    }
  }
}
