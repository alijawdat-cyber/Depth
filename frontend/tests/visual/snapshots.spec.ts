import { test, expect } from '@playwright/test';
import { DEVICE_MATRIX } from '../../src/shared/devices';

test.describe('Visual Snapshots 3-up', () => {
  for (const d of DEVICE_MATRIX) {
    test(`home page @ ${d.label}`, async ({ page }) => {
      await page.setViewportSize({ width: d.width, height: d.height ?? 900 });
      await page.goto('/');
      await expect(page).toHaveScreenshot({ fullPage: true });
    });
  }
});
