import { expect, should } from 'chai'; should();

import { escape } from '../escape';


describe('escape()', () => {
  it('should replace `<` character in given html string.', () => {
    escape('wow < hellow', true).should.equal('wow &lt; hellow');
  });

  it('should replace `>` character in given html string.', () => {
    escape('wow > hellow', true).should.equal('wow &gt; hellow');
  });

  it('should replace `&` character in given html string.', () => {
    escape('wow & hellow', true).should.equal('wow &amp; hellow');
  });

  it('should replace `"` character in given html string.', () => {
    escape('wow " hellow', true).should.equal('wow &quot; hellow');
  });

  it('should replace `\'` character in given html string.', () => {
    escape('wow \' hellow', true).should.equal('wow &#39; hellow');
  });

  it('should not tamper `&` in already replaced string when `false` is passed for second argument.', () => {
    escape(escape('hellow > world', false) + ' < now', false)
      .should.equal('hellow &gt; world &lt; now');
  });

  it('should return the original string if no replacement is needed.', () => {
    escape('hellow world', false).should.equal('hellow world');
    escape('hellow world', true).should.equal('hellow world');
  });
});
