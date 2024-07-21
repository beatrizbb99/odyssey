import { test, expect } from '@playwright/test';

test.describe('All Stories Scene Component', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/story');
    });


    test('should display the loading component initially', async ({ page }) => {
        await expect(page.locator('text=Loading...')).toBeVisible();
    });

    test('should click read a Story', async ({ page }) => {
        const readButton = page.locator('button:has-text("Read")').nth(0); 
        await expect(readButton).toBeVisible();

        // Klicke auf den Button
        await readButton.click();

        await expect(page).toHaveURL(/\/story\/[a-zA-Z0-9_-]+/, { timeout: 10000 });
    });

    test('should click edit a Story', async ({ page }) => {
        const editButton = page.locator('button:has-text("Edit")').nth(0); 
        await expect(editButton).toBeVisible();

        await editButton.click();

        await expect(page).toHaveURL(/\/edit\/[a-zA-Z0-9_-]+/);
    });

    test('should click create a Story', async ({ page }) => {
        page.getByRole('button', { name: '+ Erstellen' }).click();
        await expect(page).toHaveURL('http://localhost:3000/story/new');
    });

});
