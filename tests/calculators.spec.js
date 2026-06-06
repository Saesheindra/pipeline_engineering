// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Pipeline Engineering Suite - Calculator Module Tests
 * Tests for Free Span, CP Anode, Corrosion, OBS, and Expansion calculators
 */

test.describe('Free Span Analysis', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Free Span');
    await expect(page.locator('#panel-fs')).toBeVisible();
  });

  test('should display free span input form', async ({ page }) => {
    await expect(page.locator('#fs_de')).toBeVisible();
    await expect(page.locator('#fs_wt')).toBeVisible();
    await expect(page.locator('#fs_lil')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate VIV' })).toBeVisible();
  });

  test('should calculate free span VIV', async ({ page }) => {
    await page.click('button:has-text("Calculate VIV")');

    // Natural frequency should be calculated
    const fnResult = page.locator('#fs_fnil');
    const fnValue = await fnResult.textContent();
    expect(fnValue).not.toBe('-- Hz');
  });

  test('should show VIV status', async ({ page }) => {
    await page.click('button:has-text("Calculate VIV")');

    // VIV status should be displayed
    await expect(page.locator('#fs_il_stat')).toBeVisible();
  });

  test('should calculate fatigue life', async ({ page }) => {
    await page.click('button:has-text("Calculate VIV")');

    const fatigueLife = page.locator('#fs_fatlife');
    await expect(fatigueLife).toBeVisible();
    const value = await fatigueLife.textContent();
    expect(value).not.toBe('-- years');
  });

  test('should display static stress check', async ({ page }) => {
    await page.click('button:has-text("Calculate VIV")');

    await expect(page.locator('#fs_static_stat')).toBeVisible();
  });

  test('should show intervention sizing', async ({ page }) => {
    await page.click('button:has-text("Calculate VIV")');

    await expect(page.locator('#fs_int_type')).toBeVisible();
  });
});

test.describe('CP Anode Design', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=CP Anode');
    await expect(page.locator('#panel-cp')).toBeVisible();
  });

  test('should display CP input form', async ({ page }) => {
    await expect(page.locator('#cp_od')).toBeVisible();
    await expect(page.locator('#cp_len')).toBeVisible();
    await expect(page.locator('#cp_life')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate CP' })).toBeVisible();
  });

  test('should calculate anode mass', async ({ page }) => {
    await page.click('button:has-text("Calculate CP")');

    const anodeMass = page.locator('#cp_mass');
    const massValue = await anodeMass.textContent();
    expect(massValue).not.toBe('-- kg');
  });

  test('should calculate number of anodes', async ({ page }) => {
    await page.click('button:has-text("Calculate CP")');

    const anodeCount = page.locator('#cp_num');
    const countValue = await anodeCount.textContent();
    expect(countValue).not.toBe('-- pcs');
  });

  test('should have CP type selector', async ({ page }) => {
    await expect(page.locator('#cp_type')).toBeVisible();
  });

  test('should show ICCP options when selected', async ({ page }) => {
    await page.selectOption('#cp_type', 'iccp');

    await expect(page.locator('#cp_iccp_params')).toBeVisible();
  });

  test('should show retrofit options when selected', async ({ page }) => {
    await page.selectOption('#cp_type', 'retrofit');

    await expect(page.locator('#cp_retrofit_params')).toBeVisible();
  });

  test('should display surface area calculation', async ({ page }) => {
    await page.click('button:has-text("Calculate CP")');

    const surfaceArea = page.locator('#cp_area');
    await expect(surfaceArea).toBeVisible();
  });
});

