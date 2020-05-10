import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { linkedComponents } from '../link-comp';


describe('linkedComponents()', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should allow for custom inline components.', () => {
    const renderer = new Renderer();
    const ref = <span/>;

    renderer.render(marked('[hellow](:world)', {
      Link: linkedComponents({
        world: () => ref
      })
    })).on(document.body);

    expect(document.body.firstChild?.firstChild).to.equal(ref);
  });

  it('should render default links for normal links.', () => {
    const renderer = new Renderer();
    renderer.render(marked('[hellow](Url)[wow](:world)', {
      Link: linkedComponents({
        world: () => <span/>
      })
    })).on(document.body);

    expect(document.body.firstChild?.firstChild).to.be.instanceOf(HTMLAnchorElement);
    expect(document.body.firstChild?.lastChild).to.be.instanceOf(HTMLSpanElement);
  });

  it('should pass attributes to the custom components.', () => {
    const renderer = new Renderer();

    renderer.render(marked('[hellow](:world (x=hellow world, y = dudes what is this?))', {
      Link: linkedComponents({
        world(props: any) {
          props.x.should.equal('hellow world');
          props.y.should.equal('dudes what is this?');
          return <span/>;
        }
      })
    })).on(document.body);
  });

  it('should be possible to pass keys or values containing `=` by enclosing it with quotes', () => {
    const renderer = new Renderer();

    renderer.render(marked('[hellow](:world (x=\'hellow = world\', "y = 2" = dudes what is this?))', {
      Link: linkedComponents({
        world(props: any) {
          props.x.should.equal('hellow = world');
          props['y = 2'].should.equal('dudes what is this?');
          return <span/>;
        }
      })
    })).on(document.body);
  });

  it('should be possible to pass keys or values containing `,` by enclosing it with quotes', () => {
    const renderer = new Renderer();

    renderer.render(marked('[hellow](:world (x=`hellow , world`, "y , 2" = dudes what is this?))', {
      Link: linkedComponents({
        world(props: any) {
          props.x.should.equal('hellow , world');
          props['y , 2'].should.equal('dudes what is this?');
          return <span/>;
        }
      })
    })).on(document.body);
  });

  it('should be smart enough to consider extra `=` in value properly.', () => {
    const renderer = new Renderer();

    renderer.render(marked('[hellow](:world (x = y = z))', {
      Link: linkedComponents({
        world(props: any) {
          props.x.should.equal('y = z');
          return <span/>;
        }
      })
    })).on(document.body);
  });

  it('should be smart enough to consider extra `,` in key properly.', () => {
    const renderer = new Renderer();

    renderer.render(marked('[hellow](:world (x , y = z))', {
      Link: linkedComponents({
        world(props: any) {
          props['x , y'].should.equal('z');
          return <span/>;
        }
      })
    })).on(document.body);
  });

  it('should pass the proper content to the custom component.', () => {
    const renderer = new Renderer();

    renderer.render(marked('[**hellow** _world_](:world)', {
      Link: linkedComponents({
        world(_: any, __: any, content: any) {
          const el$ = <div>{content}</div>;
          expect(el$.querySelector('strong')?.textContent).to.equal('hellow');
          expect(el$.querySelector('em')?.textContent).to.equal('world');

          return <span/>;
        }
      })
    })).on(document.body);
  });

  it('should throw proper errors when unrecognized components are referenced.', () => {
    const renderer = new Renderer();
    expect(() => {
      renderer.render(marked('[hellow](:world)', { Link: linkedComponents({}) })).on(document.body);
    }).to.throw();
  });
});