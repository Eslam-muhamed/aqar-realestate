# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: qa-test.spec.ts >> Real Estate App - QA E2E Tests >> should load the homepage correctly
- Location: qa-test.spec.ts:9:3

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Vite|Aqar|Real Estate/i
Received string:  "عقار — منصة العقارات المميزة"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × locator resolved to <html dir="ltr" lang="en-US" class="dark">…</html>
       - unexpected value "عقار — منصة العقارات المميزة"

```

```yaml
- region "Notifications (F8)":
  - list
- region "Notifications alt+T"
- banner:
  - link "AMSH Real Estate":
    - /url: /
    - img
    - text: AMSH Real Estate
  - navigation:
    - link "Buy":
      - /url: /properties?status=for-sale
    - link "Rent":
      - /url: /properties?status=for-rent
    - link "Locations":
      - /url: /locations
    - link "Agents":
      - /url: /agents
    - link "About Us":
      - /url: /about
  - button "Toggle Theme":
    - img
  - button "العربية":
    - img
    - text: العربية
  - link "Search":
    - /url: /properties
    - img
  - link "Favorites":
    - /url: /favorites
    - img
  - link "Compare":
    - /url: /compare
    - img
  - link "Login":
    - /url: /login
- img "Premium Property"
- text: Find your next property
- heading "Find a place where you feel at home." [level=1]
- paragraph: Carefully selected properties in the places you care about, verified by experts who understand the Middle East market.
- button "شراء"
- button "استئجار"
- img
- combobox:
  - option "أي مدينة" [selected]
  - option "الرياض"
  - option "جدة"
  - option "دبي"
  - option "أبو ظبي"
  - option "الخبر"
  - option "القاهرة"
  - option "مسقط"
  - option "مدينة الكويت"
- img
- combobox:
  - option "نوع العقار" [selected]
  - option "فيلا"
  - option "شقة"
  - option "بنتهاوس"
  - option "تاون هاوس"
  - option "دوبلكس"
  - option "تجاري"
- button "Price Range (SAR)":
  - img
  - text: Price Range (SAR)
- img
- combobox:
  - option "غرف النوم" [selected]
  - option "استوديو"
  - option "+ 1 غرف"
  - option "+ 2 غرف"
  - option "+ 3 غرف"
  - option "+ 4 غرف"
  - option "+ 5 غرف"
  - option "+ 6 غرف"
- button "ابحث عن عقارات":
  - img
  - text: ابحث عن عقارات
- paragraph: 1,240+
- paragraph: Available Properties
- paragraph: 380+
- paragraph: Certified Agents
- paragraph: 4.2B
- paragraph: Properties Sold
- paragraph: "8"
- paragraph: Markets Covered
- paragraph: Carefully Selected
- heading "Featured Properties" [level=2]
- paragraph: Handpicked properties that deserve your attention.
- link "View all properties":
  - /url: /properties
  - text: View all properties
  - img
- link "فيلا فاخرة بتصميم عصري للبيع مميز حفظ في المفضلة مقارنة العقار Villa فيلا فاخرة بتصميم عصري حي الملقا, الرياض SAR 3,500,000 5 غرف 6 دورات مياه 450 m²":
  - /url: /property/luxury-villa-riyadh
  - img "فيلا فاخرة بتصميم عصري"
  - text: للبيع مميز
  - button "حفظ في المفضلة":
    - img
  - button "مقارنة العقار":
    - img
  - text: Villa
  - heading "فيلا فاخرة بتصميم عصري" [level=3]
  - img
  - img
  - text: حي الملقا, الرياض SAR 3,500,000
  - img
  - text: 5 غرف
  - img
  - text: 6 دورات مياه
  - img
  - text: 450 m²
- link "شقة حديثة بإطلالة بحرية للإيجار مميز حفظ في المفضلة مقارنة العقار Apartment شقة حديثة بإطلالة بحرية حي الشاطئ, جدة SAR 85,000سنوياً 3 غرف 3 دورات مياه 180 m²":
  - /url: /property/modern-apartment-jeddah
  - img "شقة حديثة بإطلالة بحرية"
  - text: للإيجار مميز
  - button "حفظ في المفضلة":
    - img
  - button "مقارنة العقار":
    - img
  - text: Apartment
  - heading "شقة حديثة بإطلالة بحرية" [level=3]
  - img
  - img
  - text: حي الشاطئ, جدة SAR 85,000سنوياً
  - img
  - text: 3 غرف
  - img
  - text: 3 دورات مياه
  - img
  - text: 180 m²
- link "بنتهاوس فاخر في دبي للبيع مميز حفظ في المفضلة مقارنة العقار Penthouse بنتهاوس فاخر في دبي دبي مارينا, دبي AED 12,500,000 4 غرف 5 دورات مياه 600 m²":
  - /url: /property/penthouse-dubai
  - img "بنتهاوس فاخر في دبي"
  - text: للبيع مميز
  - button "حفظ في المفضلة":
    - img
  - button "مقارنة العقار":
    - img
  - text: Penthouse
  - heading "بنتهاوس فاخر في دبي" [level=3]
  - img
  - img
  - text: دبي مارينا, دبي AED 12,500,000
  - img
  - text: 4 غرف
  - img
  - text: 5 دورات مياه
  - img
  - text: 600 m²
