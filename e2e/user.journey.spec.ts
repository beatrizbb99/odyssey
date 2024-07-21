import { test, expect } from '@playwright/test';

test.describe('User Journey', () => {

    let storyId: string;

    test('should click on the "Go to Shelf" button', async ({ page }) => {
        await page.goto('http://localhost:3000');
        await expect(page.getByRole('button', { name: 'Go to Shelf' })).toBeVisible();
        await page.getByRole('button', { name: 'Go to Shelf' }).click();
        await expect(page).toHaveURL('http://localhost:3000/category/shelf', { timeout: 10000 });
    });

    test('should click on the "Alle Geschichten" button', async ({ page }) => {
        await page.goto('http://localhost:3000/category/shelf');
        await expect(page.getByRole('button', { name: 'Alle Geschichten' })).toBeVisible();
        await page.getByRole('button', { name: 'Alle Geschichten' }).click();
        await expect(page).toHaveURL('http://localhost:3000/story', { timeout: 10000 });
    });

    test('should click create a Story', async ({ page }) => {
        await page.goto('http://localhost:3000/story');
        page.getByRole('button', { name: '+ Erstellen' }).click();
        await expect(page).toHaveURL('http://localhost:3000/story/new');
    });

    test('should not fill out the story form and expect error', async ({ page }) => {
        await page.goto('http://localhost:3000/story/new');

        await expect(page.getByRole('button', { name: 'Save Story' })).toBeVisible();
        await page.getByRole('button', { name: 'Save Story' }).click();

        const errorMessage = page.locator('#errorMessage');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Bitte die angegebenen Felder füllen');
    });

    test('should fill out the story form and save', async ({ page }) => {
        await page.goto('http://localhost:3000/story/new');

        await page.getByLabel('Titel').fill('Neue Playwright Story');
        await page.getByLabel('Beschreibung').fill('Beschreibung');
        await page.check('input#Biografie');
        await page.check('input#Fantasie');

        await expect(page.getByRole('button', { name: 'Save Story' })).toBeVisible();
        await page.getByRole('button', { name: 'Save Story' }).click();
    
        await expect(page).toHaveURL(/\/edit\/[a-zA-Z0-9_-]+/);

        const url = page.url();
        const id = url.split('/').pop();
        if (!id) {
            throw new Error('Failed to extract story ID from URL');
        }
        storyId = id;

        console.log('Story ID:', storyId);
        expect(storyId).toMatch(/[a-zA-Z0-9_-]+/);
    });

    test('should save chapter in the story', async ({ page }) => {
        await page.goto(`http://localhost:3000/edit/${storyId}`);

        await page.locator('#chapterTitel').fill("Neuer Playwright Chapter");
        await page.locator('#chapterContent').fill("Chapter Content");

        await expect(page.getByRole('button', { name: 'Save Chapter' })).toBeVisible();
        await page.getByRole('button', { name: 'Save Chapter' }).click();
    
        await expect(page.locator('text=Kapitel 1 - Neuer Playwright Chapter')).toBeVisible();
    });

    test('should edit the story', async ({ page }) => {
        await page.goto(`http://localhost:3000/edit/${storyId}`);

        await expect(page.getByRole('button', { name: 'Details zur Geschichte' })).toBeVisible();
        await page.getByRole('button', { name: 'Details zur Geschichte' }).click();

        await expect(page.getByLabel('Titel')).toBeVisible();
        await page.getByLabel('Titel').fill('Bearbeitete Playwright Story');

        await expect(page.getByRole('button', { name: 'Save Story' })).toBeVisible();
        await page.getByRole('button', { name: 'Save Story' }).click();

        await expect(page.getByRole('button', { name: 'Kapitel' })).toBeVisible();
        await page.getByRole('button', { name: 'Kapitel' }).click();

        await expect(page.locator('text=Bearbeitete Playwright Story')).toBeVisible();
    });

    test('should click read a Story', async ({ page }) => {
        await page.goto(`http://localhost:3000/story`);
        const readButton = page.locator('button:has-text("Read")').nth(0);
        await expect(readButton).toBeVisible();
        await readButton.click();

        await expect(page).toHaveURL(/\/story\/[a-zA-Z0-9_-]+/);
    });
});
