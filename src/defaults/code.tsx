import { RendererLike } from "@connectv/html";

import { escape } from "../util/escape";


export interface CodeProps {
  lang?: string;
}


export function Code(props: CodeProps, renderer: RendererLike<unknown, unknown>, children: unknown[]) {
  let code = children.join();

  if (props.lang)
    return <pre><code class={escape(props.lang, true)}>{code}</code></pre>;
  else
    return <pre><code>{code}</code></pre>;
}
