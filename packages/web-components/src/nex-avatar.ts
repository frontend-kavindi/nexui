import { classNames } from '@nexui/utils';
import { ifDefined } from 'lit/directives/if-defined.js';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { CSSResultGroup } from 'lit';

export type NexAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type NexAvatarErrorDetail = { kind: 'image-error' };

const DIM: Record<NexAvatarSize, string> = {
  sm: 'var(--nexui-spacing-8)',
  md: 'var(--nexui-spacing-10)',
  lg: 'var(--nexui-spacing-12)',
  xl: 'var(--nexui-spacing-16)',
};

const FONT: Record<NexAvatarSize, string> = {
  sm: 'var(--nexui-typography-font-size-xs)',
  md: 'var(--nexui-typography-font-size-sm)',
  lg: 'var(--nexui-typography-font-size-md)',
  xl: 'var(--nexui-typography-font-size-lg)',
};

@customElement('nex-avatar')
export class NexAvatar extends LitElement {
  static styles: CSSResultGroup = css`
    :host {
      display: inline-block;
    }

    .nex-avatar {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--nexui-radius-full);
      overflow: hidden;
      flex-shrink: 0;
      background-color: var(--nexui-color-surface-sunken);
      color: var(--nexui-color-text-secondary);
      font-family: var(--nexui-typography-font-family-sans);
      font-weight: var(--nexui-typography-font-weight-semibold);
      line-height: var(--nexui-typography-line-height-tight);
      border-width: 1px;
      border-style: solid;
      border-color: var(--nexui-color-border-default);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .nex-avatar__fallback[hidden] {
      display: none;
    }
  `;

  @property({ type: String }) src = '';

  @property({ type: String }) alt = '';

  @property({ type: String, reflect: true }) size: NexAvatarSize = 'md';

  /** WCAG 1.1.1: names the entity when fallback text is non-text or needs override. */
  @property({ type: String, attribute: 'aria-label' }) ariaLabel = '';

  @property({ type: String, attribute: 'root-class' }) rootClass = '';

  @state() private imageFailed = false;

  protected override willUpdate(changed: PropertyValues<this>): void {
    if (changed.has('src')) {
      this.imageFailed = false;
    }
  }

  #onError(): void {
    this.imageFailed = true;
    this.dispatchEvent(
      new CustomEvent<NexAvatarErrorDetail>('nex-error', {
        bubbles: true,
        composed: true,
        detail: { kind: 'image-error' },
      }),
    );
  }

  protected render() {
    const showImg = this.src.length > 0 && !this.imageFailed;
    const className = classNames('nex-avatar', this.rootClass);
    const fallbackText = this.#fallbackSlotTextHint();
    const imgLabel = this.ariaLabel.length > 0 ? this.ariaLabel : fallbackText;

    return html`
      <div
        part="root"
        class="${className}"
        style="width:${DIM[this.size]};height:${DIM[this.size]};font-size:${FONT[this.size]}"
        role="${ifDefined(showImg ? undefined : 'img')}"
        aria-label="${ifDefined(showImg ? undefined : (imgLabel.length > 0 ? imgLabel : undefined))}"
      >
        ${showImg
          ? html`
              <img part="image" src="${this.src}" alt="${this.alt}" @error="${() => {
      this.#onError();
    }}" />
            `
          : null}
        <span class="nex-avatar__fallback" ?hidden="${showImg}" aria-hidden="true">
          <slot name="fallback"></slot>
        </span>
      </div>
    `;
  }

  #fallbackSlotTextHint(): string {
    const nodes = this.querySelectorAll(':scope > [slot="fallback"]');
    const parts: string[] = [];
    nodes.forEach((n) => {
      if (n.textContent) parts.push(n.textContent.trim());
    });
    return parts.join(' ').trim();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nex-avatar': NexAvatar;
  }
}

const tagName = 'nex-avatar';

export function registerNexAvatar(): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, NexAvatar);
  }
}

// DECISION LOG
// Problem: avatars need image + fallback with correct AT naming in both states.
// Options considered: (1) background-image only; (2) slot-only API; (3) img + slotted fallback with role=img when image absent.
// Why I chose this: matches React NexuiAvatar semantics and keeps a real <img> for alt when loaded.
// Trade-off: meaningful `aria-label` is required when fallback is not plain text; otherwise the image can be unnamed.
