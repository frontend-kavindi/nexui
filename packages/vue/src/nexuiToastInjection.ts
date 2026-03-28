import type { InjectionKey } from 'vue';
import type { NexuiToastApi } from './toastTypes';

export const nexuiToastInjectionKey: InjectionKey<NexuiToastApi> = Symbol('nexui-toast');
