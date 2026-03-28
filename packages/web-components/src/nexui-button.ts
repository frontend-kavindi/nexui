import { classNames } from '@nexui/utils';
import { css, html, LitElement } from 'lit';
import type { CSSResultGroup } from 'lit';

export class NexuiButton extends LitElement {
  static styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }

    button {
      font: inherit;
      border-radius: var(--nexui-radius-md);
      padding-block: var(--nexui-spacing-2);
      padding-inline: var(--nexui-spacing-4);
    }

    button[data-variant='primary'] {
      border: 1px solid var(--nexui-color-primary-600);
      background: var(--nexui-color-primary-600);
      color: var(--nexui-color-text-on-primary);
    }

    button[data-variant='secondary'] {
      border: 1px solid var(--nexui-color-border-default);
      background: var(--nexui-color-surface-canvas);
      color: var(--nexui-color-text-primary);
    }

    button[disabled] {
      cursor: not-allowed;
      opacity: 0.7;
    }

    button:not([disabled]) {
      cursor: pointer;
    }
  `;

  static properties = {
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    rootClass: { type: String, attribute: 'root-class', reflect: false },
  };

  variant: 'primary' | 'secondary' = 'secondary';

  disabled = false;

  rootClass: string | undefined;

  constructor() {
    super();
    this.variant = 'secondary';
    this.disabled = false;
  }

  render() {
    const className = classNames('nexui-button', this.rootClass);
    return html`<button
      part="control"
      class="${className}"
      data-variant="${this.variant}"
      ?disabled="${this.disabled}"
    >
      <slot></slot>
    </button>`;
  }
}

const tagName = 'nexui-button';

export function registerNexuiButton(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, NexuiButton);
  }
}
