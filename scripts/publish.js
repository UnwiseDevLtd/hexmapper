#!/usr/bin/env node
// Creates a GitHub release for the current CALVER.SHA tag and uploads
// dist/standalone.html as a downloadable asset. Requires GITHUB_TOKEN.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = "UnwiseDevLtd/hexmapper";
const API = "https://api.github.com";
const date = execSync("date +%Y%m%d").toString().trim();
const sha = execSync("git rev-parse --short HEAD").toString().trim();
const VERSION = process.env.VERSION || (date + "." + sha);
const ASSET = path.join(__dirname, "..", "dist", "standalone.html");

if (!TOKEN) {
  console.error("GITHUB_TOKEN not set.");
  console.error("Create one at https://github.com/settings/tokens (classic with 'repo' scope, or fine-grained with Contents: read/write)");
  console.error("Then put it in .env:  GITHUB_TOKEN=xxxx");
  process.exit(1);
}
if (!fs.existsSync(ASSET)) {
  console.error("dist/standalone.html not found — run: node build.js --standalone");
  process.exit(1);
}

(async () => {
  console.log("Publishing release " + VERSION + "...");
  const file = fs.readFileSync(ASSET);

  // 1. create release
  const r = await fetch(API + "/repos/" + REPO + "/releases", {
    method: "POST",
    headers: { "Authorization": "Bearer " + TOKEN, "Accept": "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({
      tag_name: VERSION,
      name: VERSION,
      body: "Hexmapper " + VERSION + "\n\nSingle-file standalone HTML — open in any browser, no server needed.\n\nAGPL-3.0-or-later."
    })
  });
  if (!r.ok) { const t = await r.text(); console.error("Create release failed:", r.status, t); process.exit(1); }
  const rel = await r.json();
  console.log("  Release created (id=" + rel.id + ")");

  // 2. upload asset
  const a = await fetch("https://uploads.github.com/repos/" + REPO + "/releases/" + rel.id + "/assets?name=hexmapper-" + VERSION + ".html", {
    method: "POST",
    headers: { "Authorization": "Bearer " + TOKEN, "Accept": "application/vnd.github+json", "Content-Type": "text/html" },
    body: file
  });
  if (!a.ok) { const t = await a.text(); console.error("Upload asset failed:", a.status, t); process.exit(1); }
  console.log("  Asset uploaded: hexmapper-" + VERSION + ".html (" + file.length + " bytes)");
  console.log("  URL: https://github.com/" + REPO + "/releases/tag/" + VERSION);
})().catch(e => { console.error(e); process.exit(1); });
