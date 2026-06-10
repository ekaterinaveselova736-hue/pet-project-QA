import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('@smoke Login with standard user should succeed', async () => {
    await loginPage.loginAsStandardUser();
    
    expect(await loginPage.isInventoryVisible()).toBeTruthy();
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('@regression Login with locked out user should show error', async () => {
    await loginPage.loginAsLockedOutUser();
    
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Sorry, this user has been locked out');
  });

  test('@regression Login with invalid credentials should show error', async () => {
    await loginPage.login('invalid_user', 'wrong_password');
    
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });

  test('@smoke Login with empty credentials should show error', async () => {
    await loginPage.login('', '');
    
    expect(await loginPage.isErrorMessageVisible()).toBeTruthy();
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });
});