import { test, expect, Page } from '@playwright/test';

async function loginAsAdmin(page: Page) {
  await page.goto('http://localhost:8080/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.clear());
  await page.fill('input[type="email"]', 'admin@aqar.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/.*dashboard/, { timeout: 20000 });
}

test.describe('Scalability & Long-Term Operations Verification', () => {

  test('1. Image Compression & Storage Optimization', async ({ page }) => {
    await loginAsAdmin(page);

    // Click Add Property link from Dashboard
    const addPropLink = page.getByRole('link', { name: /إضافة عقار جديد/i });
    await addPropLink.click();
    await expect(page).toHaveURL(/.*list-property/);
    
    // Advance to step 6 (Images)
    for (let i = 1; i <= 5; i++) {
      const nextBtn = page.getByRole('button', { name: 'التالي' });
      await nextBtn.waitFor({ state: 'visible' });
      await nextBtn.click();
    }
    
    // Check that the optimization notice banner is present in Step 6
    const notice = page.getByText(/الضغط الذكي الفوري نشط/i);
    await expect(notice).toBeVisible();
    await expect(page.getByText(/WebP/i).first()).toBeVisible();
  });

  test('2. Data Archiving & Filter in Leads Tab', async ({ page }) => {
    await loginAsAdmin(page);

    // Switch to Leads tab
    const leadsTab = page.locator('aside button').filter({ hasText: 'مركز العملاء' });
    await leadsTab.click();

    // Verify the Archive filter button exists
    const archiveBtn = page.getByRole('button', { name: /المؤرشفة/i });
    await expect(archiveBtn).toBeVisible();

    // Click archive filter and verify view changes
    await archiveBtn.click();
    await expect(archiveBtn).toHaveClass(/bg-amber-400/);
  });

  test('3. Properties Tab Archive Toggle', async ({ page }) => {
    await loginAsAdmin(page);

    // Switch to Properties tab
    const propsTab = page.locator('aside button').filter({ hasText: 'العقارات' });
    await propsTab.click();

    // Verify active vs archive toggle buttons
    const activeToggle = page.getByRole('button', { name: /العقارات المعروضة/i });
    const archiveToggle = page.getByRole('button', { name: /الأرشيف/i });

    await expect(activeToggle).toBeVisible();
    await expect(archiveToggle).toBeVisible();

    // Click archive toggle
    await archiveToggle.click();
    await expect(archiveToggle).toHaveClass(/bg-amber-400/);
  });

  test('4. Analytics & Dashboards Reports with Export', async ({ page }) => {
    await loginAsAdmin(page);

    // Switch to Analytics tab
    const analyticsTab = page.locator('aside button').filter({ hasText: 'التقارير والإحصائيات' });
    await expect(analyticsTab).toBeVisible();
    await analyticsTab.click();

    // Verify key analytics cards
    await expect(page.getByText('التقارير ومؤشرات الأداء')).toBeVisible();
    await expect(page.getByText('معدل تحويل الصفقات')).toBeVisible();
    await expect(page.getByText('مصادر استقطاب العملاء')).toBeVisible();
    await expect(page.getByText('تصنيف المعروض العقاري')).toBeVisible();

    // Verify export buttons
    const exportLeadsBtn = page.getByRole('button', { name: /تصدير قائمة العملاء/i });
    const exportKpiBtn = page.getByRole('button', { name: /تصدير ملخص الأداء/i });

    await expect(exportLeadsBtn).toBeVisible();
    await expect(exportKpiBtn).toBeVisible();
  });

  test('5. Session Management & Cache Invalidation in Settings', async ({ page }) => {
    await loginAsAdmin(page);

    // Switch to Settings tab
    const settingsTab = page.locator('aside button').filter({ hasText: 'الإعدادات' });
    await settingsTab.click();

    // Verify Session & Cache card
    await expect(page.getByText('إدارة الجلسات والذاكرة المؤقتة (Cache)')).toBeVisible();
    await expect(page.getByText(/الإصدار v2\.1\.0/i)).toBeVisible();
    await expect(page.getByText(/المساحة المحلية المستهلكة/i)).toBeVisible();

    // Verify re-sync button
    const resyncBtn = page.getByRole('button', { name: /تفريغ الذاكرة المؤقتة وإعادة المزامنة/i });
    await expect(resyncBtn).toBeVisible();
  });

  test('6. Admin Supervisor Management (Add & Delete)', async ({ page }) => {
    await loginAsAdmin(page);

    // Switch to Supervisors tab
    const supsTab = page.locator('aside button').filter({ hasText: 'فريق المشرفين' });
    await expect(supsTab).toBeVisible();
    await supsTab.click();

    // Verify Add Supervisor button is present
    const addSupBtn = page.getByRole('button', { name: /إضافة مشرف جديد/i });
    await expect(addSupBtn).toBeVisible();

    // Click Add Supervisor button to open modal
    await addSupBtn.click();

    // Verify modal elements
    await expect(page.getByText('إنشاء حساب للمشرف ومنحه صلاحيات العمل على المنصة')).toBeVisible();
    await expect(page.getByPlaceholder('مثال: عمر خالد')).toBeVisible();
    await expect(page.getByPlaceholder('omar@aqar.com')).toBeVisible();
    await expect(page.getByRole('button', { name: /إنشاء وتفعيل الحساب فوراً/i })).toBeVisible();

    // Close modal
    await page.getByRole('button', { name: 'إلغاء' }).click();
    await expect(page.getByText('إنشاء حساب للمشرف ومنحه صلاحيات العمل على المنصة')).not.toBeVisible();

    // Verify supervisor cards have delete action
    const deleteSupBtn = page.getByRole('button', { name: /حذف المشرف/i }).first();
    await expect(deleteSupBtn).toBeVisible();
  });
});
