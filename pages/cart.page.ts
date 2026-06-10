import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly cartItemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItemNames = page.locator('.inventory_item_name');
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async isProductInCart(productName: string): Promise<boolean> {
    const product = this.page.locator(`.cart_item:has-text("${productName}")`);
    return await product.isVisible();
  }

  async removeProduct(productName: string) {
    const product = this.page.locator(`.cart_item:has-text("${productName}")`);
    const removeButton = product.locator('button');
    await removeButton.click();
  }

  async removeProductByIndex(index: number) {
    const removeButtons = this.page.locator('.cart_button');
    await removeButtons.nth(index).click();
  }

  async clickCheckout() {
    await this.clickElement(this.checkoutButton);
  }

  async clickContinueShopping() {
    await this.clickElement(this.continueShoppingButton);
  }

  async getAllProductNames(): Promise<string[]> {
    const names = await this.cartItemNames.allTextContents();
    return names;
  }

  async clearCart() {
    const removeButtons = this.page.locator('.cart_button');
    const count = await removeButtons.count();
    for (let i = 0; i < count; i++) {
      await removeButtons.first().click();
      await this.page.waitForTimeout(500);
    }
  }
}