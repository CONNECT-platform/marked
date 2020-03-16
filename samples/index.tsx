import register from 'jsdom-global';
register();

import { JSDOM } from 'jsdom';
const dom = new JSDOM();

// ---------------

import { RendererLike, Renderer } from '@connectv/html';
import { lexer } from 'marked';

import { Parser } from '../src/parser';

const text = `
  # Hellow My Dear
  ---
`

function Heading({depth, slug}: any, renderer: RendererLike<any, any>, children: any) {
  if (depth == 1) return <h1 id={slug}>{children}</h1>;
  if (depth == 2) return <h2 id={slug}>{children}</h2>;
  if (depth == 3) return <h3 id={slug}>{children}</h3>;
  else return <h5 id={slug}>{children}</h5>;
}

const parser = new Parser({
  Heading,
  Hr: (_: any, renderer: RendererLike<any, any>) => <hr/>,
  Space: (_: any, renderer: RendererLike<any, any>) => <fragment/>
});

const renderer = new Renderer();
renderer.render(parser.parse(lexer(text), renderer)).on(dom.window.document.body);

console.log(dom.serialize());