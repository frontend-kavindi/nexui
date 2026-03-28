import type { ComputedRef, InjectionKey, Ref, WritableComputedRef } from 'vue';

export type NexuiRadioGroupContext = {
  name: ComputedRef<string>;
  model: Ref<string> | WritableComputedRef<string>;
  setModel: (value: string) => void;
  disabled: Ref<boolean>;
};

export const nexuiRadioGroupKey: InjectionKey<NexuiRadioGroupContext> = Symbol('nexui-radio-group');
