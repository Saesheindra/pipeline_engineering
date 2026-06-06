// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Pipeline Engineering Suite - Navigation Tests
 * Tests for sidebar navigation and panel switching
 */

test.describe('Navigation & Layout', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load dashboard by default', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Pipeline Engineering Suite/);

    // Check header shows Dashboard
    await expect(page.locator('#pageTitle')).toHaveText('Project Dashboard');

    // Check dashboard panel is visible
    await expect(page.locator('#panel-dashboard')).toBeVisible();
  });

  test('should display all KPI cards on dashboard', async ({ page }) => {
    const kpiCards = [
      'Wall Thickness',
      'Free Span VIV',
      'CP Anode Mass',
      'Corrosion ERF',
      'Stability UC',
      'End Expansion'
    ];

    for (const kpi of kpiCards) {
      await expect(page.getByText(kpi).first()).toBeVisible();
    }
  });

  test('should navigate to Wall Thickness panel', async ({ page }) => {
    await page.click('text=Wall Thickness');

    await expect(page.locator('#pageTitle')).toHaveText('Wall Thickness Calculator');
    await expect(page.locator('#panel-wt')).toBeVisible();
  });

  test('should navigate to Free Span panel', async ({ page }) => {
    await page.click('text=Free Span');

    await expect(page.locator('#pageTitle')).toHaveText('Free Span Analysis');
    await expect(page.locator('#panel-fs')).toBeVisible();
  });

  test('should navigate to CP Anode panel', async ({ page }) => {
    await page.click('text=CP Anode');

    await expect(page.locator('#pageTitle')).toHaveText('CP Anode Design');
    await expect(page.locator('#panel-cp')).toBeVisible();
  });

  test('should navigate to Corrosion panel', async ({ page }) => {
    await page.click('text=Corrosion');

    await expect(page.locator('#pageTitle')).toHaveText('Corrosion Assessment');
    await expect(page.locator('#panel-cor')).toBeVisible();
  });

  test('should navigate to Stability panel', async ({ page }) => {
    await page.click('text=Stability');

    await expect(page.locator('#pageTitle')).toHaveText('On-Bottom Stability');
    await expect(page.locator('#panel-obs')).toBeVisible();
  });

  test('should navigate to Expansion panel', async ({ page }) => {
    await page.click('text=Expansion');

    await expect(page.locator('#pageTitle')).toHaveText('End Expansion');
    await expect(page.locator('#panel-exp')).toBeVisible();
  });

  test('should navigate back to dashboard', async ({ page }) => {
    // Navigate away first
    await page.click('text=Wall Thickness');
    await expect(page.locator('#panel-wt')).toBeVisible();

    // Navigate back to dashboard
    await page.click('text=Dashboard');
    await expect(page.locator('#pageTitle')).toHaveText('Project Dashboard');
    await expect(page.locator('#panel-dashboard')).toBeVisible();
  });

  test('should have collapsible sidebar', async ({ page }) => {
    const sidebar = page.locator('.sidebar');

    // Sidebar should exist
    await expect(sidebar).toBeVisible();

    // Nav items should be visible
    await expect(page.locator('.nav-item').first()).toBeVisible();
  });

  test('should display Save and Export buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export PDF' })).toBeVisible();
  });
});

test.describe('Advanced Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to Upheaval Buckling panel', async ({ page }) => {
    await page.click('text=Upheaval Buckling');
    await expect(page.locator('#panel-ub')).toBeVisible();
  });

  test('should navigate to Lateral Buckling panel', async ({ page }) => {
    await page.click('text=Lateral Buckling');
    await expect(page.locator('#panel-lb')).toBeVisible();
  });

  test('should navigate to Hydrotest panel', async ({ page }) => {
    await page.click('text=Hydrotest');
    await expect(page.locator('#panel-ht')).toBeVisible();
  });

  test('should navigate to Flexible Pipe panel', async ({ page }) => {
    await page.click('text=Flexible Pipe');
    await expect(page.locator('#panel-flex')).toBeVisible();
  });

  test('should navigate to Non-Metallic panel', async ({ page }) => {
    await page.click('text=Non-Metallic');
    await expect(page.locator('#panel-nmp')).toBeVisible();
  });

  test('should navigate to Monte Carlo panel', async ({ page }) => {
    await page.click('text=Monte Carlo');
    await expect(page.locator('#panel-mc')).toBeVisible();
  });
});
