// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Pipeline Engineering Suite - Wall Thickness Calculator Tests
 * Tests for DNV-ST-F101 / ASME B31.8 / API 1111 wall thickness calculations
 */

test.describe('Wall Thickness Calculator', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Wall Thickness');
    await expect(page.locator('#panel-wt')).toBeVisible();
  });

  test('should display input form with all required fields', async ({ page }) => {
    // Material section
    await expect(page.locator('#wt_mattype')).toBeVisible();
    await expect(page.locator('#wt_matgrade')).toBeVisible();

    // Design code
    await expect(page.locator('#wt_code')).toBeVisible();

    // Pipe dimensions
    await expect(page.locator('#wt_nps')).toBeVisible();
    await expect(page.locator('#wt_od')).toBeVisible();

    // Operating conditions
    await expect(page.locator('#wt_p_slider')).toBeVisible();
    await expect(page.locator('#wt_t_slider')).toBeVisible();

    // Calculate button
    await expect(page.getByRole('button', { name: 'Calculate Wall Thickness' })).toBeVisible();
  });

  test('should calculate wall thickness with default values', async ({ page }) => {
    // Click calculate
    await page.click('button:has-text("Calculate Wall Thickness")');

    // Switch to Results tab
    await page.click('button:has-text("Results")');

    // Check that results are displayed (not dashes)
    const t1Value = await page.locator('td:has-text("t1")').locator('xpath=following-sibling::td[1]').textContent();
    expect(parseFloat(t1Value)).toBeGreaterThan(0);

    // Check governing thickness is calculated
    const govWT = page.locator('text=Governing Hoop WT').locator('xpath=ancestor::tr/td[2]');
    const govValue = await govWT.textContent();
    expect(parseFloat(govValue)).toBeGreaterThan(0);
  });

  test('should update OD when NPS changes', async ({ page }) => {
    // Get initial OD value
    const initialOD = await page.locator('#wt_od').inputValue();

    // Change NPS to 24"
    await page.selectOption('#wt_nps', '24');

    // OD should update to 609.6
    await expect(page.locator('#wt_od')).toHaveValue('609.6');
    expect(await page.locator('#wt_od').inputValue()).not.toBe(initialOD);
  });

  test('should show PASS for collapse check with adequate thickness', async ({ page }) => {
    // Calculate with default values
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // Check collapse check passes
    const collapseStatus = page.locator('text=Collapse Check').locator('xpath=following-sibling::*//span[contains(@class, "status")]');
    await expect(collapseStatus).toContainText('PASS');
  });

  test('should display D/t ratio check', async ({ page }) => {
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // D/t ratio should be displayed in Installation section
    const dtRatio = page.locator('#wt_dt_ratio');
    await expect(dtRatio).toBeVisible();
    const dtText = await dtRatio.textContent();
    expect(dtText).toContain('≤');
  });

  test('should calculate with DNV-ST-F101 code', async ({ page }) => {
    // Select DNV code
    await page.selectOption('#wt_code', '3');

    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // Results should be displayed
    const minWT = page.locator('text=Min Required WT').locator('xpath=ancestor::tr/td[2]');
    const minValue = await minWT.textContent();
    expect(parseFloat(minValue)).toBeGreaterThan(0);
  });

  test('should switch material type to CRA', async ({ page }) => {
    // Select CRA material
    await page.selectOption('#wt_mattype', 'cra');

    // Grade options should change
    const gradeOptions = page.locator('#wt_matgrade option');
    const optionTexts = await gradeOptions.allTextContents();
    expect(optionTexts.some(opt => opt.includes('Duplex') || opt.includes('Cr'))).toBeTruthy();
  });

  test('should update pressure with slider', async ({ page }) => {
    const slider = page.locator('#wt_p_slider');

    // Change slider value
    await slider.fill('10');

    // Pressure display should update
    const pressureDisplay = page.locator('#wt_p_val');
    await expect(pressureDisplay).toContainText('10');
  });

  test('should switch between tabs', async ({ page }) => {
    // Inputs tab should be active by default
    const inputsTab = page.locator('button:has-text("Inputs")');
    await expect(inputsTab).toBeVisible();

    // Click Results tab
    await page.click('button:has-text("Results")');

    // Click Sensitivity tab
    await page.click('button:has-text("Sensitivity")');
    await expect(page.locator('#wt-analysis')).toBeVisible();
  });

  test('should display steel weight after calculation', async ({ page }) => {
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // Steel weight should be displayed
    const steelWeight = page.locator('text=Steel Weight').locator('xpath=following-sibling::*');
    const weightText = await steelWeight.textContent();
    expect(weightText).toContain('kg/m');
  });

  test('should display estimated cost after calculation', async ({ page }) => {
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // Est cost should be displayed (using specific ID)
    const estCost = page.locator('#w_cost');
    await expect(estCost).toBeVisible();
    const costText = await estCost.textContent();
    expect(costText).toContain('$');
  });

  test('should handle high pressure input', async ({ page }) => {
    // Set high pressure
    await page.locator('#wt_p_slider').fill('20');

    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // Should still calculate valid results
    const minWT = page.locator('text=Min Required WT').locator('xpath=ancestor::tr/td[2]');
    const minValue = await minWT.textContent();
    expect(parseFloat(minValue)).toBeGreaterThan(10); // Higher pressure = thicker wall
  });

  test('should show combined loading check section', async ({ page }) => {
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // Combined loading section should exist
    await expect(page.locator('text=Combined Loading Check')).toBeVisible();
  });

  test('should show installation check section', async ({ page }) => {
    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // Installation section should exist
    await expect(page.locator('text=Installation & Reeling Check')).toBeVisible();
  });
});

test.describe('Wall Thickness - Installation Methods', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Wall Thickness');
  });

  test('should have installation method selector', async ({ page }) => {
    await expect(page.locator('#wt_inst_method')).toBeVisible();
  });

  test('should show reel options when Reel-Lay selected', async ({ page }) => {
    await page.selectOption('#wt_inst_method', 'reel');

    // Reel-specific options should appear
    await expect(page.locator('#wt_reel_row')).toBeVisible();
  });

  test('should calculate strain for S-Lay method', async ({ page }) => {
    await page.selectOption('#wt_inst_method', 'slay');

    await page.click('button:has-text("Calculate Wall Thickness")');
    await page.click('button:has-text("Results")');

    // Install bending strain should be displayed
    await expect(page.locator('text=Install Bending Strain')).toBeVisible();
  });
});
