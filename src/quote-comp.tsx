import { CompType, RendererLike } from '@connectv/html';


export type ComponentMap = {[name: string]: CompType<unknown, unknown>}


export function quotedComponents(map: ComponentMap) {
  return function(_: {}, renderer: RendererLike<unknown, unknown>, content: unknown) {
    let ref = <marker>{content}</marker>;
    if (ref.childNodes[0].textContent?.startsWith(':')) {
      const parts = ref.childNodes[0].textContent.substr(1).split(' ');
      const name = parts[0];

      if (name in map) {
        const Comp = map[name];
        const props = parts.slice(1).reduce((props, part) => {
          const [key, value] = part.split('=');
          props[key] = value;
          return props;
        }, {} as {[prop: string]: string});
        const children: Node[] = [];
        ref.childNodes.forEach((child, index) => { if (index >= 1) children.push(child); });

        return renderer.create(Comp, props, children);
      }
      else {
        throw new Error('Unrecognized Quoted Component:: ' + name);
      }
    }
    else {
      const children: Node[] = [];
      ref.childNodes.forEach(child => children.push(child));
      return <blockquote>{children}</blockquote>;
    }
  }
}
