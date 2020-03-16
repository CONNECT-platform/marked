import { RendererLike } from '@connectv/html';
import { Token, InlineLexer, TextRenderer, Slugger, TokensList } from 'marked';

import { unescape } from './util/unescape';
import { Options } from './options';


export class Parser<R=any, T=any> {
  tokens: Token[]  = [];
  token: Token;
  slugger = new Slugger();

  inline: InlineLexer;
  inlineText: InlineLexer;
  renderer: RendererLike<R, T>;


  constructor(readonly options: Options<R, T>) {}

  parse(tokens: TokensList, renderer: RendererLike<any, any>) {
    this.renderer = renderer;
    this.inline = new InlineLexer(tokens.links as any);
    this.inlineText = new InlineLexer(tokens.links as any, {
      renderer: new TextRenderer() as any
    });

    this.tokens = tokens.reverse();
    const res = <fragment/>;
    while(this.next())
      renderer.render(this.tok()).on(res);

    return res;
  }

  next() {
    const _next = this.tokens.pop();
    if (_next) this.token = _next;
    return _next;
  }

  peek() {
    return this.tokens[this.tokens.length - 1];
  }

  parseText() {
    const renderer = this.renderer;
    let body = (this.token as any).text || '';

    while(this.peek().type === 'text')
      body += '\n' + (this.next() as any).text;
    
    return <fragment>{this.inline.output(body)}</fragment>
  }

  tok() {
    const renderer = this.renderer;

    switch(this.token.type) {
      case 'space': return <fragment/>;
      case 'hr': return <this.options.Hr/>;
      case 'heading': 
        return <this.options.Heading 
          depth={this.token.depth}
          slug={this.slugger.slug(unescape(this.inlineText.output(this.token.text)))}>
          {this.inline.output(this.token.text)}
        </this.options.Heading>
      default:
        throw new Error();
    }
  }
}
