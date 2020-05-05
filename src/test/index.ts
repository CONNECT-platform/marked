describe('@connectv/marked', () => {
  require('../util/test');

  require('./strong.test');
  require('./em.test');
  require('./del.test');
  require('./codespan.test');
  require('./link.test');
  require('./image.test');
  require('./text.test');
  require('./space.test');
  require('./hr.test');
  require('./paragraph.test');
  require('./heading.test');
  require('./block-quote.test');
  require('./table.test');
  require('./list.test');
  require('./code.test');
  require('./html.test');

  require('./linked-comp.test');
  require('./quoted-comp.test');
});