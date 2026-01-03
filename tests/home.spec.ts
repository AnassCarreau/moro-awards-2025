import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the main title", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /MORO TW AWARDS/i })
    ).toBeVisible();
    await expect(page.locator("text=2025").first()).toBeVisible();
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });

  test("should display countdown or phase info", async ({ page }) => {
    await page.goto("/");

    // Debería mostrar algún tipo de contador o información de fase
    const hasCountdown =
      (await page.locator('[class*="countdown"], [class*="timer"]').count()) >
      0;
    const hasPhaseInfo =
      (await page
        .locator("text=/NOMINACIONES|VOTACIÓN|GALA|RESULTADOS/i")
        .count()) > 0;

    expect(hasCountdown || hasPhaseInfo).toBeTruthy();
  });
});

test.describe("Navigation", () => {
  test("should navigate to nomination page", async ({ page }) => {
    await page.goto("/");

    // Click en nominar si está visible
    const nominateLink = page.locator('a[href="/nominar"]');
    if (await nominateLink.isVisible()) {
      await nominateLink.click();
      await expect(page).toHaveURL("/nominar");
    }
  });

  test("should show login prompt on protected pages", async ({ page }) => {
    await page.goto("/nominar");

    // Debería mostrar mensaje de login o el formulario si está en fase de nominaciones
    const hasLoginPrompt =
      (await page
        .locator("text=/Inicia Sesión|Nominaciones Cerradas/i")
        .count()) > 0;
    const hasForm = (await page.locator("form").count()) > 0;

    expect(hasLoginPrompt || hasForm).toBeTruthy();
  });
});

test.describe("Responsive Design", () => {
  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /MORO TW AWARDS/i })
    ).toBeVisible();
  });

  test("should be responsive on tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /MORO TW AWARDS/i })
    ).toBeVisible();
  });
});
