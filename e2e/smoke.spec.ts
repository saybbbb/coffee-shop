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

  test("changing a filter while scrolled down shows the results, not the footer", async ({ page }) => {
    await openSite(page, "/menu");
    // Scroll deep into the full menu, then pick a filter that leaves only a few drinks
    await page.getByRole("button", { name: "From the Oven" }).click();
    await page.waitForTimeout(1400);
    await page.getByRole("button", { name: "Seasonal", exact: true }).click();
    await page.waitForTimeout(1400);
    const { footerVisible, resultsTop } = await page.evaluate(() => ({
      footerVisible: document.getElementById("footer")!.getBoundingClientRect().top < window.innerHeight,
      resultsTop: document.getElementById("cat-seasonal")!.getBoundingClientRect().top,
    }));
    expect(footerVisible, "the footer should not be in view").toBe(false);
    expect(resultsTop, "results should start just under the category bar").toBeGreaterThan(150);
    expect(resultsTop).toBeLessThan(500);
  });

  test("filters narrow the menu", async ({ page }) => {
    await openSite(page, "/menu");
    await page.getByRole("button", { name: "Vegan", exact: true }).click();
    await expect(page.getByRole("button", { name: "Customize Iced Kyoto Matcha" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Customize Nurvana Classic Latte" })).toHaveCount(0);
  });
});

test.describe("signature lineup", () => {
  test("menu board shows the drink photo (hover on laptop, tap on phone)", async ({ page }, info) => {
    await openSite(page);
    await jumpToSection(page, "menu", 0.6);
    const line = page.locator(".board-line", { hasText: "Spanish Latte" });
    if (info.project.name === "laptop") {
      await line.hover();
      const photo = page.locator("[data-board-photo]");
      await expect(photo).toHaveCSS("opacity", "1", { timeout: 3_000 });
    } else {
      await line.getByRole("button", { name: /^Spanish Latte/ }).click();
      await expect(line.getByRole("img", { name: "Spanish Latte" })).toBeVisible();
      await expect(line.getByRole("button", { name: "Customize" })).toBeVisible();
    }
  });

  test("Find your brew quiz recommends a matching drink", async ({ page }) => {
    await openSite(page);
    await jumpToSection(page, "menu", 0.6);
    await page.getByRole("button", { name: /Find your brew/ }).click();
    const quiz = page.getByRole("dialog", { name: "Find your brew" });
    await quiz.getByRole("button", { name: /^Iced/ }).click();
    await quiz.getByRole("button", { name: /^Bold & strong/ }).click();
    await quiz.getByRole("button", { name: /^No milk/ }).click();
    await expect(quiz).toContainText("Cold Brew Reserve");
    await expect(quiz).toContainText("Iced · bold & strong · no milk");
  });
});

test.describe("our team", () => {
  test("strips open on hover/tap and the go-to order opens the drink", async ({ page }, info) => {
    await openSite(page);
    await jumpToSection(page, "team", 0.6);
    const strip = page.getByRole("button", { name: "Charles B. Henares, Pastry Chef" });
    await expect(page.getByRole("button", { name: /Sent Japhet M\. Cagas/ })).toHaveAttribute("aria-expanded", "true");
    if (info.project.name === "laptop") await strip.hover();
    else await strip.click();
    await expect(strip).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "Charles's go-to order: Butter Croissant" }).click();
    await expect(page.getByRole("dialog", { name: "Butter Croissant" })).toBeVisible();
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

    await page.locator("#footer").getByRole("button", { name: "Visit us", exact: true }).click();
    await expect(page).toHaveURL(/\/#visit$/);
    await expect(page.locator("#visit-heading")).toBeInViewport({ timeout: 6_000 });
  });
});

