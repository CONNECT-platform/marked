import { RendererLike } from '@connectv/html';

import { ComponentMap } from './comp-map';


const compRegex = /^\[\:(\w+)(\s+(?:\w+\s*\=[^\,]+\s*)(?:\,\s*\w+\s*\=[^\,]+\s*)*)?\s*\]/;

type _Props = { [key: string]: string };
type _Marker = {
  $: HTMLElement;
  component: string;
  props: _Props;
}

export class InlineCompProcessor {
  constructor(
    readonly renderer: RendererLike<unknown, unknown>,
    readonly map: ComponentMap,
  ) {}

  process(el: HTMLElement) {
    this.markers(el).forEach(marker => {
      let Comp = this.map[marker.component]
      if (!Comp)
        throw new Error('Unrecognized Inline Component:: ' + marker.component);

      const content: Node[] = [];
      marker.$.childNodes.forEach(child => content.push(child));
      this.renderer.render(this.renderer.create(Comp, marker.props, content)).before(marker.$);
      marker.$.remove();
    });

    return el;
  }

  markers(el: HTMLElement) {
    const markers: _Marker[] = [];
    el.querySelectorAll('em').forEach(em$ => {
      let match;
      if (em$.firstChild && em$.firstChild instanceof Text
        && (match = compRegex.exec(em$.firstChild.textContent || ''))) {
          em$.firstChild.textContent = em$.firstChild.textContent?.substr(match[0].length) || '';
          markers.push({
            $: em$,
            component: match[1],
            props: this.props(match[2]),
          });
        }
    });

    return markers;
  }

  props(desc: string) {
    return desc?.trim().split(',').reduce((props, bit) => {
      const [key, val] = bit.split('=').map(_ => _.trim());
      props[key] = val;
      return props;
    }, {} as _Props) || {};
  }
}
