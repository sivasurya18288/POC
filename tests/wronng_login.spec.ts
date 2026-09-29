import { test, expect } from '@playwright/test';

test('Invalid Login Expect Success', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/');

  await page.fill('#user-name', 'wrong_user');
  await page.fill('#password', 'wrong_password');

  await page.click('#login-button');

  await expect(page).toHaveURL(/inventory/);
});