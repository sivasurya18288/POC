import { test, expect } from '@playwright/test';

test('Google Search Page Opens', async ({ page }) => {
  await page.goto('https://www.google.com');

  await expect(page).toHaveTitle(/Google/);

  await page.locator('textarea[name="q"]').click();

  console.log('Google page opened successfully');
});


