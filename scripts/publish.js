#!/usr/bin/env node
// Creates a Codeberg release for the current CALVER.SHA tag and uploads
// dist/standalone.html as a downloadable asset. Requires CODEBERG_TOKEN.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const TOKEN = process.env.CODEBERG_TOKEN;
const REPO = "UnwiseDev/hexmapper";
const API = "https://codeberg.org/api/v1";
const date = execSync("date +%Y%m%d").toString().trim();
const sha = execSync("git rev-parse --short HEAD").toString().trim();
const VERSION = process.env.VERSION || (date + "." + sha);
const ASSET = path.join(__dirname, "..", "dist", "standalone.html");

if (!TOKEN) {
  console.error("CODEBERG_TOKEN not set.");
  console.error("Create one at https://codeberg.org/user/settings/applications (scope: write:repository)");
  console.error("Then put it in .env:  CODEBERG_TOKEN=xxxx");
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
    headers: { "Authorization": "token " + TOKEN, "Content-Type": "application/json" },
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
  const fd = new FormData();
  fd.append("name", "hexmapper-" + VERSION + ".html");
  fd.append("attachment", new Blob([file]), "hexmapper-" + VERSION + ".html");
  const a = await fetch(API + "/repos/" + REPO + "/releases/" + rel.id + "/assets", {
    method: "POST",
    headers: { "Authorization": "token " + TOKEN },
    body: fd
  });
  if (!a.ok) { const t = await a.text(); console.error("Upload asset failed:", a.status, t); process.exit(1); }
  console.log("  Asset uploaded: hexmapper-" + VERSION + ".html (" + file.length + " bytes)");
  console.log("  URL: https://codeberg.org/" + REPO + "/releases/tag/" + VERSION);
})().catch(e => { console.error(e); process.exit(1); });