test.describe("section jumps", () => {
  // Bean to Cup is excluded: its later panels reveal as you scroll sideways
  const LINKS = [
    ["Story", "story"],
    ["Lineup", "menu"],
    ["Team", "team"],
    ["Kind Words", "reviews"],
    ["Visit", "visit"],
  ] as const;

  test("top-bar links land with the section fully revealed", async ({ page }, info) => {
    test.skip(info.project.name !== "laptop", "the link bar only shows on large screens");
    await openSite(page);
    for (const [label, id] of LINKS) {
      await page.locator("header nav").getByRole("button", { name: label, exact: true }).click();
      await page.waitForTimeout(2200); // glide + scrub catch-up
      // Anything GSAP faded in must be fully visible by the time we land
      const faded = await page.evaluate((id) => {
        const section = document.getElementById(id)!;
        return [...section.querySelectorAll<HTMLElement>("[style*='opacity']")]
          .filter((el) => el.getBoundingClientRect().height > 0)
          .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99)
          .map((el) => `${el.className.toString().slice(0, 40)} → ${getComputedStyle(el).opacity}`);
      }, id);
      expect(faded, `${label} should be fully revealed`).toEqual([]);
    }
  });
});

test.describe("top bar", () => {
  test("section links fit between the logo and the buttons", async ({ page }, info) => {
    test.skip(info.project.name !== "laptop", "the link bar only shows on large screens");
    await openSite(page);
    for (const width of [1024, 1280, 1366]) {
      await page.setViewportSize({ width, height: 768 });
      const box = async (sel: string) => (await page.locator(sel).first().boundingBox())!;
      const logo = await box('header a[aria-label="Nurvana Café home"]');
      const bar = await box('header nav[aria-label="Sections"]');
      const actions = await box('header a[href="/menu"]');
      expect(logo.x + logo.width, `logo clears the bar at ${width}px`).toBeLessThan(bar.x);
      expect(bar.x + bar.width, `bar clears the buttons at ${width}px`).toBeLessThan(actions.x);
    }
    // Every section in the bar is reachable from it
    await expect(page.locator("header [data-bar-link]")).toHaveText(["Story", "Bean to Cup", "Lineup", "Team", "Kind Words", "Visit"]);
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

test.describe("footer", () => {
  test("Instagram and Facebook open the café's real pages in a new tab", async ({ page }) => {
    await openSite(page);
    const footer = page.locator("#footer");
    const ig = footer.getByRole("link", { name: /^Instagram/ });
    const fb = footer.getByRole("link", { name: /^Facebook/ });
    await expect(ig).toHaveAttribute("href", "https://www.instagram.com/nurvanacafe");
    await expect(fb).toHaveAttribute("href", /facebook\.com\/p\/Nurvan/);
    for (const link of [ig, fb]) await expect(link).toHaveAttribute("target", "_blank");
    await expect(footer).toContainText("@nurvanacafe");
  });
});

test.describe("404 & link previews", () => {
  test("unknown pages show the branded 404 with a way back", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("nurvana_intro_played", "true"));
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This cup is empty." })).toBeVisible();
    await page.getByRole("link", { name: /Back home/ }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sip the Brew.");
  });

  test("pages carry a link-preview image and description", async ({ page, request }) => {
    await page.goto("/");
    const og = page.locator('meta[property="og:image"]');
    await expect(og).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Nurvaná Café/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
    const url = new URL((await og.getAttribute("content"))!);
    const img = await request.get(url.pathname + url.search);
    expect(img.status()).toBe(200);
    expect(img.headers()["content-type"]).toContain("image/jpeg");
  });
});

test.describe("Ask Nurvana", () => {
  test("answers a price question from the menu data", async ({ page }) => {
    await openSite(page);
    await page.getByRole("button", { name: /^Ask Nurvana:/ }).click(); // the floating launcher
    const chat = page.getByRole("dialog", { name: "Ask Nurvana" });
    await chat.getByLabel("Your question").fill("how much is the matcha");
    await chat.getByRole("button", { name: "Send" }).click();
    await expect(chat).toContainText("Iced Kyoto Matcha is ₱195", { timeout: 5_000 });
  });
});
