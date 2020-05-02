import { PartialOptions, Options } from '../options';

import { Space } from './space';
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
    Space: options.Space || Space,
    Hr: options.Hr || Hr,
    Heading: options.Heading || Heading,
    Code: options.Code || Code,
    Table: options.Table || Table,
    TableRow: options.TableRow || TableRow,
    TableCell: options.TableCell || TableCell,
    TableHeaderCell: options.TableHeaderCell || TableHeaderCell,
    BlockQuote: options.BlockQuote || BlockQuote,
    List: options.List || List,
    ListItem: options.List || ListItem,
    Html: options.Html || Html,
    Paragraph: options.Paragraph || Paragraph,
    inline: options.inline || {},
  }
}
