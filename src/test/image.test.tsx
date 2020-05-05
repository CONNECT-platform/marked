import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { ImageOptions } from '../inline';


describe('marked() [Image]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render images.', () => {
    const renderer = new Renderer();
    const text = `![hellow](url) world`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$?.querySelector('img')?.getAttribute('alt')).to.equal('hellow');
  });

  it('should properly render image sources.', () => {
    const renderer = new Renderer();
    const text = `![hellow](url) world`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$?.querySelector('img')?.getAttribute('src')).to.equal('url');
  });

  it('should properly render image titles.', () => {
    const renderer = new Renderer();
    const text = `![hellow](url "halo")![world](xx (wow))`;

    renderer.render(marked(text)).on(document.body);
    const images$: HTMLElement[] = [];
    document.body.firstChild?.childNodes.forEach(image$ => images$.push(image$ as HTMLElement));

    expect(images$[0]?.getAttribute('title')).to.equal('halo');
    expect(images$[1]?.getAttribute('title')).to.equal('wow');
  });

  it('should properly render images with references sources.', () => {
    const renderer = new Renderer();
    const text = `![hellow][1]![world][b]

[1]: /hellow
[b]: WORLD!!! "wow"`;

    renderer.render(marked(text)).on(document.body);
    const images$: HTMLElement[] = [];
    document.body.firstChild?.childNodes.forEach(image$ => images$.push(image$ as HTMLElement));

    expect(images$[0]?.getAttribute('src')).to.equal('/hellow');
    expect(images$[1]?.getAttribute('src')).to.equal('WORLD!!!');
    expect(images$[1]?.getAttribute('title')).to.equal('wow');
  });

  it('should be possible to use custom components for images.', () => {
    const renderer = new Renderer();
    const text = `![hellow](/) world`;
    const ref = <span/>;

    renderer.render(marked(text, { Image: () => ref })).on(document.body);

    expect(document.body.firstChild?.firstChild).to.equal(ref);
  });

  it('should pass proper src, alt and title to custom components.', () => {
    const renderer = new Renderer();
    const text = `![hellow](/ "world")`;

    renderer.render(marked(text, { 
      Image: ({src, title, alt}: ImageOptions) => {
        src.should.equal('/');
        title.should.equal('world');
        alt.should.equal('hellow');
        return <span/>;
      }
    })).on(document.body);
  });

  it('should pass proper referenced src and title to custom components.', () => {
    const renderer = new Renderer();
    const text = `![hellow][xx]

[xx]: / (world)`;

    renderer.render(marked(text, { 
      Image: ({src, title}: ImageOptions) => {
        src.should.equal('/');
        title.should.equal('world');
        return <span/>;
      }
    })).on(document.body);
  });
});