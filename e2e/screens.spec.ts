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

test("@screens lineup interactions", async ({ page }, info) => {
  await openSite(page);
  await jumpToSection(page, "menu", 0.7);
  const dir = `e2e/screens/${info.project.name}`;
  if (info.project.name === "laptop") {
    await page.locator(".board-line", { hasText: "Iced Kyoto Matcha" }).hover();
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${dir}/lineup-hover.png` });
  } else {
    await page.locator(".board-line", { hasText: "Spanish Latte" }).getByRole("button", { name: /^Spanish Latte/ }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${dir}/lineup-expanded.png` });
  }
  await page.getByRole("button", { name: /Find your brew/ }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${dir}/quiz-question.png` });
  const quiz = page.getByRole("dialog", { name: "Find your brew" });
  await quiz.getByRole("button", { name: /^Hot/ }).click();
  await quiz.getByRole("button", { name: /^Sweet & creamy/ }).click();
  await quiz.getByRole("button", { name: /^Classic milk/ }).click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/quiz-result.png` });
});

test("@screens team strips", async ({ page }, info) => {
  await openSite(page);
  await jumpToSection(page, "team", 0.7);
  const strip = page.getByRole("button", { name: "Lourence D. Labe, Coffee Sommelier" });
  if (info.project.name === "laptop") await strip.hover();
  else await strip.click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `e2e/screens/${info.project.name}/team-open.png` });
});

test("@screens footer", async ({ page }, info) => {
  await openSite(page);
  await jumpToSection(page, "footer", 0);
  await page.waitForTimeout(800);
  await page.locator("#footer").screenshot({ path: `e2e/screens/${info.project.name}/footer-full.png` });
});

test("@screens 404 page", async ({ page }, info) => {
  await openSite(page, "/this-page-does-not-exist");
  await page.waitForTimeout(800);
  await page.screenshot({ path: `e2e/screens/${info.project.name}/not-found.png` });
});
