# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-scalability.spec.ts >> Scalability & Long-Term Operations Verification >> 3. Properties Tab Archive Toggle
- Location: e2e-scalability.spec.ts:51:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.goto: Test timeout of 30000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/login", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | async function loginAsAdmin(page: Page) {
> 4   |   await page.goto('http://localhost:8080/login', { waitUntil: 'domcontentloaded' });
      |              ^ Error: page.goto: Test timeout of 30000ms exceeded.
  5   |   await page.evaluate(() => localStorage.clear());
  6   |   const adminBtn = page.getByRole('button', { name: /دخول كـ مدير المكتب/i });
  7   |   await adminBtn.waitFor({ state: 'visible' });
  8   |   await adminBtn.click();
  9   |   await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });
  10  | }
  11  | 
  12  | test.describe('Scalability & Long-Term Operations Verification', () => {
  13  | 
  14  |   test('1. Image Compression & Storage Optimization', async ({ page }) => {
  15  |     await loginAsAdmin(page);
  16  | 
  17  |     // Click Add Property link from Dashboard
  18  |     const addPropLink = page.getByRole('link', { name: /إضافة عقار جديد/i });
  19  |     await addPropLink.click();
  20  |     await expect(page).toHaveURL(/.*list-property/);
  21  |     
  22  |     // Advance to step 6 (Images)
  23  |     for (let i = 1; i <= 5; i++) {
  24  |       const nextBtn = page.getByRole('button', { name: 'التالي' });
  25  |       await nextBtn.waitFor({ state: 'visible' });
  26  |       await nextBtn.click();
  27  |     }
  28  |     
  29  |     // Check that the optimization notice banner is present in Step 6
  30  |     const notice = page.getByText(/الضغط الذكي الفوري نشط/i);
  31  |     await expect(notice).toBeVisible();
  32  |     await expect(page.getByText(/WebP/i).first()).toBeVisible();
  33  |   });
  34  | 
  35  |   test('2. Data Archiving & Filter in Leads Tab', async ({ page }) => {
  36  |     await loginAsAdmin(page);
  37  | 
  38  |     // Switch to Leads tab
  39  |     const leadsTab = page.locator('aside button').filter({ hasText: 'مركز العملاء' });
  40  |     await leadsTab.click();
  41  | 
  42  |     // Verify the Archive filter button exists
  43  |     const archiveBtn = page.getByRole('button', { name: /المؤرشفة/i });
  44  |     await expect(archiveBtn).toBeVisible();
  45  | 
  46  |     // Click archive filter and verify view changes
  47  |     await archiveBtn.click();
  48  |     await expect(archiveBtn).toHaveClass(/bg-amber-400/);
  49  |   });
  50  | 
  51  |   test('3. Properties Tab Archive Toggle', async ({ page }) => {
  52  |     await loginAsAdmin(page);
  53  | 
  54  |     // Switch to Properties tab
  55  |     const propsTab = page.locator('aside button').filter({ hasText: 'العقارات' });
  56  |     await propsTab.click();
  57  | 
  58  |     // Verify active vs archive toggle buttons
  59  |     const activeToggle = page.getByRole('button', { name: /العقارات المعروضة/i });
  60  |     const archiveToggle = page.getByRole('button', { name: /الأرشيف/i });
  61  | 
  62  |     await expect(activeToggle).toBeVisible();
  63  |     await expect(archiveToggle).toBeVisible();
  64  | 
  65  |     // Click archive toggle
  66  |     await archiveToggle.click();
  67  |     await expect(archiveToggle).toHaveClass(/bg-amber-400/);
  68  |   });
  69  | 
  70  |   test('4. Analytics & Dashboards Reports with Export', async ({ page }) => {
  71  |     await loginAsAdmin(page);
  72  | 
  73  |     // Switch to Analytics tab
  74  |     const analyticsTab = page.locator('aside button').filter({ hasText: 'التقارير والإحصائيات' });
  75  |     await expect(analyticsTab).toBeVisible();
  76  |     await analyticsTab.click();
  77  | 
  78  |     // Verify key analytics cards
  79  |     await expect(page.getByText('التقارير ومؤشرات الأداء')).toBeVisible();
  80  |     await expect(page.getByText('معدل تحويل الصفقات')).toBeVisible();
  81  |     await expect(page.getByText('مصادر استقطاب العملاء')).toBeVisible();
  82  |     await expect(page.getByText('تصنيف المعروض العقاري')).toBeVisible();
  83  | 
  84  |     // Verify export buttons
  85  |     const exportLeadsBtn = page.getByRole('button', { name: /تصدير قائمة العملاء/i });
  86  |     const exportKpiBtn = page.getByRole('button', { name: /تصدير ملخص الأداء/i });
  87  | 
  88  |     await expect(exportLeadsBtn).toBeVisible();
  89  |     await expect(exportKpiBtn).toBeVisible();
  90  |   });
  91  | 
  92  |   test('5. Session Management & Cache Invalidation in Settings', async ({ page }) => {
  93  |     await loginAsAdmin(page);
  94  | 
  95  |     // Switch to Settings tab
  96  |     const settingsTab = page.locator('aside button').filter({ hasText: 'الإعدادات' });
  97  |     await settingsTab.click();
  98  | 
  99  |     // Verify Session & Cache card
  100 |     await expect(page.getByText('إدارة الجلسات والذاكرة المؤقتة (Cache)')).toBeVisible();
  101 |     await expect(page.getByText(/الإصدار v2\.1\.0/i)).toBeVisible();
  102 |     await expect(page.getByText(/المساحة المحلية المستهلكة/i)).toBeVisible();
  103 | 
  104 |     // Verify re-sync button
```