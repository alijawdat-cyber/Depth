import { test, expect } from '@playwright/test';

// Visual snapshots for focus, inputs sizes, and table densities

test.describe('Visual states', () => {
  test('focus-visible outlines and controls', async ({ page }) => {
    await page.goto('/visual');
    await expect(page.getByTestId('visual-root')).toBeVisible();

    // Focus buttons and inputs to capture focus-visible style
    await page.getByTestId('btn-filled').focus();
    await page.getByTestId('btn-outline').focus();
    await page.getByTestId('btn-transparent').focus();
    await page.getByTestId('input-md').focus();
    await page.getByTestId('select-md').focus();
    await page.getByTestId('textarea').focus();

  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot('focus-visible.png');
  });

  test('inputs size map enforced', async ({ page }) => {
    await page.goto('/visual');
    const sm = page.getByTestId('input-sm');
    const md = page.getByTestId('input-md');
    const lg = page.getByTestId('input-lg');

    // Check computed heights roughly match tokens (36, 44, 52)
    const [hSm, hMd, hLg] = await Promise.all([sm, md, lg].map(async (el) => (await el.boundingBox())?.height ?? 0));

    expect(hSm).toBeGreaterThan(30);
  expect(hMd).toBeGreaterThanOrEqual(hSm);
  expect(hLg).toBeGreaterThanOrEqual(hMd);

  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot('inputs-sizes.png');
  });

  test('table compact density and wide mode', async ({ page }) => {
    await page.goto('/visual');
    await expect(page.getByTestId('table')).toBeVisible();
  await page.waitForTimeout(100);
  await expect(page).toHaveScreenshot('table-compact.png');
  });
});
