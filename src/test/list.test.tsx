import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { ListProps } from '../defaults/list';


describe('marked() [List]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render lists.', () => {
    const renderer = new Renderer();
    const text = `
- hellow
- world
`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild;

    expect(el$).to.be.instanceOf(HTMLUListElement);
    expect(el$?.firstChild?.textContent).to.equal('hellow');  
  });

  it('should properly render ordered lists.', () => {
    const renderer = new Renderer();
    const text = `
1. hellow
1. world
`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild;

    expect(el$).to.be.instanceOf(HTMLOListElement);
    expect(el$?.firstChild?.textContent).to.equal('hellow');  
  });

  it('should properly render markdown content of the list.', () => {
    const renderer = new Renderer();
    const text = `
- hellow **world** I am ~~Eugene~~
- > and wanted to tell you:
  1. I have an ordered list here now
- \`\`\`md
and stuff here
\`\`\`
`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$.querySelector('li:first-child > strong')?.textContent).to.equal('world');
    expect(el$.querySelector('li:first-child > del')?.textContent).to.equal('Eugene');
    expect(el$.querySelector('li:nth-child(2) > blockquote')?.textContent).to.equal('and wanted to tell you:');
    expect(el$.querySelector('li:nth-child(2) > ol > li')?.textContent).to.equal('I have an ordered list here now');
    expect(el$.querySelector('li:nth-child(3) > pre > code')?.textContent).to.equal('and stuff here');
  });

  it('should allow custom components for lists.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = `
- hellow
- world
`;
    renderer.render(marked(text, { List: () => ref })).on(document.body);
    expect(document.body.firstChild).to.equal(ref);
  });

  it('should be possible to use custom components for list items.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = `
- hellow
`;
    renderer.render(marked(text, { ListItem: () => ref })).on(document.body);
    expect(document.body.firstChild?.firstChild).to.equal(ref);
  });

  it('should pass proper content to custom list components.', () => {
    const renderer = new Renderer();
    const text = `
- hellow **world** I am ~~Eugene~~
- > and wanted to tell you:
  1. I have an ordered list here now
- \`\`\`md
and stuff here
\`\`\`
`;
    renderer.render(marked(text, { 
      List: ({ ordered }: ListProps, __: any, content: any) => {
        if (ordered) return <ol>{content}</ol>;

        const el$ = <div>{content}</div>;
        expect(el$.querySelector('li:first-child > strong')?.textContent).to.equal('world');
        expect(el$.querySelector('li:first-child > del')?.textContent).to.equal('Eugene');
        expect(el$.querySelector('li:nth-child(2) > blockquote')?.textContent).to.equal('and wanted to tell you:');
        expect(el$.querySelector('li:nth-child(2) > ol > li')?.textContent).to.equal('I have an ordered list here now');
        expect(el$.querySelector('li:nth-child(3) > pre > code')?.textContent).to.equal('and stuff here');
        return <div/>;
      } 
    })).on(document.body);
  });

  it('should pass proper content to custom list item components.', () => {
    const renderer = new Renderer();
    const text = `
- hellow **world** I am ~~Eugene~~
\`\`\`
`;
    renderer.render(marked(text, { 
      ListItem: (_: any, __: any, content: any) => {
        const el$ = <div>{content}</div>;
        expect(el$.querySelector('strong')?.textContent).to.equal('world');
        expect(el$.querySelector('del')?.textContent).to.equal('Eugene');
        return <div/>;
      } 
    })).on(document.body);
  });

  it('should pass proper ordered property to custom list components.', () => {
    const renderer = new Renderer();
    const text1 = `
- hellow
- world
`;
    renderer.render(marked(text1, { 
      List: ({ ordered }: ListProps) => {
        expect(ordered).to.be.false;
        return <div/>;
      } 
    })).on(document.body);

    const text2 = `
1. hellow
1. world
`;
    renderer.render(marked(text2, { 
      List: ({ ordered }: ListProps) => {
        expect(ordered).to.be.true;
        return <div/>;
      } 
    })).on(document.body);
  });
});