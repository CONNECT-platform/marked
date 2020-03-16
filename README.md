# marked
Component-based markdown renderer for [CONNECTIVE HTML](https://github.com/CONNECT-platform/connective-html). The component-based approach allows you to provide your own custom (possibly interactive) components for the markdown conversion:

```tsx
// my-header.tsx

function MyHeader({ depth, slug }, renderer, content) {
  return <div class={'title title-' + depth} id={'header-' + slug}>{content}</div>;
}
```
```tsx
// index.tsx

import { marked } from '@connectv/marked';
import { Renderer } from '@connectv/html';

import { MyHeader } from './my-header';

const renderer = new Renderer();

renderer.render(marked('## Hellow World!', {
  Heading: MyHeader
})(renderer)).on(document.body);

//
// Result:
// <div class="title title-2" id="header-hellow-world">Hellow World!</div>
//
```

## Installation

`npm i @connectv/marked`

For providing your own custom components in JSX/TSX, you need to configure your transpiler accordingly. [Here is how to do it for Typescript](https://github.com/CONNECT-platform/connective-html#for-typescript) and [here you can see how to do it for Babel](https://github.com/CONNECT-platform/connective-html#for-typescript).


## Usage

### Basic

```typescript
import { Renderer } from '@connectv/html';
import { marked } from '@connectv/marked';

const renderer = new Renderer();
const md = `
# Hellow!

So this is some markdown text with **some features** and stuff.
`;

renderer.render(marked(md)(renderer)).on(document.body);
```

Server-side rendering (using [CONNECTIVE SDH](https://github.com/CONNECT-platform/connective-sdh)):

```typescript
import { compile } from '@connectv/sdh';
import { marked } from '@connectv/marked';

compile(marked(`
# Hellow Again!

Some other [markdown](https://en.wikipedia.org/wiki/Markdown) for you.
`))
.save('dist/index.html');
```

### Overriding Components

As mentioned above, the main point of this library is to provide your own custom components for generating DOM from the markdown:

```tsx
// my-code.tsx

export function MyCode({ lang }, renderer, content) {
  return <pre onclick={() => copyToClipboard(content)}>
    <code class={'code ' + lang}>{content}</code>
  </pre>;
}
```
```tsx
// index.tsx

import { marked } from '@connectv/marked';
import { Renderer } from '@connect/html';

import { MyCode } from './my-code';

const renderer = new Renderer();
const md = `
# Example Code:
\`\`\`typescript
export function something() {
  console.log('Halo!');
}
\`\`\`
`;

renderer.render(marked(md, {
  Code: MyCode
})(renderer)).on(document.body);
```

### Markdown Features

[marked](https://marked.js.org/#/README.md#README.md) is used under the hood, so all features supported by marked are supported here.

