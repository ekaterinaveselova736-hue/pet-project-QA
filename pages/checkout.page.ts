import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;
  private readonly totalAmount: Locator;
  private readonly subtotalAmount: Locator;
  private readonly taxAmount: Locator;
  private readonly successMessage: Locator;
  private readonly successContainer: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.totalAmount = page.locator('.summary_total_label');
    this.subtotalAmount = page.locator('.summary_subtotal_label');
    this.taxAmount = page.locator('.summary_tax_label');
    this.successMessage = page.locator('.complete-header');
    this.successContainer = page.locator('#checkout_complete_container');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.fillInput(this.postalCodeInput, postalCode);
  }

  async continueToOverview() {
    await this.clickElement(this.continueButton);
  }

  async finishPurchase() {
    await this.clickElement(this.finishButton);
  }

  async cancelCheckout() {
    await this.clickElement(this.cancelButton);
  }

  async getTotalAmount(): Promise<number> {
    const totalText = await this.getText(this.totalAmount);
    const match = totalText.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getSubtotalAmount(): Promise<number> {
    const subtotalText = await this.getText(this.subtotalAmount);
    const match = subtotalText.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getTaxAmount(): Promise<number> {
    const taxText = await this.getText(this.taxAmount);
    const match = taxText.match(/\$([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async isOrderComplete(): Promise<boolean> {
    return await this.isVisible(this.successContainer);
  }

  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage);
  }

  async clickBackHome() {
    await this.clickElement(this.backHomeButton);
  }

  async verifyTotalCalculation(): Promise<boolean> {
    const subtotal = await this.getSubtotalAmount();
    const tax = await this.getTaxAmount();
    const total = await this.getTotalAmount();
    return Math.abs((subtotal + tax) - total) < 0.01;
  }
}