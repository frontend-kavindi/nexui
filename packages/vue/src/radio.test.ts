import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NexuiRadio from './NexuiRadio.vue';
import NexuiRadioGroup from './NexuiRadioGroup.vue';

describe('NexuiRadioGroup', () => {
  it('coordinates selection via v-model', async () => {
    const wrapper = mount({
      components: { NexuiRadioGroup, NexuiRadio },
      template: `
        <NexuiRadioGroup v-model="picked" label="Pick">
          <NexuiRadio value="a" label="A" />
          <NexuiRadio value="b" label="B" />
        </NexuiRadioGroup>
      `,
      data: () => ({ picked: 'a' }),
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    const secondInput = inputs[1];
    if (secondInput) {
      await secondInput.setValue(true);
    }
    expect((wrapper.vm as unknown as { picked: string }).picked).toBe('b');
  });
});
