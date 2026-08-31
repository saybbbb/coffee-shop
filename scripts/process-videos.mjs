import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import ffmpegPath from "ffmpeg-static";

const videoDir = path.resolve("./public/video");
const inputVideo = path.join(videoDir, "nurvana-intro.mp4");
const logoRevealOutput = path.join(videoDir, "logo-reveal.mp4");
const heroPourOutput = path.join(videoDir, "hero-pour.mp4");
const logoPosterOutput = path.join(videoDir, "logo-reveal-poster.jpg");
const heroPosterOutput = path.join(videoDir, "hero-pour-poster.jpg");

console.log("Using ffmpeg binary at:", ffmpegPath);
console.log("Source video:", inputVideo);

if (!fs.existsSync(inputVideo)) {
  console.error("Input video not found:", inputVideo);
  process.exit(1);
}

// 1. Split Logo Reveal (0:00 - 0:04)
console.log("\n[1/4] Splitting and encoding logo-reveal.mp4 (00:00:00 to 00:00:04)...");
const logoCmd = `"${ffmpegPath}" -y -ss 00:00:00 -to 00:00:04 -i "${inputVideo}" -c:v libx264 -pix_fmt yuv420p -crf 22 -preset slow -movflags +faststart -an "${logoRevealOutput}"`;
execSync(logoCmd, { stdio: "inherit" });

// 2. Split Hero Pour (0:04 to end)
console.log("\n[2/4] Splitting and encoding hero-pour.mp4 (00:00:04 to end)...");
const heroCmd = `"${ffmpegPath}" -y -ss 00:00:04 -i "${inputVideo}" -c:v libx264 -pix_fmt yuv420p -crf 23 -preset slow -movflags +faststart -an "${heroPourOutput}"`;
execSync(heroCmd, { stdio: "inherit" });

// 3. Generate Poster for Logo Reveal
console.log("\n[3/4] Generating poster for logo reveal...");
const logoPosterCmd = `"${ffmpegPath}" -y -ss 00:00:03.5 -i "${logoRevealOutput}" -vframes 1 -q:v 2 "${logoPosterOutput}"`;
execSync(logoPosterCmd, { stdio: "inherit" });

// 4. Generate Poster for Hero Pour
console.log("\n[4/4] Generating poster for hero pour...");
const heroPosterCmd = `"${ffmpegPath}" -y -ss 00:00:01 -i "${heroPourOutput}" -vframes 1 -q:v 2 "${heroPosterOutput}"`;
execSync(heroPosterCmd, { stdio: "inherit" });

console.log("\n--- Verification ---");
for (const file of [logoRevealOutput, heroPourOutput, logoPosterOutput, heroPosterOutput]) {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`✓ ${path.basename(file)}: ${(stats.size / 1024).toFixed(1)} KB`);
  } else {
    console.error(`✗ Missing: ${file}`);
  }
}
console.log("Video processing complete!");
