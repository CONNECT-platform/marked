import { RendererLike } from '@connectv/html';


export interface ListProps {
  ordered?: boolean;
}


export function List(props: ListProps, renderer: RendererLike<unknown, unknown>, content: unknown) {
  if (props.ordered) return <ol>{content}</ol>;
  else return <ul>{content}</ul>;
}


export function ListItem(_: {}, renderer: RendererLike<unknown, unknown>, content: unknown) {
  return <li>{content}</li>
}
