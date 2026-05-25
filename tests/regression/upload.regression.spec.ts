import { test,expect } from '@fixtures/auth.fixture';
import { UploadPage } from '@pages/UploadPage';

test.describe(
  'Regression - Upload', () => {   
    test('user can upload file', async ({ page }) => {
      const uploadPage = new UploadPage(page);
      await uploadPage.goto();

      await uploadPage.uploadFile();
      await expect(uploadPage.uploadedHeading).toBeVisible(); // await expect(page.locator('h3')).toHaveText('File Uploaded!');
    });
  });
