import { expect, test } from '@playwright/test';

async function openProject(page, project) {
  const opener = page.locator(`.project-card[data-project="${project}"] [data-open="${project}"]`);
  await opener.click({ force: true });
  const modal = page.locator('.project-modal');
  await expect(modal).toHaveClass(/is-open/);
  return { modal, opener };
}

async function hasHorizontalOverflow(page) {
  return page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
}

test.describe('responsive layout', () => {
  test('fits the viewport without horizontal overflow', async ({ page }, testInfo) => {
    await page.goto('/');
    const dimensions = await hasHorizontalOverflow(page);
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
    expect(dimensions.bodyWidth).toBeLessThanOrEqual(dimensions.viewportWidth);

    await page.screenshot({ path: testInfo.outputPath('home.png') });
  });
});

test.describe('language switching', () => {
  test('defaults to English and persists Russian, including the process heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#hero-title')).toContainText('A developer.');
    await expect(page.locator('#process-title')).toContainText('From');

    await page.locator('.lang-switch').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.locator('#hero-title')).toContainText('Разработчик.');
    await expect(page.locator('#process-title')).toHaveText(/[А-Яа-яЁё]/);
    await expect(page.locator('#process-title')).not.toContainText('From');
    await expect(page).toHaveTitle(/Макс/);

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
    await expect(page.locator('#hero-title')).toContainText('Разработчик.');
    await expect(page.locator('#process-title')).toHaveText(/[А-Яа-яЁё]/);
    await expect(page.locator('#process-title')).not.toContainText('From');
  });
});

test.describe('project previews', () => {
  test('opens a modal, traps keyboard focus, and closes repeatedly with Escape', async ({ page }) => {
    await page.goto('/');
    const { modal, opener } = await openProject(page, 'forma');

    await expect(modal).toHaveAttribute('aria-hidden', 'false');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(modal).toContainText('Spaces for living.');
    await expect.poll(() => page.evaluate(() => document.activeElement?.closest('.project-modal') !== null)).toBe(true);

    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press('Tab');
      await expect.poll(() => page.evaluate(() => document.activeElement?.closest('.project-modal') !== null)).toBe(true);
    }
    await page.keyboard.press('Shift+Tab');
    await expect.poll(() => page.evaluate(() => document.activeElement?.closest('.project-modal') !== null)).toBe(true);

    await page.keyboard.press('Escape');
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
    await expect(page.locator('body')).not.toHaveClass(/modal-open/);
    await expect.poll(() => page.evaluate(() => document.activeElement?.getAttribute('data-open'))).toBe('forma');

    await page.keyboard.press('Escape');
    await page.keyboard.press('Escape');
    await expect(modal).toHaveAttribute('aria-hidden', 'true');
  });

  test('completes the Relay selection, time confirmation, and restart flow', async ({ page }) => {
    await page.goto('/');
    const { modal } = await openProject(page, 'relay');

    await expect(modal.getByRole('button', { name: 'Haircut', exact: true })).toBeVisible();
    await modal.getByRole('button', { name: 'Haircut', exact: true }).click();
    await expect(modal.getByRole('button', { name: '14:00', exact: true })).toBeVisible({ timeout: 2_000 });
    await modal.getByRole('button', { name: '14:00', exact: true }).click();
    await expect(modal).toContainText('14:00');
    await expect(modal.getByRole('button', { name: 'Try another booking', exact: true })).toBeVisible();
    await expect(modal.locator('.time-options')).toHaveCount(0);

    await modal.getByRole('button', { name: 'Try another booking', exact: true }).click({ force: true });
    await expect(modal.getByRole('button', { name: 'Consultation', exact: true })).toBeVisible();
    await expect(modal.locator('.time-options')).toHaveCount(0);

    await page.keyboard.press('Escape');
    await openProject(page, 'relay');
    await expect(page.locator('.project-modal').getByRole('button', { name: 'Haircut', exact: true })).toBeVisible();
    await expect(page.locator('.project-modal .time-options')).toHaveCount(0);
  });
});

test.describe('mobile navigation', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name === 'desktop', 'The mobile menu is intentionally hidden on desktop.');
  });

  test('opens, navigates to each section, and closes after a link click', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('.menu-toggle');
    const menu = page.locator('.mobile-menu');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toHaveAttribute('aria-hidden', 'false');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('link', { name: 'The work', exact: true })).toBeVisible();

    for (const destination of [
      { name: 'The work', hash: '#work' },
      { name: 'The person', hash: '#about' },
      { name: 'Let’s talk', hash: '#contact' },
    ]) {
      if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
      await menu.getByRole('link', { name: destination.name, exact: true }).click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(menu).toHaveAttribute('aria-hidden', 'true');
      await expect(page).toHaveURL(new RegExp(`${destination.hash}$`));
      await page.waitForTimeout(400);
    }

    const dimensions = await hasHorizontalOverflow(page);
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
    expect(dimensions.bodyWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  });
});
