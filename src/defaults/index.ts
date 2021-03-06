import { PartialOptions } from '../options';

import { Hr } from './hr';
import { Heading } from './heading';
import { Code } from './code';
import { Table, TableRow, TableCell, TableHeaderCell } from './table';
import { BlockQuote } from './block-quote';
import { Paragraph } from './paragraph';
import { List, ListItem } from './list';
import { Html } from './html';


export function fill<R, T>(options: PartialOptions<R, T>) {
  return {
    Hr: options.Hr || Hr,
    Heading: options.Heading || Heading,
    Code: options.Code || Code,
    Table: options.Table || Table,
    TableRow: options.TableRow || TableRow,
    TableCell: options.TableCell || TableCell,
    TableHeaderCell: options.TableHeaderCell || TableHeaderCell,
    BlockQuote: options.BlockQuote || BlockQuote,
    List: options.List || List,
    ListItem: options.ListItem || ListItem,
    Html: options.Html || Html,
    Paragraph: options.Paragraph || Paragraph,

    Space: options.Space,

    Link: options.Link,
    Em: options.Em,
    Strong: options.Strong,
    Del: options.Del,
    Image: options.Image,
    CodeSpan: options.CodeSpan,
    Text: options.Text,
  }
}
