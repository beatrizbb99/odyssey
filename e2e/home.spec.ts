import { test, expect } from '@playwright/test';


test.describe('HomePage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
    });

    test('should click on the "Go to Shelf" button', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Go to Shelf' })).toBeVisible();
        await page.getByRole('button', { name: 'Go to Shelf' }).click();
        await expect(page).toHaveURL('http://localhost:3000/category/shelf', { timeout: 10000 });
    });

});
