import { readFileSync } from "node:fs";
import { test } from "@playwright/test";

/**
 * Not a test: renders the link-preview card (what Messenger, Facebook, Discord
 * etc. show when the site is shared) and saves it as app/opengraph-image.jpg.
 * Run with `npm run og:image` after changing the branding, then commit the image.
 */
const asDataUrl = (path: string) => `data:image/jpeg;base64,${readFileSync(path).toString("base64")}`;

test("@og link preview image", async ({ page }, info) => {
  test.skip(info.project.name !== "laptop", "one image is enough");
  await page.setViewportSize({ width: 1200, height: 630 });

  const photo = asDataUrl("public/story/barista2.jpg");
  const latte = asDataUrl("public/menu/latte.jpg");
  const logo = asDataUrl("app/icon.jpg");

  await page.setContent(`<!doctype html>
<html><head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Epilogue:ital,wght@1,400&family=Space+Mono:wght@700&display=block">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #291806;
    background-image: radial-gradient(ellipse at 15% 0%, rgba(75,54,33,.9) 0%, transparent 60%), radial-gradient(ellipse at 100% 100%, rgba(196,138,85,.22) 0%, transparent 55%);
    color: #fdf9f4; font-family: "Bricolage Grotesque", sans-serif; position: relative; }
  .text { position: absolute; left: 72px; top: 0; bottom: 0; width: 560px; display: flex; flex-direction: column; justify-content: center; gap: 22px; }
  .brand { display: flex; align-items: center; gap: 16px; }
  .brand img { width: 64px; height: 64px; border-radius: 50%; background: #fff; }
  .brand span { font-family: "Space Mono", monospace; font-weight: 700; letter-spacing: .3em; font-size: 20px; color: #f6e0b9; }
  h1 { font-size: 108px; line-height: .9; letter-spacing: -0.03em; }
  .tag { font-family: "Epilogue", serif; font-style: italic; font-size: 38px; color: #fcd581; }
  .meta { font-family: "Space Mono", monospace; font-weight: 700; font-size: 17px; letter-spacing: .08em; color: rgba(253,249,244,.72); text-transform: uppercase; }
  .chip { align-self: flex-start; margin-top: 6px; padding: 14px 26px; border-radius: 999px; background: #f6e0b9; color: #33210d; font-family: "Space Mono", monospace; font-weight: 700; font-size: 18px; letter-spacing: .08em; text-transform: uppercase; }
  .photo { position: absolute; right: 64px; top: 56px; width: 400px; height: 518px; border-radius: 36px; overflow: hidden; box-shadow: 0 40px 80px -30px rgba(0,0,0,.7); }
  .photo img { width: 100%; height: 100%; object-fit: cover; }
  .polaroid { position: absolute; right: 380px; bottom: 54px; width: 210px; padding: 10px 10px 16px; background: #fff; border-radius: 6px; transform: rotate(-6deg); box-shadow: 0 30px 60px -20px rgba(0,0,0,.7); }
  .polaroid img { width: 100%; height: 170px; object-fit: cover; border-radius: 3px; display: block; }
  .polaroid p { font-family: "Epilogue", serif; font-style: italic; text-align: center; color: #4e453d; font-size: 18px; margin-top: 8px; }
</style></head>
<body>
  <div class="text">
    <div class="brand"><img src="${logo}" alt=""><span>NURVANÁ CAFÉ</span></div>
    <h1>Sip the Brew.</h1>
    <p class="tag">Feel Brand New.</p>
    <p class="meta">Specialty coffee &amp; pastries · PHINMA COC, Cagayan de Oro</p>
    <p class="chip">Order ahead for pickup →</p>
  </div>
  <div class="photo"><img src="${photo}" alt=""></div>
  <div class="polaroid"><img src="${latte}" alt=""><p>made for you</p></div>
</body></html>`);

  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: "app/opengraph-image.jpg", type: "jpeg", quality: 88 });
});
