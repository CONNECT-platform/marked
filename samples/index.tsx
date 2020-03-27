import register from 'jsdom-global';
register();

import { JSDOM } from 'jsdom';
const dom = new JSDOM();

// ---------------

import { Renderer } from '@connectv/html';
import { marked, quotedComponents } from '../src';

const text = `
- Look \`at\` [Google](www.google.com)

> :Tabs
> > :Tab name=first tab
> >
> > Halo
`

function Tabs(_: any, renderer: any, content: any) {
  return <div class="tabs">{content}</div>;
}

function Tab({name}: any, renderer: any, content: any) {
  return <div class="tab" data-tab-name={name}>{content}</div>;
}

const renderer = new Renderer();

renderer.render(
  marked(text, {
    BlockQuote: quotedComponents({ Tabs, Tab })
  })
).on(dom.window.document.body);

console.log(dom.serialize());