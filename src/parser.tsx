import { RendererLike } from '@connectv/html';
import { Token, InlineLexer, TextRenderer, Slugger, TokensList } from 'marked';

import { PartialOptions, Options } from './options';
import { InlineProcessor } from './inline';
import { fill } from './defaults';
import { unescape } from './util/unescape';


export class Parser<R=unknown, T=unknown> {
  readonly options: Options<R, T>;

  private tokens: Token[]  = [];
  private token: Token;
  private slugger = new Slugger();
  private inline: InlineProcessor<R, T>;
  private inlineText: InlineLexer;
  private renderer: RendererLike<R, T>;

  constructor(options?: PartialOptions<R, T>) {
    this.options = fill(options || {}) as any;
  }

  parse(tokens: TokensList, renderer: RendererLike<R, T>) {
    this.renderer = renderer;
    this.inline = new InlineProcessor(tokens, renderer, this.options);
    this.inlineText = new InlineLexer(tokens.links as any, {
      renderer: new TextRenderer() as any
    });

    this.tokens = tokens.reverse();
    const res = <fragment/>;
    while(this.next())
      renderer.render(this.tok()).on(res);

    return res;
  }

  private next() {
    const _next = this.tokens.pop();
    if (_next) this.token = _next;
    return _next;
  }

  private safeNext() {
    const _next = this.next();
    if (!_next) throw new Error('Unexpected end of stream');
    return _next;
  }

  private peek() {
    return this.tokens[this.tokens.length - 1];
  }

  private parseText() {
    let body = (this.token as any).text || '';

    while(this.peek().type === 'text')
      body += '\n' + (this.next() as any).text;

    return this.inline.process(body);
  }

  private tok() {
    const renderer = this.renderer;

    switch(this.token.type) {
      case 'space': return this.options.Space ? <this.options.Space/> : <fragment/>;
      case 'hr': return <this.options.Hr/>;
      case 'heading':
        const slug = this.slugger.slug(unescape(this.inlineText.output(this.token.text)));
        return <this.options.Heading depth={this.token.depth}
              slug={slug}>{this.inline.process(this.token.text)}</this.options.Heading>;
      case 'code':
        return <this.options.Code lang={this.token.lang || ''}>{this.token.text}</this.options.Code>;
      case 'table': {
        const header = this.token.header.map((cell, i) => 
            <this.options.TableHeaderCell align={(this.token as any).align[i]}>
              {this.inline.process(cell)}
            </this.options.TableHeaderCell>);

        const body = this.token.cells.map(row => 
          <this.options.TableRow>
            {row.map((cell, j) => <this.options.TableCell align={(this.token as any).align[j]}>
              {this.inline.process(cell)}
            </this.options.TableCell>)}
          </this.options.TableRow>);

        return <this.options.Table header={header as any} body={body as any}/>;
      }
      case 'blockquote_start': {
        const body = <fragment/>;
        while (this.safeNext().type !== 'blockquote_end')
          renderer.render(this.tok()).on(body);

        return <this.options.BlockQuote>{body}</this.options.BlockQuote>;
      }
      case 'list_start': {
        const body = <fragment/>;
        const ordered = this.token.ordered;
        while (this.safeNext().type !== 'list_end')
          renderer.render(this.tok()).on(body);

        return <this.options.List ordered={ordered}>{body}</this.options.List>;
      }
      case 'list_item_start': {
        const body = <fragment/>;
        const loose = (this.token as any).loose;
        while (this.safeNext().type !== 'list_item_end') {
          if (!loose && (this.token.type as any) === 'text')
            renderer.render(<fragment>{this.parseText()}</fragment>).on(body);
          else
            renderer.render(this.tok()).on(body);
        }

        return <this.options.ListItem>{body}</this.options.ListItem>;
      }
      case 'html':
        return <this.options.Html content={this.token.text}/>
      case 'paragraph':
        return <this.options.Paragraph>{this.inline.process(this.token.text)}</this.options.Paragraph>;
      case 'text':
        return <this.options.Paragraph>{this.parseText()}</this.options.Paragraph>
      default:
        throw new Error('Unrecognized Token:: ' + this.token.type);
    }
  }
}
