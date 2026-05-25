import { Locator, Page } from '@playwright/test';
import { uploadFilePath } from '@utils/file-path';

export class UploadPage {

  readonly page: Page;

  readonly uploadInput : Locator;

  readonly uploadButton: Locator;

  readonly uploadedHeading: Locator;

  constructor(page: Page) {

    this.page = page;

    this.uploadInput =
      page.locator('#file-upload');

    this.uploadButton =
      page.getByRole('button', {
        name: 'Upload'
      });

    this.uploadedHeading =
      page.getByRole('heading', {
        name: 'File Uploaded!'
      });
  }

  async goto() {
    await this.page.goto('/upload');
  }

  async uploadFile() { // bỏ  path: string
    await this.uploadInput.setInputFiles(uploadFilePath);
    await this.uploadButton.click();{
  }
  }
}