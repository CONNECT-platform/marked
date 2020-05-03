import register from 'jsdom-global';
register();

import { JSDOM } from 'jsdom';
const dom = new JSDOM();

// ---------------

import { Renderer } from '@connectv/html';
import { marked, quotedComponents, linkedComponents } from '../src';

const text = `
- Look \`at\` _Me!_

> :Tabs
> > :Tab name=first tab
> >
> > Halo
> > [Halo _World_](:Tag (x=big))
`

function Tabs(_: any, renderer: any, content: any) {
  return <div class="tabs">{content}</div>;
}

function Tab({name}: any, renderer: any, content: any) {
  return <div class="tab" data-tab-name={name}>{content}</div>;
}

function Tag({x}: any, renderer: any, content: any) {
  return <span class="tag">{x} {content}</span>
}

function Em(_: any, renderer: any, content: any) {
  return <b>{content}</b>;
}

const renderer = new Renderer();

renderer.render(
  marked(text, {
    Em,
    BlockQuote: quotedComponents({ Tabs, Tab }),
    Link: linkedComponents({ Tag })
  })
).on(dom.window.document.body);

console.log(dom.serialize());