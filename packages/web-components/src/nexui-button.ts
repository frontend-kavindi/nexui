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
      border-radius: var(--nexui-radius-md, 8px);
      padding: var(--nexui-space-2, 8px) var(--nexui-space-4, 16px);
    }

    button[data-variant='primary'] {
      border: 1px solid var(--nexui-color-brand-primary, #2563eb);
      background: var(--nexui-color-brand-primary, #2563eb);
      color: var(--nexui-color-brand-onPrimary, #ffffff);
    }

    button[data-variant='secondary'] {
      border: 1px solid var(--nexui-color-border-default, #e5e5e5);
      background: var(--nexui-color-background-canvas, #ffffff);
      color: var(--nexui-color-foreground-default, #0a0a0a);
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
