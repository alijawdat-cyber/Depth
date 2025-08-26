import { Page } from '@playwright/test';
import axeCore from 'axe-core';

declare global {
  interface Window { axe: typeof axeCore; }
}

export async function runAxe(page: Page) {
  // إدخال السكربت داخل الصفحة
  await page.addScriptTag({ content: axeCore.source });
  // تشغيل الفحص الافتراضي
  const results = await page.evaluate(async () => {
    return await window.axe.run();
  });
  return results as axeCore.AxeResults;
}
