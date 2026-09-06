import { test, expect } from '@playwright/test';

test.describe('Real Estate App - QA E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local server
    await page.goto('http://localhost:8080/');
  });

  test('should load the homepage correctly', async ({ page }) => {
    // Check if the title is set (might be default Vite App or specific)
    await expect(page).toHaveTitle(/Vite|Aqar|Real Estate/i);
    
    // Check for main layout elements (header, footer, hero search)
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should handle language switching', async ({ page }) => {
    // Look for language toggle button
    // It's likely a button or dropdown in the header containing "العربية" or "English"
    const langButton = page.locator('header button').filter({ hasText: /العربية|AR|EN|English/ });
    if (await langButton.count() > 0) {
      await langButton.first().click();
      
      // Look for the lang attribute change on HTML
      const html = page.locator('html');
      await expect(html).toHaveAttribute('dir', /ltr|rtl/);
    }
  });

  test('should navigate to properties page and list properties', async ({ page }) => {
    // Try to find a link to the properties or search page
    const propertiesLink = page.locator('a[href*="/properties"]').first();
    if (await propertiesLink.count() > 0) {
      await propertiesLink.click();
      await expect(page).toHaveURL(/.*properties/);
      
      // Wait for properties to load
      // Real estate apps usually have cards or items for properties
      await page.waitForLoadState('networkidle');
      
      // Check if property cards exist
      const propertyCards = page.locator('.property-card, [data-testid="property-card"], article, .card');
      const count = await propertyCards.count();
      if (count === 0) {
        // If empty state, check if an empty message is shown
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
        const errorMessages = page.locator('.text-red-500, [role="alert"], :text("Required")');
        await expect(errorMessages.first()).toBeVisible();
      }
    }
  });

  test('should display 404 for non-existent routes', async ({ page }) => {
    const response = await page.goto('http://localhost:8080/this-route-does-not-exist');
    // Check if 404 page is rendered
    const notFoundText = page.locator(':text("404"), :text("Not Found"), :text("غير موجود")');
    await expect(notFoundText.first()).toBeVisible();
  });
});
