import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { describe, expect, it } from 'bun:test';
GlobalRegistrator.register();
describe('dom environment', () => {
  it('registers happy-dom globals', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
  });
});
