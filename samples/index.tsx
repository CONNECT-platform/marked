import register from 'jsdom-global';
register();

import { JSDOM } from 'jsdom';
const dom = new JSDOM();

// ---------------

import { Renderer } from '@connectv/html';
import marked, { lexer } from 'marked';

import { Parser } from '../src/parser';
import { quotedComponents } from '../src/quote-comp';

const text = `
# Hellow My Dear

> :Tabs
>
> Header of the tab bar
>
> > :Tab name=index.ts
> > \`\`\`typescript
> > console.log('halo');
> > \`\`\`
> > Also other stuff
>
> > :Tab name=world.ts
> > \`\`\`typescript
> > console.log('world');
> > \`\`\`
`

function Tabs(_: any, renderer: any, content: any) {
  return <div class="tabs">{content}</div>;
}

function Tab({name}: any, renderer: any, content: any) {
  return <div class="tab" data-tab-name={name}>{content}</div>;
}

const parser = new Parser({
  BlockQuote: quotedComponents({ Tabs, Tab })
});

const renderer = new Renderer();
renderer.render(parser.parse(lexer(text), renderer)).on(dom.window.document.body);

console.log(dom.serialize());