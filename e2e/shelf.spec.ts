import { test, expect } from '@playwright/test';

test.describe('Shelf Scene Component', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/category/shelf');
  });


  test('should display the loading component initially', async ({ page }) => {
    await expect(page.locator('text=Loading...')).toBeVisible();
  });

  test('should click on the "Alle Geschichten" button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Alle Geschichten' })).toBeVisible();
    await page.getByRole('button', { name: 'Alle Geschichten' }).click();
    await expect(page).toHaveURL('http://localhost:3000/story');
  });

});
