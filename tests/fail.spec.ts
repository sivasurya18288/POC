import { test, expect } from '@playwright/test';

test('Google Wrong Title', async ({ page }) => {

  await page.goto('https://www.google.com');

  await expect(page).toHaveTitle('My Google');
});