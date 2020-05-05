import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';


describe('marked() [Code Span]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render code span text.', () => {
    const renderer = new Renderer();
    const text = '`hellow` world';

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$?.querySelector('code')?.textContent).to.equal('hellow');
  });

  it('should be possible to use custom components for code spans.', () => {
    const renderer = new Renderer();
    const text = '`hellow` world';
    const ref = <span/>;

    renderer.render(marked(text, { CodeSpan: () => ref })).on(document.body);

    expect(document.body.firstChild?.firstChild).to.equal(ref);
  });

  it('should pass proper content to custom components.', () => {
    const renderer = new Renderer();
    const text = '`hellow world`';

    renderer.render(marked(text, { 
      CodeSpan: (_: any, __: any, content: any) => {
        expect((<marker>{content}</marker>).textContent).to.equal('hellow world');
        return <span/>;
      } 
    })).on(document.body);
  });
});