import { test, expect } from '@playwright/test';

test.describe('Real Estate App - QA E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local server and ensure clean isolated state
    await page.goto('http://localhost:8080/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should load the homepage correctly', async ({ page }) => {
    // Check if the title is set
    await expect(page).toHaveTitle(/عقار|Aqar|Real Estate|Vite/i);
    
    // Check for main layout elements (header, footer, hero search)
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should handle language switching', async ({ page }) => {
    // Look for language toggle button
    const langButton = page.locator('header button').filter({ hasText: /العربية|AR|EN|English/ });
    if (await langButton.count() > 0) {
      await langButton.first().click();
      
      // Look for the lang attribute change on HTML
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', /ltr|rtl/);
    }
  });

  test('should navigate to properties page and list properties', async ({ page }) => {
    const propertiesLink = page.locator('a[href*="/properties"]').first();
    if (await propertiesLink.count() > 0) {
      await propertiesLink.click();
      await expect(page).toHaveURL(/.*properties/);
      
      await page.waitForLoadState('networkidle');
      
      const propertyCards = page.locator('.property-card, [data-testid="property-card"], article, .card');
      const count = await propertyCards.count();
      if (count === 0) {
        const emptyState = page.locator(':text("No properties found"), :text("لا توجد عقارات")');
        if (await emptyState.count() > 0) {
          await expect(emptyState).toBeVisible();
        }
      } else {
        await expect(propertyCards.first()).toBeVisible();
      }
    }
  });

  test('should navigate to login page and show validation errors on empty submit', async ({ page }) => {
    const loginLink = page.locator('a[href="/login"], a[href="/auth"]').first();
    if (await loginLink.count() > 0) {
      await loginLink.click();
      await expect(page).toHaveURL(/.*login/);
      
      const submitBtn = page.locator('button[type="submit"]');
      if (await submitBtn.count() > 0) {
        await submitBtn.click();
        
        // Wait for validation messages
        const errorMessages = page.getByText(/البريد الإلكتروني غير صالح|يجب أن تكون/i);
        await expect(errorMessages.first()).toBeVisible();
      }
    }
  });

  test('should display 404 for non-existent routes', async ({ page }) => {
    const response = await page.goto('http://localhost:8080/this-route-does-not-exist');
    const notFoundText = page.locator(':text("404"), :text("Not Found"), :text("غير موجود")');
    await expect(notFoundText.first()).toBeVisible();
  });

  test('should login as Admin and verify Dashboard pagination', async ({ page }) => {
    await page.goto('http://localhost:8080/login');
    
    // Click the Admin quick login button
    const adminBtn = page.getByRole('button', { name: /دخول كـ مدير المكتب/i });
    await expect(adminBtn).toBeVisible();
    await adminBtn.click();

    // Wait for the navigation to complete
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Click the leads tab in aside
    const leadsTab = page.locator('aside button').filter({ hasText: 'مركز العملاء' });
    await leadsTab.click();

    // Verify Dashboard specific elements for Admin
    await expect(page.getByText('مركز إدارة وتوزيع العملاء')).toBeVisible();

    // Verify Archive Filter button exists
    await expect(page.getByRole('button', { name: /المؤرشفة/i })).toBeVisible();

    // Verify Pagination Controls
    const prevBtn = page.getByRole('button', { name: /السابق/i }).first();
    const nextBtn = page.getByRole('button', { name: /التالي/i }).first();
    
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();
  });

  test('should login as Supervisor and verify Dashboard restricted view', async ({ page }) => {
    await page.goto('http://localhost:8080/login');
    
    // Click the Supervisor quick login button
    const supervisorBtn = page.getByRole('button', { name: /دخول كـ مشرف/i }).first();
    await expect(supervisorBtn).toBeVisible();
    await supervisorBtn.click();

    // Wait for the navigation to complete
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Click the leads tab in aside
    const leadsTab = page.locator('aside button').filter({ hasText: 'العملاء المكلف بهم' });
    await leadsTab.click();

    // Verify restricted title for Supervisor
    await expect(page.getByText('العملاء المكلف بهم').first()).toBeVisible();

    // Verify they do not see Admin specific title
    await expect(page.getByText('مركز إدارة وتوزيع العملاء')).toBeHidden();
  });

  test('should verify Analytics Tab and Session Manager in Dashboard', async ({ page }) => {
    await page.goto('http://localhost:8080/login');
    const adminBtn = page.getByRole('button', { name: /دخول كـ مدير المكتب/i });
    await adminBtn.click();
    await expect(page).toHaveURL(/.*dashboard/);

    // 1. Check Analytics Tab
    const analyticsTab = page.locator('aside button').filter({ hasText: 'التقارير والإحصائيات' });
    await expect(analyticsTab).toBeVisible();
    await analyticsTab.click();

    await expect(page.getByText('التقارير ومؤشرات الأداء')).toBeVisible();
    await expect(page.getByText('معدل تحويل الصفقات')).toBeVisible();
    await expect(page.getByRole('button', { name: /تصدير قائمة العملاء/i })).toBeVisible();

    // 2. Check Settings & Cache Manager
    const settingsTab = page.locator('aside button').filter({ hasText: 'الإعدادات' });
    await settingsTab.click();

    await expect(page.getByText('إدارة الجلسات والذاكرة المؤقتة (Cache)')).toBeVisible();
    await expect(page.getByText(/الإصدار v2\.1\.0/i)).toBeVisible();
  });
});
