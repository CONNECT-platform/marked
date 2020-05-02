import { RendererLike } from '@connectv/html';
import { lexer } from 'marked';

import { PartialOptions, Options } from './options';
import { Parser } from './parser';
import { InlineCompProcessor } from './inline-comp';


export function marked<R=unknown, T=unknown>(markdown: string, options?: PartialOptions<R, T>) {
  const parser = new Parser(options);
  const tokens = lexer(markdown);

  return function(renderer: RendererLike<R, T>) {
    const proc = new InlineCompProcessor(renderer, options?.inline || {});
    return proc.process(parser.parse(tokens, renderer));
  }
}

export { PartialOptions, Options };
export { quotedComponents } from './quote-comp';
