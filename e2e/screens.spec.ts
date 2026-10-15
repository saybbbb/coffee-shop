import { test } from "@playwright/test";
import { jumpToSection, openSite } from "./helpers";

/**
 * Not a test: captures each page/section for a visual check.
 * Run with `npm run screens`; images land in e2e/screens/<laptop|phone>/.
 */
const HOME_SECTIONS = ["hero", "story", "process", "menu", "team", "reviews", "visit", "footer"];

test("@screens home sections", async ({ page }, info) => {
  await openSite(page);
  for (const [i, id] of HOME_SECTIONS.entries()) {
    await jumpToSection(page, id, id === "process" ? 0.15 : 0.6);
    await page.screenshot({ path: `e2e/screens/${info.project.name}/home-${i + 1}-${id}.png` });
  }
});

test("@screens menu page", async ({ page }, info) => {
  await openSite(page, "/menu");
  await page.screenshot({ path: `e2e/screens/${info.project.name}/menu-top.png` });
  await page.screenshot({ path: `e2e/screens/${info.project.name}/menu-full.png`, fullPage: true });
});
