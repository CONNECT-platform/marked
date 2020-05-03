import { InlineLexer, TokensList } from 'marked';
import { RendererLike } from '@connectv/html';

import { Options } from './options';


export class InlineProcessor<R=unknown, T=unknown> {
  private lexer: InlineLexer;

  constructor(
    tokens: TokensList,
    private renderer: RendererLike<R, T>,
    readonly options: Options<R, T>,
  ) {
    this.lexer = new InlineLexer(tokens.links as any);
  }

  process(block: string) {
    const renderer = this.renderer;
    return this.buildFrom(<span _innerHTML={this.lexer.output(block)}/>);
  }

  children(src: Node) {
    const l: Node[] = [];
    src.childNodes.forEach(node => l.push(node));
    return l;
  }

  buildFrom(src: Node) {
    const renderer = this.renderer;
    const res = <fragment/>;
    this.children(src).forEach(node => {
      if (node instanceof Text && this.options.Text) {
        renderer.render(<this.options.Text>{node.textContent || ''}</this.options.Text>).on(res);
      }
      else if (node instanceof HTMLAnchorElement && this.options.Link) {
        renderer.render(<this.options.Link 
          href={node.getAttribute('href') || ''}
          title={node.getAttribute('title') || ''}
          >{this.buildFrom(node)}</this.options.Link>).on(res);
      } 
      else if (node instanceof HTMLElement && node.tagName === 'EM' && this.options.Em) {
        renderer.render(<this.options.Em>
            {this.buildFrom(node)}
          </this.options.Em>).on(res);
      } 
      else if (node instanceof HTMLElement && node.tagName === 'STRONG' && this.options.Strong) {
        renderer.render(<this.options.Strong>
          {this.buildFrom(node)}
        </this.options.Strong>).on(res);
      }
      else if (node instanceof HTMLElement && node.tagName === 'DEL' && this.options.Del) {
        renderer.render(<this.options.Del>
          {this.buildFrom(node)}
        </this.options.Del>).on(res);
      }
      else if (node instanceof HTMLElement && node.tagName === 'CODE' && this.options.CodeSpan) {
        renderer.render(<this.options.CodeSpan>
          {this.buildFrom(node)}
        </this.options.CodeSpan>).on(res);
      }
      else if (node instanceof HTMLImageElement && this.options.Image) {
        renderer.render(<this.options.Image 
          src={node.getAttribute('src') || ''}
          alt={node.getAttribute('alt') || ''}
        />).on(res);
      }
      else renderer.render(node).on(res);
    });

    return res;
  }
}
