import { inject } from 'vue';
import type { NexuiToastApi } from './toastTypes';
import { nexuiToastInjectionKey } from './nexuiToastInjection';

export function useNexuiToast(): NexuiToastApi {
  const ctx = inject(nexuiToastInjectionKey);
  if (!ctx) {
    throw new Error('useNexuiToast must be used within NexuiToastProvider');
  }
  return ctx;
}
