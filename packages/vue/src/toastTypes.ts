import type { Ref } from 'vue';

export type NexuiToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type NexuiToastTone = 'default' | 'success' | 'error' | 'warning';

export type NexuiToastDurationPreset = 'fast' | 'normal' | 'slow';

export type NexuiToastInput = {
  title: string;
  description?: string;
  position?: NexuiToastPosition;
  tone?: NexuiToastTone;
  duration?: NexuiToastDurationPreset;
  id?: string;
};

export type NexuiToastRecord = NexuiToastInput & {
  id: string;
  createdAt: number;
};

export type NexuiToastApi = {
  /** Reactive list; safe to use directly in `<template>`. */
  toasts: Ref<NexuiToastRecord[]>;
  push: (toast: NexuiToastInput) => string;
  dismiss: (id: string) => void;
};
