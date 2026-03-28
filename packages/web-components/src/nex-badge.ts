import { classNames } from '@nexui/utils';
import { ifDefined } from 'lit/directives/if-defined.js';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultGroup } from 'lit';

export type NexBadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

@customElement('nex-badge')
export class NexBadge extends LitElement {
  static styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }

    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: var(--nexui-spacing-5);
      padding-block: var(--nexui-spacing-1);
      padding-inline: var(--nexui-spacing-2);
      border-radius: var(--nexui-radius-full);
      border-width: 1px;
      border-style: solid;
      font-family: var(--nexui-typography-font-family-sans);
      font-size: var(--nexui-typography-font-size-xs);
      font-weight: var(--nexui-typography-font-weight-medium);
      line-height: var(--nexui-typography-line-height-tight);
    }

    span[data-tone='neutral'] {
      background-color: var(--nexui-color-surface-sunken);
      color: var(--nexui-color-text-secondary);
      border-color: var(--nexui-color-border-default);
    }

    span[data-tone='primary'] {
      background-color: var(--nexui-color-primary-100);
      color: var(--nexui-color-primary-800);
      border-color: var(--nexui-color-primary-200);
    }

    span[data-tone='success'] {
      background-color: var(--nexui-color-semantic-success-bgMuted);
      color: var(--nexui-color-semantic-success-fg);
      border-color: var(--nexui-color-semantic-success-border);
    }

    span[data-tone='warning'] {
      background-color: var(--nexui-color-semantic-warning-bgMuted);
      color: var(--nexui-color-semantic-warning-fg);
      border-color: var(--nexui-color-semantic-warning-border);
    }

    span[data-tone='error'] {
      background-color: var(--nexui-color-semantic-error-bgMuted);
      color: var(--nexui-color-semantic-error-fg);
      border-color: var(--nexui-color-semantic-error-border);
    }

    span[data-tone='info'] {
      background-color: var(--nexui-color-semantic-info-bgMuted);
      color: var(--nexui-color-semantic-info-fg);
      border-color: var(--nexui-color-semantic-info-border);
    }
  `;

  @property({ type: String, reflect: true }) tone: NexBadgeTone = 'neutral';

  /** When true, polite live region for counts that change (WCAG 4.1.3). */
  @property({ type: Boolean, reflect: true }) live = false;

  @property({ type: String, attribute: 'root-class' }) rootClass = '';

  protected render() {
    const className = classNames('nex-badge', this.rootClass);
    return html`
      <!-- WCAG 4.1.3: default omit role/status so static badges are not re-announced on every navigation. -->
      <!-- WCAG 4.1.3: when live, role=status + aria-live=polite surfaces updates without interrupting the user. -->
      <span
        part="root"
        class="${className}"
        data-tone="${this.tone}"
        role="${ifDefined(this.live ? 'status' : undefined)}"
        aria-live="${ifDefined(this.live ? 'polite' : undefined)}"
      >
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nex-badge': NexBadge;
  }
}

const tagName = 'nex-badge';

export function registerNexBadge(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, NexBadge);
  }
}

// DECISION LOG
// Problem: badges are mostly decorative but sometimes represent volatile counts for assistive tech.
// Options considered: (1) always role=status; (2) aria-live without role; (3) opt-in live flag.
// Why I chose this: mirrors React NexuiBadge `live` prop and limits noisy SR output by default.
// Trade-off: consumers must set `live` when the inner text changes frequently enough to matter for AT.
