# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: qa-test.spec.ts >> Real Estate App - QA E2E Tests >> should navigate to login page and show validation errors on empty submit
- Location: qa-test.spec.ts:60:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.text-red-500, [role="alert"], :text("Required")').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.text-red-500, [role="alert"], :text("Required")').first() with timeout 5000ms
  - waiting for locator('.text-red-500, [role="alert"], :text("Required")').first()

```

```yaml
- region "Notifications (F8)":
  - list
- region "Notifications alt+T"
- img "Property"
- text: عقار نظام إدارة العقارات والمشرفين
- blockquote: "\"نظام آمن يتيح للمكتب إدارة العقارات وتوزيع العملاء بدقة لمنع أي تعارض بين المشرفين.\""
- paragraph: منصة عقار المتطورة — مدعومة بقواعد بيانات Supabase
- link "عقار منصة عقار":
  - /url: /
- heading "تسجيل دخول فريق العمل" [level=1]
- paragraph: سجل دخولك كمدير للمكتب (Admin) أو كمشرف (Supervisor) لمتابعة العملاء المكلف بهم.
- text: البريد الإلكتروني
- textbox "name@aqar.com"
- paragraph: البريد الإلكتروني غير صالح
- text: كلمة المرور
- textbox "••••••••"
- button:
  - img
- paragraph: كلمة المرور يجب أن تكون 6 أحرف على الأقل
- button "تسجيل الدخول"
- paragraph: "الدخول السريع لتجربة الصلاحيات وتوزيع الـ Leads:"
- button "دخول كـ مدير المكتب (Admin) كامل الصلاحيات وتوزيع الـ Leads":
  - img
  - text: دخول كـ مدير المكتب (Admin) كامل الصلاحيات وتوزيع الـ Leads
- button "دخول كـ مشرف 1 (أحمد) يرى فقط الـ Leads المكلف بها":
  - img
  - text: دخول كـ مشرف 1 (أحمد) يرى فقط الـ Leads المكلف بها
- button "دخول كـ مشرفة 2 (سارة) قفل خاص لعملائها فقط":
  - img
  - text: دخول كـ مشرفة 2 (سارة) قفل خاص لعملائها فقط
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Real Estate App - QA E2E Tests', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Navigate to the local server
  6  |     await page.goto('http://localhost:8080/');
  7  |   });
  8  | 
  9  |   test('should load the homepage correctly', async ({ page }) => {
  10 |     // Check if the title is set (might be default Vite App or specific)
  11 |     await expect(page).toHaveTitle(/Vite|Aqar|Real Estate/i);
  12 |     
  13 |     // Check for main layout elements (header, footer, hero search)
  14 |     const header = page.locator('header');
  15 |     await expect(header).toBeVisible();
  16 |     
  17 |     const footer = page.locator('footer');
  18 |     await expect(footer).toBeVisible();
  19 |   });
  20 | 
  21 |   test('should handle language switching', async ({ page }) => {
  22 |     // Look for language toggle button
  23 |     // It's likely a button or dropdown in the header containing "العربية" or "English"
  24 |     const langButton = page.locator('header button').filter({ hasText: /العربية|AR|EN|English/ });
  25 |     if (await langButton.count() > 0) {
  26 |       await langButton.first().click();
  27 |       
  28 |       // Look for the lang attribute change on HTML
  29 |       const html = page.locator('html');
  30 |       await expect(html).toHaveAttribute('dir', /ltr|rtl/);
  31 |     }
  32 |   });
  33 | 
  34 |   test('should navigate to properties page and list properties', async ({ page }) => {
  35 |     // Try to find a link to the properties or search page
  36 |     const propertiesLink = page.locator('a[href*="/properties"]').first();
  37 |     if (await propertiesLink.count() > 0) {
  38 |       await propertiesLink.click();
  39 |       await expect(page).toHaveURL(/.*properties/);
  40 |       
  41 |       // Wait for properties to load
  42 |       // Real estate apps usually have cards or items for properties
  43 |       await page.waitForLoadState('networkidle');
  44 |       
  45 |       // Check if property cards exist
  46 |       const propertyCards = page.locator('.property-card, [data-testid="property-card"], article, .card');
  47 |       const count = await propertyCards.count();
  48 |       if (count === 0) {
  49 |         // If empty state, check if an empty message is shown
  50 |         const emptyState = page.locator(':text("No properties found"), :text("لا توجد عقارات")');
  51 |         if (await emptyState.count() > 0) {
  52 |           await expect(emptyState).toBeVisible();
  53 |         }
  54 |       } else {
  55 |         await expect(propertyCards.first()).toBeVisible();
  56 |       }
  57 |     }
  58 |   });
  59 | 
  60 |   test('should navigate to login page and show validation errors on empty submit', async ({ page }) => {
  61 |     const loginLink = page.locator('a[href="/login"], a[href="/auth"]').first();
  62 |     if (await loginLink.count() > 0) {
  63 |       await loginLink.click();
  64 |       await expect(page).toHaveURL(/.*login/);
  65 |       
  66 |       const submitBtn = page.locator('button[type="submit"]');
  67 |       if (await submitBtn.count() > 0) {
  68 |         await submitBtn.click();
  69 |         
  70 |         // Wait for validation messages
  71 |         const errorMessages = page.locator('.text-red-500, [role="alert"], :text("Required")');
> 72 |         await expect(errorMessages.first()).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  73 |       }
  74 |     }
  75 |   });
  76 | 
  77 |   test('should display 404 for non-existent routes', async ({ page }) => {
  78 |     const response = await page.goto('http://localhost:8080/this-route-does-not-exist');
  79 |     // Check if 404 page is rendered
  80 |     const notFoundText = page.locator(':text("404"), :text("Not Found"), :text("غير موجود")');
  81 |     await expect(notFoundText.first()).toBeVisible();
  82 |   });
  83 | });
  84 | 
```