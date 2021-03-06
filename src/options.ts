export interface Options<R, T> {
  Hr: any,
  Heading: any,
  Code: any,

  Table: any,
  TableRow: any,
  TableCell: any,
  TableHeaderCell: any,

  BlockQuote: any,
  List: any,
  ListItem: any,
  Html: any,
  Paragraph: any,

  Space?: any,

  Link?: any,
  Em?: any,
  Strong?: any,
  Del?: any,
  Image?: any,
  CodeSpan?: any,
  Text?: any
}

export type PartialOptions<R, T> = Partial<Options<R, T>>;
