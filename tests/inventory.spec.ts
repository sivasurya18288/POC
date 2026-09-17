import { test, expect } from '@playwright/test';

test('Inventory Items Exist', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');

  await page.click('#login-button');

  const items = page.locator('.inventory_item');
  await expect(items).toHaveCount(6);
});