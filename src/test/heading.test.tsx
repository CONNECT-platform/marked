import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { HeadingProps } from '../defaults/heading';


describe('marked() [Headings]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render headings.', () => {
    const renderer = new Renderer();
    const text = `# hellow`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild;

    expect(el$).to.be.instanceOf(HTMLHeadingElement);
    expect(el$?.textContent).to.equal('hellow');
  });

  it('should use proper tag names for headings.', () => {
    const renderer = new Renderer();
    const text = `# hellow

## hellow2

### hellow this

#### hellow that

##### and all other stuff

###### and this too
`;

    renderer.render(marked(text)).on(document.body);

    const names: string[] = [];
    document.body.childNodes.forEach(child => names.push(child.nodeName));

   names.should.eql(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
  });

  it('should give each heading a proper id.', () => {
    const renderer = new Renderer();
    const text = `## hellow My (Dears) and !whatnot > this < that >> whatever`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLHeadingElement;

    expect(el$.getAttribute('id')).to.equal('hellow-my-dears-and-whatnot--this--that--whatever');
  });

  it('should be possible to handle custom markdown inside the heading content.', () => {
    const renderer = new Renderer();
    const text = '## hellow **world** [Oh](dear) `was ist das?`';

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLHeadingElement;

    expect(el$.querySelector('strong')?.textContent).to.equal('world');
    expect(el$.querySelector('a')?.getAttribute('href')).to.equal('dear');
    expect(el$.querySelector('code')?.textContent).to.equal('was ist das?');
  });

  it('should be possible to use custom heading components.', () => {
    const renderer = new Renderer();
    const text = '# hellow';
    const ref = <div/>;

    renderer.render(marked(text, { Heading: () => ref})).on(document.body);

    expect(document.body.firstChild).to.equal(ref);
  });

  it('should pass the proper heading depth to the custom heading component.', () => {
    const renderer = new Renderer();
    const text = '### hellow';

    renderer.render(marked(text, {
      Heading: ({depth}: HeadingProps) => { depth.should.equal(3); return <div/>; }
    })).on(document.body);
  });

  it('should pass the proper slug to the custom heading component.', () => {
    const renderer = new Renderer();
    const text = '### hellow [world ! >> @__X)';

    renderer.render(marked(text, {
      Heading: ({slug}: HeadingProps) => { slug.should.equal('hellow-world---__x'); return <div/>; }
    })).on(document.body);
  });

  it('should pass the proper content to the custom heading component.', () => {
    const renderer = new Renderer();
    const text = '### hellow [world](wow) _this_';

    renderer.render(marked(text, {
      Heading: (_: any, __: any, content: any) => { 
        const res = <div>{content}</div>;
        expect(res.querySelector('a')?.getAttribute('href')).to.equal('wow');
        expect(res.querySelector('em')?.textContent).to.equal('this');
        return <div/>;
      }
    })).on(document.body);
  });
});