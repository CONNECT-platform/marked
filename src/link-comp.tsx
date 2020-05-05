import { RendererLike } from '@connectv/html';

import { ComponentMap } from './comp-map';
import { LinkOptions } from './inline';


export function linkedComponents(map: ComponentMap) {
  return function(options: LinkOptions, renderer: RendererLike<unknown, unknown>, content: unknown) {
    if (options && options.href && options.href.startsWith(':')) {
      const name = options.href.substr(1);
      if (name in map) {
        const Comp = map[name];
        const props = (options.title || '').split(',').reduce((props, part) => {
          const [key, value] = part.split('=');
          if (!!key && !!value)
            props[key.trim()] = value.trim();
          return props;
        }, {} as {[prop: string]: string});

        return <Comp {...props}>{content}</Comp>;
      }
      else {
        throw new Error('Unrecognized Linked Component:: ' + name);
      }
    }
    else return <a {...options}>{content}</a>
  }
}