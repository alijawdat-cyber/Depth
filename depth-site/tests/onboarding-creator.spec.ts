import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `creator_e2e_${Date.now()}_${Math.floor(Math.random()*1e6)}@example.com`;
}

test.describe('Creator Onboarding Full Flow', () => {
  test('complete onboarding steps and submit', async ({ page }) => {
    test.setTimeout(180_000);
    const email = uniqueEmail();
    const password = 'DemoPass123!';

    await page.goto('/creators/onboarding');

    // STEP 1
    await page.getByLabel('الاسم الكامل').fill('Playwright Creator');
    await page.getByLabel('البريد الإلكتروني').fill(email);
    await page.getByLabel('رقم الهاتف/واتساب').fill('0794444444');
    await page.getByLabel('كلمة المرور').fill(password);
    await page.getByLabel('تأكيد كلمة المرور').fill(password);
    await page.getByText('أوافق على شروط الخدمة').click();

    const possibleNext = page.getByRole('button', { name: /التالي|استمرار|متابعة|Continue/i });
    if (await possibleNext.count()) {
      await possibleNext.first().click();
    } else {
      const btns = page.locator('button');
      const total = await btns.count();
      for (let i=0;i<total;i++) {
        const txt = (await btns.nth(i).innerText()).trim();
        if (/التالي|استمرار|متابعة/i.test(txt)) { await btns.nth(i).click(); break; }
      }
    }

    await expect(page.getByText('المعلومات الأساسية')).toBeVisible({ timeout: 20000 });

    // STEP 2
    await page.getByLabel('المدينة').fill('Baghdad');
    const catBtn = page.locator('button:has-text("تصوير"), button:has-text("فيديو"), button:has-text("تصميم")').first();
    if (await catBtn.count()) await catBtn.click();
    await possibleNext.first().click();
    await expect(page.getByText('خبرتك ومهاراتك والمعدات')).toBeVisible();

    // STEP 3
    const levelSelect = page.getByLabel('مستوى خبرتك');
    if (await levelSelect.count()) {
      await levelSelect.click();
      const midOpt = page.getByRole('option', { name: /متوسط|intermediate/i }).first();
      if (await midOpt.count()) await midOpt.click();
    }
    await possibleNext.first().click();
    await expect(page.getByText('معرض أعمالك')).toBeVisible();

    // STEP 4
    await possibleNext.first().click();
    await expect(page.getByText('التوفر والجدولة')).toBeVisible();

    // STEP 5
    const flexible = page.getByText('مرن', { exact: true }).first();
    if (await flexible.count()) await flexible.click();
    const hours = page.getByLabel('عدد الساعات الأسبوعية');
    if (await hours.count()) { await hours.fill('25'); }
    const sunday = page.getByText('الأحد', { exact: true }).first();
    if (await sunday.count()) await sunday.click();

    const submitBtn = page.getByRole('button', { name: /إرسال|إكمال|إنهاء|اكتمال|تم/i });
    if (await submitBtn.count()) {
      await submitBtn.first().click();
    } else {
      const allBtns = page.locator('button');
      const total = await allBtns.count();
      await allBtns.nth(total - 1).click();
    }

    await expect(
      page.locator('text=تم إنشاء حسابك').or(page.locator('text=تم تحديث ملفك'))
    ).toBeVisible({ timeout: 30000 });
  });
});
