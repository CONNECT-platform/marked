import { RendererLike } from "@connectv/html";


export interface HeadingProps {
  depth: number;
  slug: string;
}


export function Heading(props: HeadingProps, renderer: RendererLike<unknown, unknown>, children: unknown) {
  if (props.depth == 1) return <h1 id={props.slug}>{children}</h1>;
  else if (props.depth == 2) return <h2 id={props.slug}>{children}</h2>;
  else if (props.depth == 3) return <h3 id={props.slug}>{children}</h3>;
  else if (props.depth == 4) return <h4 id={props.slug}>{children}</h4>;
  else if (props.depth == 5) return <h5 id={props.slug}>{children}</h5>;
  else return <h6 id={props.slug}>{children}</h6>;
}
