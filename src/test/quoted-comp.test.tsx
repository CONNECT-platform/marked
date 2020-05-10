import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { quotedComponents } from '../quote-comp';


describe('quotedComponents()', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should allow for custom block-level components.', () => {
    const renderer = new Renderer();
    const ref = <div/>;

    renderer.render(marked('> :hellow', {
      BlockQuote: quotedComponents({
        hellow: () => ref
      })
    })).on(document.body);

    expect(document.body.firstChild).to.equal(ref);
  });

  it('should render default block quotes for normal block quotes.', () => {
    const renderer = new Renderer();

    const text = `
> normal block

> :hellow
`

    renderer.render(marked(text, {
      BlockQuote: quotedComponents({
        hellow: () => <div/>
      })
    })).on(document.body);

    expect(document.body.firstChild).to.be.instanceOf(HTMLQuoteElement);
    expect(document.body.lastChild).to.be.instanceOf(HTMLDivElement);
  });

  it('should pass the attributes to custom components.', () => {
    const renderer = new Renderer();

    const text = `
> :hellow well I gotta say = something , and = something else
`

    renderer.render(marked(text, {
      BlockQuote: quotedComponents({
        hellow(props: any) {
          props['well I gotta say'].should.equal('something');
          props.and.should.equal('something else');
          return <div/>;
        }
      })
    })).on(document.body);
  });

  it('should be possible to pass attributes including `=` by enclosing them with quotes.', () => {
    const renderer = new Renderer();

    const text = `
> :hellow well I 'gotta=2' say = something , and = "something else=true"
`

    renderer.render(marked(text, {
      BlockQuote: quotedComponents({
        hellow(props: any) {
          props['well I \'gotta=2\' say'].should.equal('something');
          props.and.should.equal('something else=true');
          return <div/>;
        }
      })
    })).on(document.body);
  });

  it('should be possible to pass attributes including `,` by enclosing them with quotes.', () => {
    const renderer = new Renderer();

    const text = `
> :hellow well I 'gotta,2' say = something , and = "something, else, true"
`

    renderer.render(marked(text, {
      BlockQuote: quotedComponents({
        hellow(props: any) {
          props['well I \'gotta,2\' say'].should.equal('something');
          props.and.should.equal('something, else, true');
          return <div/>;
        }
      })
    })).on(document.body);
  });

  it('should be smart enough to consider extra `=` in value properly.', () => {
    const renderer = new Renderer();

    renderer.render(marked('> :hellow x = y = z', {
      Link: quotedComponents({
        hellow(props: any) {
          props.x.should.equal('y = z');
          return <div/>;
        }
      })
    })).on(document.body);
  });

  it('should be smart enough to consider extra `,` in key properly.', () => {
    const renderer = new Renderer();

    renderer.render(marked('> :hellow x , y = z', {
      Link: quotedComponents({
        hellow(props: any) {
          props['x , y'].should.equal('z');
          return <span/>;
        }
      })
    })).on(document.body);
  });

  it('should pass the proper markdown content to custom components.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = `
> :hellow
>
> Well I gotta **say**,
> - this is cool
> - this is rad
>
> > :world
> >
> > Also I can have nested comps!
`;
    renderer.render(marked(text, {
      BlockQuote: quotedComponents({
        hellow(_: any, __: any, content: any) {
          const children: HTMLElement[] = [];
          (<div>{content}</div>).childNodes.forEach(child => children.push(child as HTMLElement));

          expect(children[0].querySelector('strong')?.textContent).to.equal('say');
          expect(children[1].firstChild?.textContent).to.equal('this is cool');
          expect(children[1].lastChild?.textContent).to.equal('this is rad');
          expect(children[2]).to.equal(ref);

          return <div/>;
        },
        world() { return ref; }
      })
    })).on(document.body);
  });

  it('should throw proper errors when unrecognized components are referenced.', () => {
    const renderer = new Renderer();
    expect(() => {
      renderer.render(marked('> :hellow', { BlockQuote: quotedComponents({}) })).on(document.body);
    }).to.throw();
  });
});