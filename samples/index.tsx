import register from 'jsdom-global';
register();

import { JSDOM } from 'jsdom';
const dom = new JSDOM();

// ---------------

import { Renderer } from '@connectv/html';
import { marked, quotedComponents } from '../src';

const text = `
- Look \`at\` _[:Tag]Halo!_

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

function Tag({avatar}: any, renderer: any, content: any) {
  return <span class="tag">{avatar?<img src={avatar}/>:''}{content}</span>
}

const renderer = new Renderer();

renderer.render(
  marked(text, {
    BlockQuote: quotedComponents({ Tabs, Tab }),
    inline: { Tag }
  })
).on(dom.window.document.body);

console.log(dom.serialize());