import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { LinkOptions } from '../inline';


describe('marked() [Link]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render links.', () => {
    const renderer = new Renderer();
    const text = `[hellow](url) world`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$?.querySelector('a')?.textContent).to.equal('hellow');
  });

  it('should properly render link URLs.', () => {
    const renderer = new Renderer();
    const text = `[hellow](url) world`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$?.querySelector('a')?.getAttribute('href')).to.equal('url');
  });

  it('should properly render link titles.', () => {
    const renderer = new Renderer();
    const text = `[hellow](url "halo")[world](xx (wow))`;

    renderer.render(marked(text)).on(document.body);
    const links$: HTMLElement[] = [];
    document.body.firstChild?.childNodes.forEach(link$ => links$.push(link$ as HTMLElement));

    expect(links$[0]?.getAttribute('title')).to.equal('halo');
    expect(links$[1]?.getAttribute('title')).to.equal('wow');
  });

  it('should properly render referenced links.', () => {
    const renderer = new Renderer();
    const text = `[hellow][1][world][b]

[1]: /hellow
[b]: WORLD!!! "wow"`;

    renderer.render(marked(text)).on(document.body);
    const links$: HTMLElement[] = [];
    document.body.firstChild?.childNodes.forEach(link$ => links$.push(link$ as HTMLElement));

    expect(links$[0]?.getAttribute('href')).to.equal('/hellow');
    expect(links$[1]?.getAttribute('href')).to.equal('WORLD!!!');
    expect(links$[1]?.getAttribute('title')).to.equal('wow');
  });

  it('should support inline markdown within link text.', () => {
    const renderer = new Renderer();
    const text = `[hellow **world** _oh_](XX)`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild?.firstChild as HTMLElement;

    expect(el$.querySelector('strong')?.textContent).to.equal('world');
    expect(el$.querySelector('em')?.textContent).to.equal('oh');
  });

  it('should be possible to use custom components for links.', () => {
    const renderer = new Renderer();
    const text = `[hellow]() world`;
    const ref = <span/>;

    renderer.render(marked(text, { Link: () => ref })).on(document.body);

    expect(document.body.firstChild?.firstChild).to.equal(ref);
  });

  it('should pass proper href and title to custom components.', () => {
    const renderer = new Renderer();
    const text = `[hellow](/ "world")`;

    renderer.render(marked(text, { 
      Link: ({href, title}: LinkOptions) => {
        href.should.equal('/');
        title.should.equal('world');
        return <span/>;
      }
    })).on(document.body);
  });

  it('should pass proper referenced href and title to custom components.', () => {
    const renderer = new Renderer();
    const text = `[hellow][xx]

[xx]: / (world)`;

    renderer.render(marked(text, { 
      Link: ({href, title}: LinkOptions) => {
        href.should.equal('/');
        title.should.equal('world');
        return <span/>;
      }
    })).on(document.body);
  });

  it('should pass proper inline markdown content to custom components.', () => {
    const renderer = new Renderer();
    const text = '[hellow `world` **hmm**](/)';

    renderer.render(marked(text, { 
      Link: (_: any, __: any, content: any) => {
        const el$ = <marker>{content}</marker>;

        expect(el$.querySelector('code')?.textContent).to.equal('world');
        expect(el$.querySelector('strong')?.textContent).to.equal('hmm');
        return <span/>;
      } 
    })).on(document.body);
  });
});