import { classNames } from '@nexui/utils';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultGroup } from 'lit';

export type NexCheckboxChangeDetail = { checked: boolean };

let nexCheckboxUid = 0;

@customElement('nex-checkbox')
export class NexCheckbox extends LitElement {
  static formAssociated = true;

  static styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }

    label.nex-checkbox {
      display: inline-flex;
      flex-direction: row;
      align-items: flex-start;
      gap: var(--nexui-spacing-2);
      cursor: pointer;
      font-family: var(--nexui-typography-font-family-sans);
      font-size: var(--nexui-typography-font-size-sm);
      line-height: var(--nexui-typography-line-height-normal);
      color: var(--nexui-color-text-primary);
      margin: 0;
    }

    label.nex-checkbox[data-disabled] {
      cursor: not-allowed;
      opacity: var(--nexui-opacity-subdued);
    }

    input {
      width: var(--nexui-spacing-4);
      height: var(--nexui-spacing-4);
      margin: 0;
      margin-top: var(--nexui-spacing-1);
      flex-shrink: 0;
      accent-color: var(--nexui-color-primary-600);
      cursor: inherit;
    }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Mixed state via IDL only; WCAG: native checkbox exposes mixed to AT without duplicating aria-checked (4.1.2).
   */
  @property({ type: Boolean }) indeterminate = false;

  @property({ type: String }) name = '';

  @property({ type: String, attribute: 'root-class' }) rootClass = '';

  #internals: ElementInternals;

  #fieldId = '';

  #input: HTMLInputElement | null = null;

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.#fieldId) {
      nexCheckboxUid += 1;
      this.#fieldId = `nex-checkbox-${String(nexCheckboxUid)}`;
    }
    this.#syncFormValue();
  }

  protected override firstUpdated(_changed: PropertyValues<this>): void {
    this.#input = this.renderRoot.querySelector('input');
    this.#applyIndeterminate();
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('checked')) {
      this.#syncFormValue();
    }
    if (changed.has('indeterminate')) {
      this.#applyIndeterminate();
    }
  }

  #applyIndeterminate(): void {
    const el = this.#input ?? this.renderRoot.querySelector('input');
    if (el instanceof HTMLInputElement) {
      el.indeterminate = this.indeterminate;
    }
  }

  #syncFormValue(): void {
    this.#internals.setFormValue(this.checked ? 'on' : null);
  }

  #onChange(ev: Event): void {
    const t = ev.target;
    if (!(t instanceof HTMLInputElement)) return;
    this.checked = t.checked;
    this.indeterminate = false;
    this.#applyIndeterminate();
    this.#syncFormValue();
    this.dispatchEvent(
      new CustomEvent<NexCheckboxChangeDetail>('nex-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    const rootClass = classNames('nex-checkbox', this.rootClass);
    return html`
      <!-- WCAG 3.3.2: wrapping label references the nested input by implicit association (and explicit for/id for SR symmetry). -->
      <label part="root" class="${rootClass}" ?data-disabled="${this.disabled}">
        <!-- WCAG 4.1.2: native input type=checkbox supplies role and checked state. -->
        <input
          part="control"
          id="${this.#fieldId}"
          type="checkbox"
          name="${this.name}"
          .checked="${this.checked}"
          ?disabled="${this.disabled}"
          @change="${(e: Event) => {
          this.#onChange(e);
        }}"
        />
        <!-- WCAG 1.3.1: visible label text is grouped with the control in the same label element. -->
        <span class="nex-checkbox__text"><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nex-checkbox': NexCheckbox;
  }
}

const tagName = 'nex-checkbox';

export function registerNexCheckbox(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, NexCheckbox);
  }
}

// DECISION LOG
// Problem: checkbox must match native semantics, token styling, and form posts without React.
// Options considered: (1) aria-checked on a div; (2) visually hidden native input; (3) styled native checkbox with accent-color token.
// Why I chose this: native checkbox + ElementInternals matches platform expectations and mirrors React NexuiCheckbox.
// Trade-off: slotted rich labels require consumers to style inline elements themselves—string-only `label` prop is omitted in favor of default slot text.
