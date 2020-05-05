import { expect, should } from 'chai'; should();

import jsdom from 'jsdom-global';
import { Renderer } from '@connectv/html';

import { marked } from '../index';
import { TableProps, TableCellProps } from '../defaults/table';


describe('marked() [Table]', () => {
  beforeEach(function() {
    this.jsdom = jsdom();
    (global as any).MutationObserver = require('mutation-observer');
  });

  afterEach(function() {
    this.jsdom();
  });

  it('should properly render tables.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
| name  | msg |
 -----  | ----
| world | hellow
`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$).to.be.instanceOf(HTMLTableElement);
    expect(el$.querySelector('thead > th:first-child')?.textContent).to.equal('name');
    expect(el$.querySelector('thead > th:nth-child(2)')?.textContent).to.equal('msg');
    expect(el$.querySelector('tbody > tr > td:first-child')?.textContent).to.equal('world');
    expect(el$.querySelector('tbody > tr > td:nth-child(2)')?.textContent).to.equal('hellow');
  });

  it('should properly set alignment flags.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
name  | msg    | whatev
-----:| :----: | :---
world | hellow | whatever else
also  | this   | and that
`;

    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;
    expect((el$.querySelector('thead > th:first-child') as HTMLElement).style.textAlign).to.equal('right');
    expect((el$.querySelector('tbody > tr:first-child > td:nth-child(2)') as HTMLElement).style.textAlign)
      .to.equal('center');
    expect((el$.querySelector('tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement).style.textAlign)
      .to.equal('left');
  });

  it('should properly render inline markdown on tables.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
the _name_  | the [message](link)
    -----   | ----
**world**   | \`hellow\`
`;
    renderer.render(marked(text)).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$.querySelector('thead > th:first-child > em')?.textContent).to.equal('name');
    expect(el$.querySelector('thead > th:nth-child(2) > a')?.getAttribute('href')).to.equal('link');
    expect(el$.querySelector('tbody > tr > td:first-child > strong')?.textContent).to.equal('world');
    expect(el$.querySelector('tbody > tr > td:nth-child(2) > code')?.textContent).to.equal('hellow');
  });

  it('should be possible to use a custom table component.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = '' + 
`
the _name_  | the [message](link)
    -----   | ----
**world**   | \`hellow\`
`;
    renderer.render(marked(text, { Table: () => ref })).on(document.body);
    expect(document.body.firstChild).to.equal(ref);
  });

  it('should be possible to use a custom table-row component.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = '' + 
`
the _name_  | the [message](link)
    -----   | ----
**world**   | \`hellow\`
`;
    renderer.render(marked(text, { TableRow: () => ref })).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$.querySelector('tbody > div')).to.equal(ref);
  });

  it('should be possible to use a custom table-head-cell component.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = '' + 
`
the _name_  |
    -----   |
`;
    renderer.render(marked(text, { TableHeaderCell: () => ref })).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$.querySelector('thead > div')).to.equal(ref);
  });

  it('should be possible to use a custom table-cell component.', () => {
    const renderer = new Renderer();
    const ref = <div/>;
    const text = '' + 
`
the _name_  |
    -----   |
    wow
`;
    renderer.render(marked(text, { TableCell: () => ref })).on(document.body);
    const el$ = document.body.firstChild as HTMLElement;

    expect(el$.querySelector('tbody > tr > div')).to.equal(ref);
  });

  it('should pass the proper head and body props to table custom components.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
the _name_  | the [message](link)
    -----   | ----
**world**   | \`hellow\`
`;
    renderer.render(marked(text, {
      Table: ({header, body}: TableProps, __: any) => {
        const head$ = <div>{header}</div>;
        const body$ = <div>{body}</div>;
        expect(head$.querySelector('th:first-child > em')?.textContent).to.equal('name');
        expect(head$.querySelector('th:nth-child(2) > a')?.getAttribute('href')).to.equal('link');
        expect(body$.querySelector('tr > td:first-child > strong')?.textContent).to.equal('world');
        expect(body$.querySelector('tr > td:nth-child(2) > code')?.textContent).to.equal('hellow');

        return <div/>;
      }
    }))
  });

  it('should pass the proper markdown content to custom table-row components.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
the _name_  | the [message](link)
    -----   | ----
**world**   | \`hellow\`
`;
    renderer.render(marked(text, { 
      TableRow: (_: any, __: any, content: any) => {
        const el$ = <div>{content}</div>;
        expect(el$.querySelector('td:first-child > strong')?.textContent).to.equal('world');
        expect(el$.querySelector('td:nth-child(2) > code')?.textContent).to.equal('hellow');
        return <div/>;
      } 
    })).on(document.body);
  });

  it('should pass the proper markdown content to custom table-header-cell components.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
the _name_  |
    -----   |
**world**   |
`;
    renderer.render(marked(text, { 
      TableHeaderCell: (_: any, __: any, content: any) => {
        const el$ = <div>{content}</div>;
        expect(el$.querySelector('em')?.textContent).to.equal('name');
        return <div/>;
      } 
    })).on(document.body);
  });

  it('should pass the proper markdown content to custom table-cell components.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
the _name_  |
    -----   |
**world**   |
`;
    renderer.render(marked(text, { 
      TableCell: (_: any, __: any, content: any) => {
        const el$ = <div>{content}</div>;
        expect(el$.querySelector('strong')?.textContent).to.equal('world');
        return <div/>;
      } 
    })).on(document.body);
  });

  it('should pass the proper align property to custom table-header-cell components.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
the _name_  |
    -----:   |
**world**   |
`;
    renderer.render(marked(text, { 
      TableHeaderCell: ({ align }: TableCellProps) => {
        expect(align).to.equal('right');
        return <div/>;
      } 
    })).on(document.body);
  });

  it('should pass the proper align property to custom table-cell components.', () => {
    const renderer = new Renderer();
    const text = '' + 
`
the _name_  |
         :-:|
**world**   |
`;
    renderer.render(marked(text, { 
      TableCell: ({ align }: TableCellProps) => {
        expect(align).to.equal('center');
        return <div/>;
      } 
    })).on(document.body);
  });
});