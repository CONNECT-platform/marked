export interface Options<R, T> {
  Space: any,
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
}

export type PartialOptions<R, T> = Partial<Options<R, T>>;
