import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
  private readonly productList: Locator;
  private readonly cartBadge: Locator;
  private readonly cartIcon: Locator;
  private readonly sortDropdown: Locator;
  private readonly burgerMenu: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productList = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async addToCart(productName: string) {
    const product = this.page.locator(`.inventory_item:has-text("${productName}")`);
    const addButton = product.locator('button');
    await addButton.click();
  }

  async addRandomProductToCart(): Promise<string> {
    const products = await this.productList.all();
    const randomIndex = Math.floor(Math.random() * products.length);
    const addButton = products[randomIndex].locator('button');
    await addButton.click();
    return await this.getProductName(randomIndex);
  }

  async getProductName(index: number): Promise<string> {
    const products = await this.productList.all();
    const nameElement = products[index].locator('.inventory_item_name');
    return await nameElement.textContent() || '';
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.textContent() || '0');
    }
    return 0;
  }

  async goToCart() {
    await this.clickElement(this.cartIcon);
  }

  async sortProductsBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.clickElement(this.sortDropdown);
    let value = '';
    switch(option) {
      case 'az': value = 'az'; break;
      case 'za': value = 'za'; break;
      case 'lohi': value = 'lohi'; break;
      case 'hilo': value = 'hilo'; break;
    }
    await this.sortDropdown.selectOption(value);
  }

  async logout() {
    await this.clickElement(this.burgerMenu);
    await this.page.waitForTimeout(500);
    await this.clickElement(this.logoutLink);
  }

  async getProductPrices(): Promise<number[]> {
    const priceElements = await this.page.locator('.inventory_item_price').all();
    const prices = [];
    for (const element of priceElements) {
      const priceText = await element.textContent() || '';
      const price = parseFloat(priceText.replace('$', ''));
      prices.push(price);
    }
    return prices;
  }
}