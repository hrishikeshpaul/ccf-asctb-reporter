import { Signal } from 'vega';
import { Sheet, SheetConfig } from '../../../models/sheet.model';

interface VegaSignals {
  signals: Array<Signal>;
}

export class Signals implements VegaSignals {
  signals: any;

  constructor(config: SheetConfig) {
    this.signals = [
      this.makeBimodalNodeClickStateSignal(),
      this.makeBimodalNodeHoverStateSignal(),
      this.makeBimodalNodeSourcesHoverStateSignal(),
      this.makeBimodalNodeTargetsHoverStateSignal(),
      this.makeBimodalTargetsClickStateSignal(),
      this.makeBimodalSourcesClickStateSignal(),
      this.makeSearchSignal(),
      this.makeBimodalTextClickSignal(),
      this.makeBimodalTextHoverSignal(),
      this.makeASTreeWidthSignal(config.width),
      this.makeASTreeHeightSignal(config.height),
      this.makeShowOntologyIDSignal(config.show_ontology)
    ];

    return this.signals;
  }

  makeShowOntologyIDSignal(value: boolean) {
    return {
      name: 'show_ontology',
      value
    };
  }

  makeASTreeWidthSignal(width: number) {
    return {
      name: 'as_width',
      value: width,
    };
  }

  makeASTreeHeightSignal(height: number) {
    return {
      name: 'as_height',
      value: height,
    };
  }

  makeBimodalTextClickSignal() {
    return {
      name: 'bimodal_text__click',
      value: null,
      on: [
        {
          events: '@textmark:click, @astextmark:click',
          update: 'datum.type === \'AS\' && datum.children ? datum : datum.type === \'BM\' ? datum : null'
        },
        { events: 'click[!event.item]', update: 'null' }
      ]
    };
  }

  makeBimodalTextHoverSignal() {
    return {
      name: 'bimodal_text__hover',
      value: null,
      on: [
        {
          events: '@textmark:mouseover, @astextmark:mouseover',
          update: 'datum'
        },
        { events: 'mouseover[!event.item]', update: 'null' }
      ]
    };
  }

  /**
   * Signal to trigger clicking action on a bimodal network signal. It updates the field (node__click)
   * with the id of the node being clicked on.
   *
   * On clicking elsewhere, the field is updated with null.
   *
   */

  makeBimodalNodeClickStateSignal() {
    return {
      name: 'node__click',
      value: null,
      on: [
        {
          events: '@bimodal-symbol:click',
          update: 'datum.id === node__click ? null : datum.id',
        },
        { events: 'click[!event.item]', update: 'null' },
      ],
    };
  }

  /**
   * Signal to trigger hovering action on a bimodal network signal. It updates the field (node__hover)
   * with the id of the node being hovered on.
   *
   * On removing the mouse from the node, the field is updated with null.
   */

  makeBimodalNodeHoverStateSignal(): Signal {
    return {
      name: 'node__hover',
      value: null,
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.id' },
        { events: 'mouseover[!event.item]', update: 'null' },
      ],
    };
  }

  /**
   * Signal to trigger hovering action on a bimodal network signal. It updates the field (node_targets__hover)
   * with the targets array of the current node.
   *
   * On removing the mouse from the node, the field is updated with null.
   */

  makeBimodalNodeTargetsHoverStateSignal(): Signal {
    return {
      name: 'node_targets__hover',
      value: [],
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.targets' },
        { events: 'mouseover[!event.item]', update: '[]' },
      ],
    };
  }

  /**
   * Signal to trigger hovering action on a bimodal network signal. It updates the field (node_sources__hover)
   * with the sources array of the current node.
   *
   * On removing the mouse from the node, the field is updated with null.
   */

  makeBimodalNodeSourcesHoverStateSignal(): Signal {
    return {
      name: 'node_sources__hover',
      value: [],
      on: [
        { events: '@bimodal-symbol:mouseover', update: 'datum.sources' },
        { events: 'mouseover[!event.item]', update: '[]' },
      ],
    };
  }

  /**
   * Signal to trigger clicking action on a bimodal network signal. It updates the field (targets__click)
   * with the targets array of the current node.
   *
   * On clicking elsewhere, the field is updated with null.
   */

  makeBimodalTargetsClickStateSignal(): Signal {
    return {
      name: 'targets__click',
      value: [],
      on: [
        {
          events: '@bimodal-symbol:click',
          update: 'datum.targets === targets__click ? [] : datum.targets',
        },
        { events: 'click[!event.item]', update: '[]' },
      ],
    };
  }

  /**
   * Signal to trigger clicking action on a bimodal network signal. It updates the field (sources__click)
   * with the sources array of the current node.
   *
   * On clicking elsewhere, the field is updated with null.
   */

  makeBimodalSourcesClickStateSignal() {
    return {
      name: 'sources__click',
      value: [],
      on: [
        {
          events: '@bimodal-symbol:click',
          update: 'datum.sources === sources__click ? [] : datum.sources',
        },
        { events: 'click[!event.item]', update: '[]' },
      ],
    };
  }

  makeSearchSignal() {
    return {
      name: 'search_signal',
      value: [],
    };
  }

}