test.describe('Corrosion Assessment', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Corrosion');
    await expect(page.locator('#panel-cor')).toBeVisible();
  });

  test('should display corrosion input form', async ({ page }) => {
    await expect(page.locator('#cor_od')).toBeVisible();
    await expect(page.locator('#cor_wt')).toBeVisible();
    await expect(page.locator('#cor_d')).toBeVisible();
    await expect(page.locator('#cor_l')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Assess Corrosion' })).toBeVisible();
  });

  test('should calculate ERF', async ({ page }) => {
    await page.click('button:has-text("Assess Corrosion")');

    const erf = page.locator('#cor_erf');
    const erfValue = await erf.textContent();
    expect(erfValue).not.toBe('--');
  });

  test('should calculate safe pressure', async ({ page }) => {
    await page.click('button:has-text("Assess Corrosion")');

    const safePressure = page.locator('#cor_pcorr');
    await expect(safePressure).toBeVisible();
    const value = await safePressure.textContent();
    expect(value).not.toBe('-- MPa');
  });

  test('should show defect interaction section', async ({ page }) => {
    // Enable neighbor defect
    await page.selectOption('#cor_neighbor', '1');

    await expect(page.locator('#cor_neighbor_params')).toBeVisible();
  });

  test('should calculate with RSTRENG method', async ({ page }) => {
    await page.selectOption('#cor_method', '3');

    await page.click('button:has-text("Assess Corrosion")');

    const erf = page.locator('#cor_erf');
    const erfValue = await erf.textContent();
    expect(erfValue).not.toBe('--');
  });

  test('should display status pass/fail', async ({ page }) => {
    await page.click('button:has-text("Assess Corrosion")');

    const status = page.locator('#cor_stat');
    await expect(status).toBeVisible();
  });
});

test.describe('On-Bottom Stability', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Stability');
    await expect(page.locator('#panel-obs')).toBeVisible();
  });

  test('should display OBS input form', async ({ page }) => {
    await expect(page.locator('#obs_od')).toBeVisible();
    await expect(page.locator('#obs_wt')).toBeVisible();
    await expect(page.locator('#obs_vc')).toBeVisible();
    await expect(page.locator('#obs_hs')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate Stability' })).toBeVisible();
  });

  test('should calculate stability UC', async ({ page }) => {
    await page.click('button:has-text("Calculate Stability")');

    const ucLat = page.locator('#obs_uc');
    const ucValue = await ucLat.textContent();
    expect(ucValue).not.toBe('--');
  });

  test('should calculate submerged weight', async ({ page }) => {
    await page.click('button:has-text("Calculate Stability")');

    const subWeight = page.locator('#obs_ws');
    await expect(subWeight).toBeVisible();
    const value = await subWeight.textContent();
    expect(value).not.toBe('-- N/m');
  });

  test('should show stability status', async ({ page }) => {
    await page.click('button:has-text("Calculate Stability")');

    const status = page.locator('#obs_stat');
    await expect(status).toBeVisible();
  });

  test('should have protection method selector', async ({ page }) => {
    await expect(page.locator('#obs_prot_method')).toBeVisible();
  });

  test('should show protection design when selected', async ({ page }) => {
    await page.selectOption('#obs_prot_method', 'rock');

    await expect(page.locator('#obs_prot_params')).toBeVisible();
  });

  test('should show embedment calculation', async ({ page }) => {
    await page.click('button:has-text("Calculate Stability")');

    await expect(page.locator('text=Penetration/Embedment')).toBeVisible();
  });
});

test.describe('End Expansion', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=Expansion');
    await expect(page.locator('#panel-exp')).toBeVisible();
  });

  test('should display expansion input form', async ({ page }) => {
    await expect(page.locator('#exp_od')).toBeVisible();
    await expect(page.locator('#exp_wt')).toBeVisible();
    await expect(page.locator('#exp_l')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Calculate Expansion' })).toBeVisible();
  });

  test('should calculate end expansion', async ({ page }) => {
    await page.click('button:has-text("Calculate Expansion")');

    const endExp = page.locator('#exp_delta');
    const expValue = await endExp.textContent();
    expect(expValue).not.toBe('-- mm');
  });

  test('should calculate anchor length', async ({ page }) => {
    await page.click('button:has-text("Calculate Expansion")');

    const anchorLen = page.locator('#exp_lva');
    await expect(anchorLen).toBeVisible();
    const value = await anchorLen.textContent();
    expect(value).not.toBe('-- m');
  });

  test('should have mitigation method selector', async ({ page }) => {
    await expect(page.locator('#exp_mitig')).toBeVisible();
  });

  test('should show loop design when loop selected', async ({ page }) => {
    await page.selectOption('#exp_mitig', 'loop');

    await expect(page.locator('#exp_loop_params')).toBeVisible();
  });

  test('should display loop geometry canvas', async ({ page }) => {
    await page.selectOption('#exp_mitig', 'loop');
    await page.click('button:has-text("Calculate Expansion")');

    await expect(page.locator('#loopCanvas')).toBeVisible();
  });

  test('should show tie-in alignment results', async ({ page }) => {
    await page.click('button:has-text("Calculate Expansion")');

    await expect(page.locator('text=Tie-In Alignment')).toBeVisible();
  });
});
