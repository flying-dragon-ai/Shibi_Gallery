import { describe, expect, it } from 'vitest';
import { updateOrderStatusSchema, createOrderSchema } from '@shibi/shared';

describe('order schemas', () => {
  it('accepts a valid create order payload', () => {
    const parsed = createOrderSchema.parse({
      artworkId: '20000000-0000-0000-0000-000000000001',
      receiverName: '王女士',
      receiverPhone: '13800138000',
      address: '上海市徐汇区艺术街 1 号'
    });
    expect(parsed.receiverName).toBe('王女士');
  });

  it('rejects an invalid status', () => {
    expect(() => updateOrderStatusSchema.parse({ status: 'unknown' })).toThrow();
  });
});
