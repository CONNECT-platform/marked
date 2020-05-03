import register from 'jsdom-global';
register();

import { JSDOM } from 'jsdom';
const dom = new JSDOM();

// ---------------

import { Renderer } from '@connectv/html';
import { marked, quotedComponents } from '../src';

const text = `
- Look \`at\` _Me!_

> :Tabs
> > :Tab name=first tab
> >
> > Halo
> > [Halo _World_](:X (x=2, y=34))
`

function Tabs(_: any, renderer: any, content: any) {
  return <div class="tabs">{content}</div>;
}

function Tab({name}: any, renderer: any, content: any) {
  return <div class="tab" data-tab-name={name}>{content}</div>;
}

function Link(_: any, renderer: any, content: any) {
  return <span class="link">{content}</span>
}

function Em(_: any, renderer: any, content: any) {
  return <b>{content}</b>;
}

const renderer = new Renderer();

renderer.render(
  marked(text, {
    Link, Em,
    BlockQuote: quotedComponents({ Tabs, Tab }),
  })
).on(dom.window.document.body);

console.log(dom.serialize());