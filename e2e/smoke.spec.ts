import { expect, test } from "@playwright/test";
import { expectNoHorizontalOverflow, jumpToSection, openSite } from "./helpers";

test.describe("home", () => {
  test("loads with hero, no errors, no sideways scroll", async ({ page }) => {
    const errors = await openSite(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sip the Brew.");
    await expect(page.getByRole("link", { name: /Order for Pickup/i })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });

  test("every section is present and reachable", async ({ page }) => {
    await openSite(page);
    for (const id of ["story", "process", "menu", "team", "reviews", "visit"]) {
      await jumpToSection(page, id);
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
    await expectNoHorizontalOverflow(page);
  });

  test("intro video covers the page on a first visit", async ({ page }) => {
    await page.goto("/");
    const overlay = page.locator(".intro-overlay");
    await expect(overlay).toBeVisible();
    // ...and gets out of the way on its own
    await expect(overlay).toHaveCount(0, { timeout: 8_000 });
  });
});

test.describe("menu & ordering", () => {
  test("customise a latte, add it, and place a pickup order", async ({ page }) => {
    const errors = await openSite(page, "/menu");
    await expectNoHorizontalOverflow(page);

    await page.getByRole("button", { name: "Customize Nurvana Classic Latte" }).click();
    const sheet = page.getByRole("dialog", { name: "Nurvana Classic Latte" });
    await expect(sheet.getByRole("button", { name: /Add to Order/ })).toContainText("₱170");

    await sheet.getByRole("button", { name: /Large/ }).click();
    await sheet.getByRole("button", { name: /^Oat/ }).click();
    await expect(sheet.getByRole("button", { name: /Add to Order/ })).toContainText("₱225");
    await sheet.getByRole("button", { name: /Add to Order/ }).click();

    // Toast + cart badge
    await expect(page.getByRole("status")).toContainText("Nurvana Classic Latte added");
    await expect(page.getByRole("button", { name: /Open your order, 1 item/ })).toBeVisible();

    // Checkout
    await page.getByRole("button", { name: /Open your order/ }).click();
    const drawer = page.getByRole("dialog", { name: "Your order" });
    await drawer.getByPlaceholder("e.g. Sam").fill("Test");
    await drawer.getByRole("button", { name: /Place Pickup Order/ }).click();
    await expect(drawer).toContainText("Order number", { timeout: 6_000 });
    await expect(drawer).toContainText("₱225");
    expect(errors).toEqual([]);
  });

  test("filters narrow the menu", async ({ page }) => {
    await openSite(page, "/menu");
    await page.getByRole("button", { name: "Vegan", exact: true }).click();
    await expect(page.getByRole("button", { name: "Customize Iced Kyoto Matcha" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Customize Nurvana Classic Latte" })).toHaveCount(0);
  });
});

test.describe("navigation", () => {
  test("Full Menu goes to the menu page and Visit Us comes back home", async ({ page }) => {
    await openSite(page);
    const menuLink = page.getByRole("link", { name: /Full Menu/ }).first();
    if (await menuLink.isVisible()) {
      await menuLink.click();
    } else {
      // Phones: Full Menu lives in the drawer
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.getByRole("link", { name: /Full Menu/ }).last().click();
    }
    await expect(page).toHaveURL(/\/menu$/);
    await expect(page.getByRole("heading", { name: /Our Menu/ })).toBeVisible();

    await page.locator("#footer").getByRole("button", { name: /Visit Us/ }).click();
    await expect(page).toHaveURL(/\/#visit$/);
    await expect(page.locator("#visit-heading")).toBeInViewport({ timeout: 6_000 });
  });
});

test.describe("accessibility", () => {
  for (const path of ["/", "/menu"]) {
    test(`every visible button and link on ${path} has a readable name`, async ({ page }) => {
      await openSite(page, path);
      const nameless = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("a, button, [role=button]")]
          .filter((el) => el.offsetParent !== null && !el.closest("[aria-hidden=true]"))
          .filter((el) => {
            // What a screen reader would announce: aria-label, else text minus hidden icons
            if (el.getAttribute("aria-label")?.trim()) return false;
            const copy = el.cloneNode(true) as HTMLElement;
            copy.querySelectorAll("[aria-hidden=true]").forEach((n) => n.remove());
            const img = el.querySelector("img[alt]:not([alt=''])");
            return !(copy.textContent ?? "").trim() && !img;
          })
          .map((el) => el.outerHTML.slice(0, 120))
      );
      expect(nameless).toEqual([]);
    });
  }
});

test.describe("Ask Nurvana", () => {
  test("answers a price question from the menu data", async ({ page }) => {
    await openSite(page);
    await page.getByRole("button", { name: /Ask Nurvana/ }).click();
    const chat = page.getByRole("dialog", { name: "Ask Nurvana" });
    await chat.getByLabel("Your question").fill("how much is the matcha");
    await chat.getByRole("button", { name: "Send" }).click();
    await expect(chat).toContainText("Iced Kyoto Matcha is ₱195", { timeout: 5_000 });
  });
});
