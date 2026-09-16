import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';

test('Playwright + PAD Demo', async ({ page }) => {

  // Overall test timeout
  test.setTimeout(360000);

  // STEP 1: Open website
  await page.goto('https://www.saucedemo.com/');

  // STEP 2: Login
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Verify login successful
  await expect(page.locator('.title')).toHaveText('Products');
  console.log('Logged into SauceDemo successfully');

  // STEP 3: Define PAD completion file
  const completionFile =
    'C:\\Users\\sssurya\\OneDrive - Capgemini\\CASY\\POC\\PAD_COMPLETED.txt';

  // STEP 4: Delete old completion file
  if (fs.existsSync(completionFile)) {
    fs.unlinkSync(completionFile);
    console.log('Old PAD completion file deleted');
  }

  // STEP 5: Launch PAD
  console.log('Launching PAD...');

  execSync(
    `start "" "ms-powerautomate:/console/flow/run?environmentid=Default-76a2ae5a-9f00-4f6b-95ed-5d33d77c4d61&workflowid=04483d46-3023-4ea1-bedc-54e782e72548&source=Other"`,
    {
      shell: 'cmd.exe'
    }
  );

  console.log('PAD launched');

  // STEP 6: Wait for PAD completion
  console.log('Waiting for PAD completion...');

  const timeout = 5 * 60 * 1000; // 5 mins
  const pollInterval = 2000; // 2 secs
  const startTime = Date.now();

  let padCompleted = false;

  while (Date.now() - startTime < timeout) {
    if (fs.existsSync(completionFile)) {

      // Read UTF-16 file created by PAD
      const content = fs.readFileSync(completionFile, 'utf16le').replace(/\uFEFF/g, '').trim();
      console.log(`PAD File Content: ${content}`);

      // Normalize string
      const normalizedContent = content.replace(/\s/g, '').toUpperCase();
      console.log(`Normalized Content: ${normalizedContent}`);
      if (normalizedContent === 'STATUS=COMPLETED') {
        console.log('PAD completed successfully');
        padCompleted = true;
        break;
      }
    }
    await page.waitForTimeout(pollInterval);
  }
  console.log(`padCompleted = ${padCompleted}`);
  // STEP 7: Validate PAD completion
  expect(padCompleted,'PAD did not complete within 5 minutes').toBe(true);

  // STEP 8: Continue Playwright actions
  console.log('Continuing Playwright execution...');

  // Add backpack
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Open cart
  await page.locator('.shopping_cart_link').click();

  // Validate cart
  await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
  console.log('Backpack validation successful');
  console.log('POC IS SUCCESS');
  console.log('WEB+PAD Integration Successful')
});