import { registerNexuiButton } from './nexui-button';
import { registerNexAvatar } from './nex-avatar';
import { registerNexBadge } from './nex-badge';
import { registerNexCheckbox } from './nex-checkbox';
import { registerNexInput } from './nex-input';
import { registerNexModal } from './nex-modal';

export { NexuiButton, registerNexuiButton } from './nexui-button';
export {
  NexAvatar,
  registerNexAvatar,
  type NexAvatarErrorDetail,
  type NexAvatarSize,
} from './nex-avatar';
export { NexBadge, registerNexBadge, type NexBadgeTone } from './nex-badge';
export { NexCheckbox, registerNexCheckbox, type NexCheckboxChangeDetail } from './nex-checkbox';
export {
  NexInput,
  registerNexInput,
  type NexInputChangeEventDetail,
  type NexInputInputEventDetail,
} from './nex-input';
export { NexModal, registerNexModal, type NexModalCloseDetail, type NexModalSize } from './nex-modal';

/** Registers every custom element once (safe to call in app bootstrap or Storybook). */
export function registerNexuiWebComponents(): void {
  registerNexuiButton();
  registerNexInput();
  registerNexBadge();
  registerNexAvatar();
  registerNexModal();
  registerNexCheckbox();
}
