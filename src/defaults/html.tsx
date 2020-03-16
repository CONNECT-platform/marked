import { RendererLike } from "@connectv/html";


export interface HtmlProps {
  content: string;
}

export function Html(props: HtmlProps, renderer: RendererLike<unknown, unknown>) {
  return <marker _innerHTML={props.content}/>;
}
