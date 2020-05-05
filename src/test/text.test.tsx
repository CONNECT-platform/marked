import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';


describe('marked() [Text]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render normal text.', () => {
    const renderer = new Renderer();
    const text = 'hellow world';

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$?.firstChild?.textContent).to.equal('hellow world');
  });

  it('should be possible to use custom components for texts.', () => {
    const renderer = new Renderer();
    const text = 'hellow world';
    const ref = <span/>;

    renderer.render(marked(text, { Text: () => ref })).on(document.body);

    expect(document.body.firstChild?.firstChild).to.equal(ref);
  });

  it('should pass proper content to custom components.', () => {
    const renderer = new Renderer();
    const text = 'hellow world';

    renderer.render(marked(text, { 
      Text: (_: any, __: any, content: any) => {
        expect((<marker>{content}</marker>).textContent).to.equal('hellow world');
        return <span/>;
      } 
    })).on(document.body);
  });
});