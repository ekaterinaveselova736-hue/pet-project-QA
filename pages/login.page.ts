import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly inventoryContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.inventoryContainer = page.locator('.inventory_list');
  }

  async goto() {
    await this.navigate('/');
  }

  async login(username: string, password: string) {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  async loginAsStandardUser() {
    await this.login('standard_user', 'secret_sauce');
  }

  async loginAsLockedOutUser() {
    await this.login('locked_out_user', 'secret_sauce');
  }

  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage);
  }

  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  async isInventoryVisible(): Promise<boolean> {
    return await this.isVisible(this.inventoryContainer);
  }

  async clearLoginForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }
}