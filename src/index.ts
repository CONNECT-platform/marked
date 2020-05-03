import { RendererLike } from '@connectv/html';
import { lexer } from 'marked';

import { PartialOptions, Options } from './options';
import { Parser } from './parser';


export function marked<R=unknown, T=unknown>(markdown: string, options?: PartialOptions<R, T>) {
  const parser = new Parser(options);
  const tokens = lexer(markdown);

  return function(renderer: RendererLike<R, T>) {
    return parser.parse(tokens, renderer);
  }
}

export { PartialOptions, Options };
export { quotedComponents } from './quote-comp';
export { linkedComponents } from './link-comp';
export { ComponentMap } from './comp-map';
