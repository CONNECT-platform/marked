import { RendererLike } from '@connectv/html';


export function Paragraph(_: {}, renderer: RendererLike<unknown, unknown>, content: unknown) {
  return <p>{content}</p>
}
