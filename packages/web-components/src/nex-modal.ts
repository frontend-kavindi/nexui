import { classNames } from '@nexui/utils';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { CSSResultGroup } from 'lit';

export type NexModalSize = 'sm' | 'md' | 'lg' | 'fullscreen';

export type NexModalCloseDetail = { reason: 'escape' | 'cancel' | 'backdrop' };

const WIDTH: Record<NexModalSize, string> = {
  sm: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-sm))',
  md: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-md))',
  lg: 'min(calc(100% - var(--nexui-spacing-8)), var(--nexui-breakpoint-lg))',
  fullscreen: 'calc(100% - var(--nexui-spacing-6))',
};

let nexModalUid = 0;

@customElement('nex-modal')
export class NexModal extends LitElement {
  static styles: CSSResultGroup = css`
    :host {
      display: contents;
    }

    dialog {
      border: none;
      padding: 0;
      background: transparent;
      max-width: none;
      max-height: none;
      margin: auto;
      z-index: var(--nexui-z-index-modal);
    }

    dialog::backdrop {
      background-color: var(--nexui-color-overlay-scrim);
      z-index: var(--nexui-z-index-modal-backdrop);
    }

    .nex-modal__panel {
      background-color: var(--nexui-color-surface-overlay);
      color: var(--nexui-color-text-primary);
      box-shadow: var(--nexui-shadow-xl);
      border-radius: var(--nexui-radius-lg);
      display: flex;
      flex-direction: column;
      gap: var(--nexui-spacing-4);
      padding: var(--nexui-spacing-6);
      overflow: auto;
      box-sizing: border-box;
      font-family: var(--nexui-typography-font-family-sans);
    }

    .nex-modal__panel[data-size='fullscreen'] {
      border-radius: var(--nexui-radius-none);
      height: calc(100% - var(--nexui-spacing-6));
    }

    .nex-modal__title {
      margin: 0;
      font-size: var(--nexui-typography-font-size-lg);
      font-weight: var(--nexui-typography-font-weight-semibold);
    }

    .nex-modal__body {
      font-size: var(--nexui-typography-font-size-sm);
      line-height: var(--nexui-typography-line-height-normal);
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;

  @property({ type: String, reflect: true }) size: NexModalSize = 'md';

  @property({ type: Boolean, reflect: true, attribute: 'close-on-backdrop' }) closeOnBackdropClick = true;

  @property({ type: String, attribute: 'root-class' }) rootClass = '';

  #titleId = '';

  #dialog: HTMLDialogElement | null = null;

  constructor() {
    super();
    nexModalUid += 1;
    this.#titleId = `nex-modal-title-${String(nexModalUid)}`;
  }

  protected override firstUpdated(_changed: PropertyValues<this>): void {
    const d = this.renderRoot.querySelector('dialog');
    if (d instanceof HTMLDialogElement) {
      this.#dialog = d;
      d.addEventListener('close', () => {
        if (this.open) {
          this.open = false;
        }
      });
    }
    this.#syncOpenState();
  }

  protected override updated(changed: PropertyValues<this>): void {
    if (changed.has('open')) {
      this.#syncOpenState();
    }
  }

  #syncOpenState(): void {
    const d = this.#dialog ?? this.renderRoot.querySelector('dialog');
    if (!(d instanceof HTMLDialogElement)) return;
    this.#dialog = d;
    if (this.open && !d.open) {
      d.showModal();
      return;
    }
    if (!this.open && d.open) {
      d.close();
    }
  }

  #onDialogCancel(ev: Event): void {
    ev.preventDefault();
    this.#emitClose({ reason: 'escape' });
  }

  #onPointerDown(ev: PointerEvent): void {
    if (!this.closeOnBackdropClick) return;
    const d = this.#dialog;
    if (!d) return;
    if (ev.target === d) {
      ev.preventDefault();
      this.#emitClose({ reason: 'backdrop' });
    }
  }

  #emitClose(detail: NexModalCloseDetail): void {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent<NexModalCloseDetail>('nex-close', {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Imperative API for consumers not using the `open` attribute. */
  showModal(): void {
    this.open = true;
  }

  close(): void {
    this.#emitClose({ reason: 'cancel' });
  }

  protected render() {
    const panelClass = classNames('nex-modal__panel', this.rootClass);
    const maxH =
      this.size === 'fullscreen'
        ? 'none'
        : 'min(90vh, calc(100% - var(--nexui-spacing-10)))';
    const height = this.size === 'fullscreen' ? 'calc(100% - var(--nexui-spacing-6))' : 'auto';

    return html`
      <!-- WCAG 4.1.2: aria-labelledby gives the dialog an accessible name from the visible title (supplements implicit dialog semantics in supporting UAs). -->
      <dialog
        part="dialog"
        aria-labelledby="${this.#titleId}"
        @cancel="${(e: Event) => {
          this.#onDialogCancel(e);
        }}"
        @pointerdown="${(e: PointerEvent) => {
          this.#onPointerDown(e);
        }}"
      >
        <div
          class="${panelClass}"
          data-size="${this.size}"
          style="width:${WIDTH[this.size]};max-height:${maxH};height:${height}"
          @pointerdown="${(e: PointerEvent) => {
          e.stopPropagation();
        }}"
        >
          <!-- WCAG 4.1.2: aria-labelledby ties the accessible name to the visual title (2.4.6). -->
          <h2 class="nex-modal__title" id="${this.#titleId}">
            <slot name="title"></slot>
          </h2>
          <div class="nex-modal__body">
            <slot></slot>
          </div>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nex-modal': NexModal;
  }
}

const tagName = 'nex-modal';

export function registerNexModal(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, NexModal);
  }
}

// DECISION LOG
// Problem: accessible modal focus management + backdrop without shipping focus-trap-react in WC.
// Options considered: (1) imperative div + manual focus loop; (2) <dialog showModal>; (3) inert polyfill on body.
// Why I chose this: `<dialog>` provides user-agent focus trapping, Escape handling hooks, and backdrop in one platform primitive.
// Trade-off: older browsers need the dialog polyfill for identical behavior—NexUI assumes evergreen enterprise baselines.
