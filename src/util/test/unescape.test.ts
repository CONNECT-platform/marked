import { expect, should } from 'chai'; should();

import { unescape } from '../unescape';


describe('unescape()', () => {
  it('should replace `&colon;` with `:` in given string', () => {
    unescape('hellow &colon; world').should.equal('hellow : world');
  });

  it('should replace `&#number;` with the respective character.', () => {
    unescape('hellow &#39; world').should.equal('hellow \' world');
  });

  it('should replace `&#xnumber;` with the respective character.', () => {
    unescape('hellow &#x49; world').should.equal('hellow I world');
  });

  it('should remove other `&...;` stuff.', () => {
    unescape('hellow &lt; world').should.equal('hellow  world');
  });
});