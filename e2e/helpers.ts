import { expect, type Page } from "@playwright/test";

/**
 * Opens a page with the intro video already marked as seen (so tests start on
 * the real content) and records any console errors for the test to assert on.
 */
export async function openSite(page: Page, path = "/") {
  const errors: string[] = [];
  page.on("console", (msg) => {
    // The dev server's hot-reload socket is noise, not a site error
    if (msg.type() === "error" && !msg.text().includes("_next/webpack-hmr") && !msg.text().includes("/_next/hmr")) {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => errors.push(err.message));
  await page.addInitScript(() => sessionStorage.setItem("nurvana_intro_played", "true"));
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  return errors;
}

/** Fails if anything makes the page wider than the screen (sideways scrolling). */
export async function expectNoHorizontalOverflow(page: Page) {
  const { scrollWidth, innerWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  expect(scrollWidth, "page should not scroll sideways").toBeLessThanOrEqual(innerWidth);
}

/** Jumps straight to a home section (skipping the smooth glide) and lets it settle. */
export async function jumpToSection(page: Page, id: string, progress = 0.5) {
  await page.evaluate(
    ({ id, progress }) => {
      const el = document.getElementById(id)!;
      const ref = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
      const top = ref.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(0, ref.getBoundingClientRect().height - window.innerHeight);
      window.__lenis?.resize();
      const y = top + span * progress;
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    },
    { id, progress }
  );
  await page.waitForTimeout(900);
}
