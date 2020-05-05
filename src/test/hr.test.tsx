import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';


describe('marked() [Hr]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should render a horizontal line', () => {
    const renderer = new Renderer();
    const text = `hellow world
-- -- --- -
here we've got some space
  ____
some more space
****** ****** ******
even more space
`;

    renderer.render(marked(text)).on(document.body);

    const children: HTMLElement[] = [];
    document.body.childNodes.forEach(child => children.push(child as HTMLElement));

    children[1].should.be.instanceOf(HTMLHRElement);
    children[3].should.be.instanceOf(HTMLHRElement);
    children[5].should.be.instanceOf(HTMLHRElement);
  });

  it('should be possible to provide a custom component for hrs.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = `hellow world

  *** **  **** *** ** * *

here we've got some space`;

    renderer.render(marked(text, { Hr: () => ref })).on(document.body);

    const children: HTMLElement[] = [];
    document.body.childNodes.forEach(child => children.push(child as HTMLElement));

    children[1].should.equal(ref);
  });
});