import register from 'jsdom-global';
register();

import { JSDOM } from 'jsdom';
const dom = new JSDOM();

// ---------------

import { Renderer } from '@connectv/html';
import marked, { lexer } from 'marked';

import { Parser } from '../src/parser';

const text = `
# Hellow My Dear

1. Well
1. I gotta say
  - This is pretty wild
  - And pretty interesting
1. And
`

const parser = new Parser();

const renderer = new Renderer();
renderer.render(parser.parse(lexer(text), renderer)).on(dom.window.document.body);

console.log(dom.serialize());