- img
- heading "Verified Properties" [level=3]
- paragraph: Every property is manually reviewed and verified by our team before being listed.
- img
- heading "Market Intelligence" [level=3]
- paragraph: Live pricing data and market trends to help you make informed decisions.
- img
- heading "Daily Updates" [level=3]
- paragraph: Our database is constantly updated so you always see the latest available properties.
- paragraph: Where we work
- heading "Top Locations" [level=2]
- link "All Locations":
  - /url: /locations
  - text: All Locations
  - img
- link "Riyadh Saudi Arabia Riyadh 248 Properties":
  - /url: /locations/riyadh
  - img "Riyadh"
  - img
  - text: Saudi Arabia
  - heading "Riyadh" [level=3]
  - paragraph: 248 Properties
- link "Jeddah Saudi Arabia Jeddah 186 Properties":
  - /url: /locations/jeddah
  - img "Jeddah"
  - img
  - text: Saudi Arabia
  - heading "Jeddah" [level=3]
  - paragraph: 186 Properties
- link "Dubai UAE Dubai 312 Properties":
  - /url: /locations/dubai
  - img "Dubai"
  - img
  - text: UAE
  - heading "Dubai" [level=3]
  - paragraph: 312 Properties
- link "Abu Dhabi UAE Abu Dhabi 124 Properties":
  - /url: /locations/abu-dhabi
  - img "Abu Dhabi"
  - img
  - text: UAE
  - heading "Abu Dhabi" [level=3]
  - paragraph: 124 Properties
- paragraph: Our Team
- heading "Top Consultants" [level=2]
- paragraph: Expert guidance from professionals who know every market deeply.
- link "All Agents":
  - /url: /agents
  - text: All Agents
  - img
- img "مدير المكتب"
- img
- heading "مدير المكتب" [level=3]
- paragraph: مدير المكتب
- img
- text: 5 (0 تقييم)
- img
- text: Aqar
- img
- text: المملكة
- img
- text: +966 50 000 0000
- paragraph: "0"
- paragraph: عقارات نشطة
- paragraph: "0"
- paragraph: مراجعات
- link "اتصال":
  - /url: tel:+966 50 000 0000
- link "عرض الملف":
  - /url: /agents/d6408dcf-b2c5-4193-a2b1-0afefa0b4a54
- img "مدير النظام (Admin)"
- img
- heading "مدير النظام (Admin)" [level=3]
- paragraph: مدير المكتب
- img
- text: 5 (0 تقييم)
- img
- text: Aqar
- img
- text: المملكة
- img
- text: "0500000001"
- paragraph: "0"
- paragraph: عقارات نشطة
- paragraph: "0"
- paragraph: مراجعات
- link "اتصال":
  - /url: tel:0500000001
- link "عرض الملف":
  - /url: /agents/2da14551-a367-4833-83f6-08d67f770376
- img "أحمد عبدالله"
- img
- heading "أحمد عبدالله" [level=3]
- paragraph: مستشار عقاري
- img
- text: 5 (0 تقييم)
- img
- text: Aqar
- img
- text: المملكة
- img
- text: "0500000002"
- paragraph: "0"
- paragraph: عقارات نشطة
- paragraph: "0"
- paragraph: مراجعات
- link "اتصال":
  - /url: tel:0500000002
- link "عرض الملف":
  - /url: /agents/f782878a-c3ef-4944-b139-4436de7bda27
- paragraph: For Property Owners
- heading "List your property with us." [level=2]
- paragraph: Reach thousands of qualified buyers and tenants. Our verified listing process ensures your property reaches serious, pre-screened clients.
- link "Contact an Agent":
  - /url: /agents
- img
- contentinfo:
  - img
  - text: AMSH Real Estate
  - paragraph: A curated platform for luxury residential properties across Saudi Arabia and the Middle East.
  - img
  - text: King Fahd Road, Riyadh 12211, Saudi Arabia
  - img
  - text: +966 11 000 0000
  - img
  - text: info@aqar.com
  - link:
    - /url: "#"
    - img
  - link:
    - /url: "#"
    - img
  - link:
    - /url: "#"
    - img
  - heading "Properties" [level=4]
  - list:
    - listitem:
      - link "Villas for Sale":
        - /url: /properties?type=villa
    - listitem:
      - link "Apartments":
        - /url: /properties?type=apartment
    - listitem:
      - link "Penthouses":
        - /url: /properties?type=penthouse
    - listitem:
      - link "For Rent":
        - /url: /properties?status=for-rent
    - listitem:
      - link "Latest Properties":
        - /url: /properties
  - heading "Company" [level=4]
  - list:
    - listitem:
      - link "About Aqar":
        - /url: /about
    - listitem:
      - link "Our Agents":
        - /url: /agents
    - listitem:
      - link "Locations":
        - /url: /locations
    - listitem:
      - link "Contact Us":
        - /url: /contact
  - heading "Legal" [level=4]
  - list:
    - listitem:
      - link "Privacy Policy":
        - /url: /
    - listitem:
      - link "Terms of Service":
        - /url: /
    - listitem:
      - link "Cookie Policy":
        - /url: /
  - paragraph: © 2026 Aqar. All rights reserved.
  - paragraph: Licensed by Real Estate General Authority · License No. REGA-2024-1054
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
> 11 |     await expect(page).toHaveTitle(/Vite|Aqar|Real Estate/i);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
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
  72 |         await expect(errorMessages.first()).toBeVisible();
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