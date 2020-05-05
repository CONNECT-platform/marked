import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { CodeProps } from '../defaults/code';


describe('marked() [Code]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render code elements.', () => {
    const renderer = new Renderer();
    const text = `
\`\`\`
hellow world!
\`\`\`
`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild;

    expect(el$).to.be.instanceOf(HTMLPreElement);
    expect((el$?.firstChild as HTMLElement).tagName).to.equal('CODE');
    expect(el$?.firstChild?.textContent).to.equal('hellow world!');
  });

  it('should properly set the language class of code elements when provided.', () => {
    const renderer = new Renderer();
    const text = `
\`\`\`whatevs
hellow world!
\`\`\`
`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$.querySelector('code')?.classList.contains('whatevs')).to.be.true;
  });

  it('should be possible to use custom components for code.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = `
\`\`\`whatevs
hellow world!
\`\`\`
`;
    renderer.render(marked(text, { Code: () => ref })).on(document.body);
    expect(document.body.firstChild).to.equal(ref);
  });

  it('should pass proper content to custom components used for code.', () => {
    const renderer = new Renderer();
    const text = `
\`\`\`whatevs
hellow world <hellow>&
\`\`\`
`;
    renderer.render(marked(text, {
      Code: (_: any, __: any, content: any) => {
        expect((<div>{content}</div>).textContent).to.equal('hellow world <hellow>&');
        return <div/>;
      }
    })).on(document.body);
  });

  it('should pass proper language to custom components used for code.', () => {
    const renderer = new Renderer();
    const text = `
\`\`\`whatevs
hellow world!
\`\`\`
`;
    renderer.render(marked(text, { 
      Code: ({ lang }: CodeProps) => {
        expect(lang).to.equal('whatevs');
        return <div/>;
      }
    })).on(document.body);
  });
});