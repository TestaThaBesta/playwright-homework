import { test, expect } from '@playwright/test';
import { InputFields } from '../shared-elements/input-fields';

test.beforeEach(async ({ page }) => {
    const inputFields = new InputFields(page);
    await page.goto('/')
    await expect(inputFields.titleLocator).toHaveText('Welcome to Petclinic')
    await inputFields.petTypesLinkLocator.click();
    const petHeading = await inputFields.petHeadingLocator;
    await expect(petHeading).toHaveText('Pet Types');
    await expect(inputFields.petTypeRowLocator).toHaveCount(6);
});

test('Update Pet Type', async ({ page }) => {
    const inputFields = new InputFields(page);

    //change cat pet type to rabbit
    const rowCount = await inputFields.petTypeRowLocator.count();
    for (let i = 1; i < rowCount + 1; i++) {
        let index = rowCount - i
        const petTypes = await page.locator(`[id="${index}"]`).inputValue();
        if (petTypes === 'cat') {
            await page.getByRole('button', { name: 'Edit' }).nth(index).click();
            break;
        }
    }
    await expect(inputFields.editPetTypeLocator).toHaveText('Edit Pet Type');
    await expect(inputFields.nameLocator).toHaveValue('cat');
    await page.waitForLoadState('networkidle');
    await inputFields.nameLocator.fill('rabbit');
    await expect(inputFields.nameLocator).toHaveValue('rabbit');
    await inputFields.updateBtnLocator.click();
    await expect(inputFields.firstPetTypeInputLocator).toHaveValue('rabbit');

    // Restore to the cat pet type
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await expect(inputFields.editPetTypeLocator).toHaveText('Edit Pet Type');
    await expect(inputFields.nameLocator).toHaveValue('rabbit');
    await inputFields.nameLocator.fill('cat');
    await expect(inputFields.nameLocator).toHaveValue('cat');
    await inputFields.updateBtnLocator.click();
    await expect(inputFields.firstPetTypeInputLocator).toHaveValue('cat');
});

test('Cancel Pet Type Update', async ({ page }) => {
    const inputFields = new InputFields(page);
    let rowCount = await inputFields.petTypeRowLocator.count();

    for (let i = 1; i < rowCount + 1; i++) {
        let index = rowCount - i
        const petTypes = await page.locator(`[id="${index}"]`).inputValue();
        if (petTypes === 'dog') {
            await page.getByRole('button', { name: 'Edit' }).nth(index).click();
            break;
        }
    }
    await expect(inputFields.editPetTypeLocator).toHaveText('Edit Pet Type');
    await expect(inputFields.nameLocator).toHaveValue('dog');
    await page.waitForLoadState('networkidle');
    await inputFields.nameLocator.fill('moose');
    await expect(inputFields.nameLocator).toHaveValue('moose');
    await inputFields.cancelBtnLocator.click();

    await expect(inputFields.petTypeRowLocator).toHaveCount(6);
    rowCount = await inputFields.petTypeRowLocator.count();
    const detectedValues = [];
    for (let i = 1; i < rowCount + 1; i++) {
        let index = rowCount - i
        const petTypes = await page.locator(`[id="${index}"]`).inputValue();
        detectedValues.push(petTypes);
    };
    expect(detectedValues).toContain('dog');
    expect(detectedValues).not.toContain('moose');
});

test('Validation of Pet Type Name is Required', async ({ page }) => {
    const inputFields = new InputFields(page);
    let rowCount = await inputFields.petTypeRowLocator.count();

    for (let i = 1; i < rowCount + 1; i++) {
        let index = rowCount - i
        const petTypes = await page.locator(`[id="${index}"]`).inputValue();
        if (petTypes === 'lizard') {
            await page.getByRole('button', { name: 'Edit' }).nth(index).click();
            break;
        }
    }
    await expect(inputFields.editPetTypeLocator).toHaveText('Edit Pet Type');
    await expect(inputFields.nameLocator).toHaveValue('lizard');
    await inputFields.nameLocator.clear();
    await expect(inputFields.nameRequiredLocator).toHaveText('Name is required');
    await inputFields.updateBtnLocator.click();
    await expect(inputFields.editPetTypeLocator).toHaveText('Edit Pet Type');
    await expect(page).toHaveURL(/edit/);
    await inputFields.cancelBtnLocator.click();
    await expect(inputFields.petHeadingLocator).toHaveText('Pet Types');
});