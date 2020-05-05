import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';


describe('marked() [Em]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render em text.', () => {
    const renderer = new Renderer();
    const text = `_hellow_ world`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$?.querySelector('em')?.textContent).to.equal('hellow');
  });

  it('should support inline markdown within em text.', () => {
    const renderer = new Renderer();
    const text = `_hellow ~~world~~ [a](o (z)) ![x](y)_`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild?.firstChild as HTMLElement;

    expect(el$.querySelector('del')?.textContent).to.equal('world');
    expect(el$.querySelector('a')?.getAttribute('href')).to.equal('o');
    expect(el$.querySelector('a')?.getAttribute('title')).to.equal('z');
    expect(el$.querySelector('img')?.getAttribute('src')).to.equal('y');
  });

  it('should be possible to use custom components for em elements.', () => {
    const renderer = new Renderer();
    const text = `_hellow_ world`;
    const ref = <span/>;

    renderer.render(marked(text, { Em: () => ref })).on(document.body);

    expect(document.body.firstChild?.firstChild).to.equal(ref);
  });

  it('should pass proper inline markdown content to custom components.', () => {
    const renderer = new Renderer();
    const text = '_hellow `world` **hmm**_';

    renderer.render(marked(text, { 
      Em: (_: any, __: any, content: any) => {
        const el$ = <marker>{content}</marker>;

        expect(el$.querySelector('code')?.textContent).to.equal('world');
        expect(el$.querySelector('strong')?.textContent).to.equal('hmm');
        return <span/>;
      } 
    })).on(document.body);
  });
});