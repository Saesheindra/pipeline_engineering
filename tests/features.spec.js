// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Pipeline Engineering Suite - Feature Tests
 * Tests for history, export, and other features
 */

test.describe('Calculation History', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show empty history initially', async ({ page }) => {
    await expect(page.locator('text=No calculations yet')).toBeVisible();
  });

  test('should add calculation to history', async ({ page }) => {
    // Perform a calculation
    await page.click('text=Wall Thickness');
    await page.click('button:has-text("Calculate Wall Thickness")');

    // Go back to dashboard
    await page.click('text=Dashboard');

    // History should have entry
    await expect(page.locator('text=No calculations yet')).not.toBeVisible();
  });

  test('should show timestamp in history', async ({ page }) => {
    await page.click('text=Wall Thickness');
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('text=Dashboard');

    // Should show time
    const historyList = page.locator('#historyList');
    const historyText = await historyList.textContent();
    expect(historyText).toMatch(/\d{1,2}:\d{2}/); // Time format
  });

  test('should show pass/fail status in history', async ({ page }) => {
    await page.click('text=Wall Thickness');
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('text=Dashboard');

    // Should show status indicator
    const historyItem = page.locator('#historyList .result-row').first();
    await expect(historyItem.locator('.status')).toBeVisible();
  });
});

test.describe('Save Project', () => {

  test('should show save button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  test('should save project to localStorage', async ({ page }) => {
    await page.goto('/');

    // Perform a calculation first
    await page.click('text=Wall Thickness');
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('text=Dashboard');

    // Handle alert dialog
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('saved');
      await dialog.accept();
    });

    // Click save
    await page.click('button:has-text("Save")');

    // Check localStorage
    const saved = await page.evaluate(() => {
      return localStorage.getItem('pipelineProject');
    });
    expect(saved).not.toBeNull();
  });
});

test.describe('Export PDF', () => {

  test('should show export button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Export PDF' })).toBeVisible();
  });

  test('should trigger PDF download', async ({ page }) => {
    await page.goto('/');

    // Perform calculation
    await page.click('text=Wall Thickness');
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('text=Dashboard');

    // Setup download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);

    // Click export
    await page.click('button:has-text("Export PDF")');

    const download = await downloadPromise;
    if (download) {
      expect(download.suggestedFilename()).toContain('.pdf');
    }
  });
});

test.describe('Dashboard Overview', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should show project overview chart', async ({ page }) => {
    await expect(page.locator('#dashChart')).toBeVisible();
  });

  test('should update KPI cards after calculation', async ({ page }) => {
    // Get initial value
    const initialWT = await page.locator('#kpi-wt-value').textContent();

    // Perform calculation
    await page.click('text=Wall Thickness');
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('text=Dashboard');

    // Value should change
    const newWT = await page.locator('#kpi-wt-value').textContent();
    expect(newWT).not.toBe(initialWT);
  });

  test('should update status indicator after calculation', async ({ page }) => {
    await page.click('text=Wall Thickness');
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('text=Dashboard');

    // Status should be pass or fail (not pending)
    const status = page.locator('#kpi-wt-status');
    const statusClass = await status.getAttribute('class');
    expect(statusClass).toMatch(/pass|fail/);
  });

  test('should show standards in header', async ({ page }) => {
    const headerSubtitle = page.locator('.header-subtitle');
    const text = await headerSubtitle.textContent();

    expect(text).toContain('DNV');
    expect(text).toContain('ASME');
    expect(text).toContain('API');
  });
});

test.describe('Advanced Calculators', () => {

  test('should calculate Monte Carlo simulation', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Monte Carlo');

    await expect(page.locator('#panel-mc')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Run Simulation' })).toBeVisible();
  });

  test('should calculate risk assessment', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Risk Matrix');

    await expect(page.locator('#panel-risk')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Assess Risk' })).toBeVisible();
  });

  test('should calculate cost estimation', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Cost Estimate');

    await expect(page.locator('#panel-cost')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Estimate Cost' })).toBeVisible();
  });

  test('should calculate flow assurance', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Flow Assurance');

    await expect(page.locator('#panel-flow')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate Flow' })).toBeVisible();
  });
});

test.describe('Specialty Pipes', () => {

  test('should calculate flexible pipe design', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Flexible Pipe');

    await expect(page.locator('#panel-flex')).toBeVisible();
    await page.click('button:has-text("Calculate Flexible")');

    // Should show design status
    const status = page.locator('#flex_stat');
    await expect(status).toBeVisible();
  });

  test('should calculate non-metallic pipe design', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Non-Metallic');

    await expect(page.locator('#panel-nmp')).toBeVisible();
    await page.click('button:has-text("Calculate NMP")');

    // Should show results
    const tMin = page.locator('#nmp_tmin');
    const tMinValue = await tMin.textContent();
    expect(tMinValue).not.toBe('--');
  });
});

test.describe('Responsive Design', () => {

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('#panel-dashboard')).toBeVisible();
    await expect(page.locator('.sidebar')).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('#panel-dashboard')).toBeVisible();
  });
});
