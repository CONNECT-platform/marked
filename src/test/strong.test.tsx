import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';


describe('marked() [Strong]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render strong text.', () => {
    const renderer = new Renderer();
    const text = `**hellow** world`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$?.querySelector('strong')?.textContent).to.equal('hellow');
  });

  it('should support inline markdown within strong text.', () => {
    const renderer = new Renderer();
    const text = `**hellow _world_ [a](o) ![x](y "z")**`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild?.firstChild as HTMLElement;

    expect(el$.querySelector('em')?.textContent).to.equal('world');
    expect(el$.querySelector('a')?.getAttribute('href')).to.equal('o');
    expect(el$.querySelector('img')?.getAttribute('src')).to.equal('y');
    expect(el$.querySelector('img')?.getAttribute('title')).to.equal('z');
  });

  it('should be possible to use custom components for strong elements.', () => {
    const renderer = new Renderer();
    const text = `**hellow** world`;
    const ref = <span/>;

    renderer.render(marked(text, { Strong: () => ref })).on(document.body);

    expect(document.body.firstChild?.firstChild).to.equal(ref);
  });

  it('should pass proper inline markdown content to custom components.', () => {
    const renderer = new Renderer();
    const text = '**hellow `world` ~~hmm~~**';

    renderer.render(marked(text, { 
      Strong: (_: any, __: any, content: any) => {
        const el$ = <marker>{content}</marker>;

        expect(el$.querySelector('code')?.textContent).to.equal('world');
        expect(el$.querySelector('del')?.textContent).to.equal('hmm');
        return <span/>;
      } 
    })).on(document.body);
  });
});