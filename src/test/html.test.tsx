import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { HtmlProps } from '../defaults/html';


describe('marked() [HTML]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render HTML elements in the middle of markdown.', () => {
    const renderer = new Renderer();
    const text = `hellow 

<div>world</div>`;

    renderer.render(marked(text)).on(document.body);
    expect(document.querySelector('div')?.textContent).to.equal('world');
  });

  it('should be possible to use custom HTML components.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = `hellow

<div>world</div>`;

    renderer.render(marked(text, { Html: () => ref })).on(document.body);
    expect(document.body.querySelector('div')).to.equal(ref);
  });

  it('should pass the proper content to custom HTML components.', () => {
    const renderer = new Renderer();
    const text = `hellow

<div>**world** OH!</div>`;

    renderer.render(marked(text, { 
      Html: ({ content }: HtmlProps) => {
        content.should.equal('<div>**world** OH!</div>');
        return <div/>;
      }
    })).on(document.body);
  });
});