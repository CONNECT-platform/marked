import { RendererLike } from "@connectv/html";

export interface TableProps {
  header?: Node;
  body?: Node;
}


export function Table(props: TableProps, renderer: RendererLike<unknown, unknown>) {
  return <table>
    <thead>{props.header || ''}</thead>
    <tbody>{props.body || ''}</tbody>
  </table>
}


export function TableRow(_: {}, renderer: RendererLike<unknown, unknown>, content: unknown) {
  return <tr>{content}</tr>
}


export interface TableCellProps {
  align?: 'left' | 'right' | 'center';
}


export function TableHeaderCell(props: TableCellProps, renderer: RendererLike<unknown, unknown>, content: unknown) {
  if (props.align)
    return <th style={`text-align: ${props.align}`}>{content}</th>
  else return <th>{content}</th>
}


export function TableCell(props: TableCellProps, renderer: RendererLike<unknown, unknown>, content: unknown) {
  if (props.align)
    return <td style={`text-align: ${props.align}`}>{content}</td>
  else return <td>{content}</td>
}
