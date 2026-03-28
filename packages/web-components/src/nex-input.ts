import { classNames } from '@nexui/utils';
import { ifDefined } from 'lit/directives/if-defined.js';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultGroup } from 'lit';

/** Fired on every keystroke (`input`); composed so hosts in shadow roots can listen. */
export type NexInputInputEventDetail = { value: string };
/** Fired when the value is committed (`change`). */
export type NexInputChangeEventDetail = { value: string };

let nexInputUid = 0;

@customElement('nex-input')
export class NexInput extends LitElement {
  static formAssociated = true;

  static styles: CSSResultGroup = css`
    :host {
      display: block;
    }

    .nex-input {
      display: flex;
      flex-direction: column;
      gap: var(--nexui-spacing-1);
      font-family: var(--nexui-typography-font-family-sans);
      font-size: var(--nexui-typography-font-size-sm);
    }

    .nex-input__label {
      color: var(--nexui-color-text-primary);
      font-weight: var(--nexui-typography-font-weight-medium);
    }

    .nex-input__field {
      border-style: solid;
      border-width: 1px;
      border-radius: var(--nexui-radius-md);
      background-color: var(--nexui-color-surface-canvas);
      border-color: var(--nexui-color-border-default);
      box-shadow: none;
      padding-block: var(--nexui-spacing-2);
      padding-inline: var(--nexui-spacing-3);
      font: inherit;
      color: var(--nexui-color-text-primary);
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }

    .nex-input__field:focus {
      border-color: var(--nexui-color-border-focus);
      box-shadow: 0 0 0 2px var(--nexui-color-border-focus);
    }

    .nex-input--error .nex-input__field {
      border-color: var(--nexui-color-semantic-error-border);
      box-shadow: 0 0 0 1px var(--nexui-color-semantic-error-border);
    }

    .nex-input__helper {
      font-size: var(--nexui-typography-font-size-xs);
      color: var(--nexui-color-text-secondary);
    }

    /* role="alert" + text color keeps error text distinguishable without relying on color alone in story context (1.4.1). */
    .nex-input__error {
      font-size: var(--nexui-typography-font-size-xs);
      color: var(--nexui-color-semantic-error-fg);
    }
  `;

  @property({ type: String }) label = '';

  @property({ type: String }) helperText = '';

  @property({ type: Boolean, reflect: true }) error = false;

  @property({ type: String }) errorMessage = 'This field has an error.';

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: String }) placeholder = '';

  @property({ type: String }) name = '';

  /** Current value (two-way via events). */
  @property({ type: String }) value = '';

  @property({ type: String, reflect: true }) type: 'text' | 'password' | 'email' | 'search' | 'url' = 'text';

  @property({ type: String, attribute: 'root-class' }) rootClass = '';

  #internals: ElementInternals;

  #fieldId = '';

  constructor() {
    super();
    this.#internals = this.attachInternals();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.#fieldId) {
      nexInputUid += 1;
      this.#fieldId = `nex-input-${String(nexInputUid)}`;
    }
    this.#syncFormValue();
  }

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('value')) {
      this.#syncFormValue();
    }
  }

  #syncFormValue(): void {
    this.#internals.setFormValue(this.value.length > 0 ? this.value : null);
  }

  #onInput(ev: Event): void {
    const target = ev.target;
    if (!(target instanceof HTMLInputElement)) return;
    this.value = target.value;
    this.#syncFormValue();
    this.dispatchEvent(
      new CustomEvent<NexInputInputEventDetail>('nex-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onChange(ev: Event): void {
    const target = ev.target;
    if (!(target instanceof HTMLInputElement)) return;
    this.value = target.value;
    this.#syncFormValue();
    this.dispatchEvent(
      new CustomEvent<NexInputChangeEventDetail>('nex-change', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    const describedByParts: string[] = [];
    if (this.helperText) describedByParts.push(`${this.#fieldId}-helper`);
    if (this.error) describedByParts.push(`${this.#fieldId}-error`);
    const describedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

    const rootClass = classNames(
      'nex-input',
      this.error && 'nex-input--error',
      this.rootClass,
    );

    return html`
      <div part="root" class="${rootClass}">
        ${this.label
          ? html`
              <!-- WCAG 3.3.2 Labels or Instructions: explicit <label for> gives the control a programmatic name matching the visible label. -->
              <label class="nex-input__label" for="${this.#fieldId}">${this.label}</label>
            `
          : null}
        <!-- WCAG 3.3.1 Error Identification: aria-invalid signals validation failure to assistive tech when error is true. -->
        <input
          part="field"
          class="nex-input__field"
          id="${this.#fieldId}"
          name="${this.name}"
          type="${this.type}"
          placeholder="${this.placeholder}"
          .value="${this.value}"
          ?disabled="${this.disabled}"
          aria-invalid="${this.error ? 'true' : 'false'}"
          aria-describedby="${ifDefined(describedBy)}"
          @input="${(e: Event) => {
          this.#onInput(e);
        }}"
          @change="${(e: Event) => {
          this.#onChange(e);
        }}"
        />
        ${this.helperText
          ? html`
              <span class="nex-input__helper" id="${this.#fieldId}-helper">${this.helperText}</span>
            `
          : null}
        ${this.error
          ? html`
              <!-- WCAG 4.1.3 Status Messages: role=alert announces the error immediately when shown. -->
              <div class="nex-input__error" id="${this.#fieldId}-error" role="alert">${this.errorMessage}</div>
            `
          : null}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nex-input': NexInput;
  }
}

const tagName = 'nex-input';

export function registerNexInput(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, NexInput);
  }
}

// DECISION LOG
// Problem: text fields must stay form-participating while living in shadow DOM.
// Options considered: (1) light-DOM-only input slotted from host; (2) ElementInternals + formAssociated; (3) imperative form registration only.
// Why I chose this: ElementInternals.setFormValue matches platform form submission and keeps the NexUI chrome in shadow DOM.
// Trade-off: consumers need the typed `nex-input` / `nex-change` events for reactive frameworks; native `input`/`change` do not bubble across the shadow boundary without `composed` on our custom events (we compose them).
