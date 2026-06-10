import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

test.describe('E2E: Complete Purchase Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    
    await loginPage.goto();
    await loginPage.loginAsStandardUser();
  });

  test('@smoke User can complete full purchase', async () => {
    // Add product to cart
    await inventoryPage.addToCart('Sauce Labs Backpack');
    expect(await inventoryPage.getCartCount()).toBe(1);
    
    // Go to cart
    await inventoryPage.goToCart();
    
    // Verify product in cart
    expect(await cartPage.getCartItemCount()).toBe(1);
    expect(await cartPage.isProductInCart('Sauce Labs Backpack')).toBeTruthy();
    
    // Proceed to checkout
    await cartPage.clickCheckout();
    
    // Fill checkout form
    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continueToOverview();
    
    // Verify order total
    const total = await checkoutPage.getTotalAmount();
    expect(total).toBeGreaterThan(0);
    
    // Complete purchase
    await checkoutPage.finishPurchase();
    
    // Verify success
    expect(await checkoutPage.isOrderComplete()).toBeTruthy();
    expect(await checkoutPage.getSuccessMessage()).toContain('Thank you for your order');
  });

  test('@regression User can add multiple products and remove one', async () => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.addToCart('Sauce Labs Bike Light');
    
    expect(await inventoryPage.getCartCount()).toBe(2);
    
    await inventoryPage.goToCart();
    expect(await cartPage.getCartItemCount()).toBe(2);
    
    await cartPage.removeProduct('Sauce Labs Backpack');
    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('@regression Checkout total calculation is correct', async () => {
    // Add product to cart
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.clickCheckout();
    
    // Fill checkout info
    await checkoutPage.fillCheckoutInfo('Jane', 'Smith', '54321');
    await checkoutPage.continueToOverview();
    
    // Verify total calculation
    expect(await checkoutPage.verifyTotalCalculation()).toBeTruthy();
  });
});