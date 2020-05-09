import { RendererLike } from '@connectv/html';

import { ComponentMap } from './comp-map';
import { LinkOptions } from './inline';
import { extractCompProps } from './util/extract-comp-props';


export function linkedComponents(map: ComponentMap) {
  return function(options: LinkOptions, renderer: RendererLike<unknown, unknown>, content: unknown) {
    if (options && options.href && options.href.startsWith(':')) {
      const name = options.href.substr(1);
      if (name in map) {
        const Comp = map[name];
        const props = extractCompProps(options.title || '');

        return <Comp {...props}>{content}</Comp>;
      }
      else {
        throw new Error('Unrecognized Linked Component:: ' + name);
      }
    }
    else return <a {...options}>{content}</a>
  }
}