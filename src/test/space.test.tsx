import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';


describe('marked() [Space]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should be possible to provide a custom component for spaces.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = `hellow world

here we've got some space`;

    renderer.render(marked(text, { Space: () => ref })).on(document.body);

    const children: HTMLElement[] = [];
    document.body.childNodes.forEach(child => children.push(child as HTMLElement));

    children[1].should.equal(ref);
  });
});