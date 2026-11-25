import { Page, Locator } from "@playwright/test";

export class InputFields {
  readonly page: Page;
  readonly editPetTypeLocator: Locator;
  readonly nameLocator: Locator;
  readonly updateBtnLocator: Locator;
  readonly cancelBtnLocator: Locator;
  readonly firstPetTypeInputLocator: Locator;
  readonly petTypeRowLocator: Locator;
  readonly petTypesLinkLocator: Locator;
  readonly titleLocator: Locator;
  readonly petHeadingLocator: Locator;
  readonly nameRequiredLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.editPetTypeLocator = page.getByRole('heading', { name: 'Edit Pet Type' });
    this.nameLocator = page.locator('#name');
    this.updateBtnLocator = page.getByRole('button', { name: 'Update' });
    this.firstPetTypeInputLocator = page.locator('[id="0"]');
    this.petTypeRowLocator = page.locator('[name="pettype_name"]');
    this.petTypesLinkLocator = page.getByRole('link', { name: 'Pet Types' });
    this.titleLocator = page.locator('.title');
    this.petHeadingLocator = page.getByRole('heading', { name: 'Pet Types' });
    this.cancelBtnLocator = page.getByRole('button', { name: 'Cancel' });
    this.nameRequiredLocator = page.getByText('Name is required');
  }
}