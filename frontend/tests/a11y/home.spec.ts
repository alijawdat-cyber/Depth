import { test, expect } from '@playwright/test';
import { runAxe } from './axe-helper';

test('الصفحة الرئيسية خالية من مخالفات a11y الحرجة', async ({ page }) => {
  await page.goto('/');
  const results = await runAxe(page);
  const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
  // توثيق النتائج في لقطات سجل
  test.info().attach('axe-violations', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
  expect(critical, `وجدنا مخالفات حرجة: ${critical.map(v=>v.id).join(', ')}`).toHaveLength(0);
});
