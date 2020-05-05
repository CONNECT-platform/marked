import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';


describe('marked() [Block Quotes]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render block quotes.', () => {
    const renderer = new Renderer();
    const text = `> hellow world`;

    renderer.render(marked(text)).on(document.body);
    expect(document.body.firstChild).to.be.instanceOf(HTMLQuoteElement);
    expect(document.body.firstChild?.textContent).to.equal('hellow world');
  });

  it('should properly render markdown inside block quotes.', () => {
    const renderer = new Renderer();
    const text = `> hellow **world**
> _this_ is \`some serious\` markdown.
> - even with a list
> - inside it
>
> > and another block quote`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$.querySelector('strong')?.textContent).to.equal('world');
    expect(el$.querySelector('em')?.textContent).to.equal('this');
    expect(el$.querySelector('code')?.textContent).to.equal('some serious');
    expect(el$.querySelector('ul>li:first-child')?.textContent).to.equal('even with a list');
    expect(el$.querySelector('ul>li:nth-child(2)')?.textContent).to.equal('inside it');
    expect(el$.querySelector('blockquote')?.textContent).to.equal('and another block quote');
  });

  it('should be possible to use custom components for block quotes.', () => {
    const renderer = new Renderer();
    const text = `> hellow world`;
    const ref = <div/>;

    renderer.render(marked(text, { BlockQuote: () => ref })).on(document.body);
    expect(document.body.firstChild).to.equal(ref);
  });

  it('should pass the proper markdown content to the custom component.', () => {
    const renderer = new Renderer();
    const text = `> hellow ~~world~~
> [this is](some (stuff)) serios markdown.
> 1. even with a list
> 1. inside it
>
> \`\`\`md
> some code
> \`\`\``;

    renderer.render(marked(text, {
      BlockQuote: (_: any, __: any, content: any) => {
        const ref = <div>{content}</div>;
        expect(ref.querySelector('del')?.textContent).to.equal('world');
        expect(ref.querySelector('a')?.getAttribute('title')).to.equal('stuff');
        expect(ref.querySelector('ol>li:first-child')?.textContent).to.equal('even with a list');
        expect(ref.querySelector('ol>li:nth-child(2)')?.textContent).to.equal('inside it');
        expect(ref.querySelector('pre>code')?.textContent).to.equal('some code');

        return <div/>;
      }
    })).on(document.body);
  });

  it('should also properly work with nested blockquote components.', () => {
    const renderer = new Renderer();
    const text = `> > hellow
> - > world`;

    renderer.render(marked(text, {
      BlockQuote: (_: any, __: any, content: any) => <div data-whatev='X'>{content}</div>
    })).on(document.body);

    const el$ = document.body.firstChild as HTMLElement;

    expect(el$).to.be.instanceOf(HTMLDivElement);
    expect(el$.getAttribute('data-whatev')).to.equal('X');
    expect(el$.querySelector('div')?.getAttribute('data-whatev')).to.equal('X');
    expect(el$.querySelector('div')?.textContent).to.equal('hellow');
    expect(el$.querySelector('ul > li > div')?.textContent).to.equal('world');
  });
});