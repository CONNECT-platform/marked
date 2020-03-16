import { RendererLike } from '@connectv/html';


export function BlockQuote(_: {}, renderer: RendererLike<unknown, unknown>, content: unknown) {
  return <blockquote>{content}</blockquote>
}
