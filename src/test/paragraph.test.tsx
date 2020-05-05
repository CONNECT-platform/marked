import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';


describe('marked() [Paragraph]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should render paragraphs using P element.', () => {
    const renderer = new Renderer();
    const text = `hellow world`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild;

    expect(el$).to.be.instanceOf(HTMLParagraphElement);
  });

  it('should render a separate paragraph for each new line.', () => {
    const renderer = new Renderer();
    const text = `hellow world

my name is Eugene`;
    renderer.render(marked(text)).on(document.body);
    const children: HTMLElement[] = [];
    document.body.childNodes.forEach(node => children.push(node as HTMLElement));

    expect(children[0]).to.be.instanceOf(HTMLParagraphElement);
    expect(children[0].textContent).to.equal('hellow world');
    expect(children[1]).to.be.instanceOf(HTMLParagraphElement);
    expect(children[1].textContent).to.equal('my name is Eugene');
  });

  it('should properly render inline markdown on paragraphs.', () => {
    const renderer = new Renderer();
    const text = `hellow [world](/) my **name** ~~is~~ _Eugene_`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLParagraphElement;

    expect(el$.querySelector('a')?.getAttribute('href')).to.equal('/');
    expect(el$.querySelector('strong')?.textContent).to.equal('name');
    expect(el$.querySelector('del')?.textContent).to.equal('is');
    expect(el$.querySelector('em')?.textContent).to.equal('Eugene');
  });

  it('should be possible to use custom components for paragraphs.', () => {
    const renderer = new Renderer();
    const text = `hellow [world](/) my **name** ~~is~~ _Eugene_`;
    const ref = <div/>;

    renderer.render(marked(text, { Paragraph: () => ref })).on(document.body);
    expect(document.body.firstChild).to.equal(ref);
  });

  it('should pass the proper markdown content to custom components.', () => {
    const renderer = new Renderer();
    const text = `hellow [world](/) my **name** ~~is~~ _Eugene_`;

    renderer.render(marked(text, { 
      Paragraph: (_: any, __: any, content: any) => {
        const el$ = <marker>{content}</marker>;

        expect(el$.querySelector('a')?.getAttribute('href')).to.equal('/');
        expect(el$.querySelector('strong')?.textContent).to.equal('name');
        expect(el$.querySelector('del')?.textContent).to.equal('is');
        expect(el$.querySelector('em')?.textContent).to.equal('Eugene');

        return <div/>;
      } 
    })).on(document.body);
  });
});
