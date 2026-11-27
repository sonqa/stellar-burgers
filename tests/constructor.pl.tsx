import { test, expect, type Page } from '@playwright/test';

async function preparePage(page: Page) {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer fake-access-token',
      domain: 'localhost',
      path: '/',
    },
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'fake-refresh-token');
  });

  await page.routeFromHAR('tests/hars/all-requests.har', {
    url: '**/api/**',
    update: false,
  });

  await page.goto('/');
}

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await preparePage(page);
  });

  test('Добавление ингредиента (булки) в конструктор', async ({ page }) => {
    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await expect(bunCard).toBeVisible({ timeout: 10000 });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    const constructorSection = page.locator('section').filter({ hasText: 'Оформить заказ' });
    await expect(constructorSection.getByText('Краторная булка N-200i', { exact: false }).first()).toBeVisible();
  });

  test('Открытие модального окна и отображение корректных данных', async ({ page }) => {
    const secondBunCard = page.locator('li').filter({ hasText: 'Флюоресцентная булка R2-D3' });
    await expect(secondBunCard).toBeVisible({ timeout: 10000 });
    await secondBunCard.locator('a').click();
    await expect(page.getByText('Детали ингредиента')).toBeVisible();
    await expect(page.locator('#modals').getByText('Флюоресцентная булка R2-D3')).toBeVisible();
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
    await preparePage(page);
  });

  test('Оформление заказа и очистка конструктора', async ({ page }) => {
    await expect(page.getByText('Краторная булка N-200i')).toBeVisible({ timeout: 10000 });

    const bunCard = page.locator('li').filter({ hasText: 'Краторная булка N-200i' });
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const fillingCard = page.locator('li').filter({ hasText: 'Биокотлета из марсианской Магнолии' });
    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    const constructorSection = page.locator('section').filter({ hasText: 'Оформить заказ' });
    await expect(constructorSection.getByText('Краторная булка N-200i', { exact: false }).first()).toBeVisible();
    await expect(constructorSection.getByText('Биокотлета из марсианской Магнолии')).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.locator('#modals').getByText('Идентификатор заказа')).toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await page.locator('#modals').locator('button').first().click();
    await expect(page.locator('#modals').getByText('Идентификатор заказа')).toBeHidden();
  });
});