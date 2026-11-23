import { test, expect } from '@playwright/test';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients**',
      update: false,
    });
    await page.goto('/');
  });

  test('Добавление ингредиента (булки) в конструктор', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    await page.getByText('Добавить').first().click();
    await expect(page.getByText('Краторная булка N-200i').last()).toBeVisible();
  });

  test('Открытие модального окна и отображение корректных данных', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible({ timeout: 10000 });
    await page.getByText('Краторная булка N-200i').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.locator('#modals').getByText('Краторная булка N-200i')).toBeVisible();
  });

  test('Закрытие модального окна по крестику', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible({ timeout: 10000 });
    await page.getByText('Краторная булка N-200i').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await page.locator('#modals').locator('button').first().click();
    await expect(page.getByText('Детали ингредиента')).toBeHidden();
  });

  test('Закрытие модального окна по оверлею', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible({ timeout: 10000 });
    await page.getByText('Краторная булка N-200i').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.getByText('Детали ингредиента')).toBeHidden();
  });
});

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('accessToken', 'Bearer fake-token-for-test');
    });

    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients**',
      update: false,
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, user: { email: 'test@example.com', name: 'Test User' } }),
      });
    });

    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, name: 'Краторный бургер', order: { number: 12345 } }),
      });
    });

    await page.goto('/');
  });

  test('Оформление заказа и очистка конструктора', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible({ timeout: 10000 });

    await page.getByText('Добавить').first().click();
    await expect(page.getByText('Краторная булка N-200i').last()).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('Идентификатор заказа')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('12345')).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});