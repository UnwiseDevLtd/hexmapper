#!/usr/bin/env node
/*
  hexmapper build — concatenates src/*.js (plain global scripts, no modules)
  into a single dist/app.js loaded by index.html. No dependencies.
*/
const fs = require("fs");
const path = require("path");

const root = __dirname;
const srcDir = path.join(root, "src");
const outDir = path.join(root, "dist");
const outFile = path.join(outDir, "app.js");

function build() {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith(".js")).sort();
  let s = "/* hexmapper — compiled bundle. AGPL-3.0-or-later. Edit files in src/. */\n";
  for (const f of files) {
    s += "\n// ===================== src/" + f + " =====================\n";
    s += fs.readFileSync(path.join(srcDir, f), "utf8");
    s += "\n";
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, s);
  console.log("[build] " + files.length + " files -> dist/app.js (" + s.length + " bytes)");
}

if (process.argv.includes("--watch")) {
  build();
  let t;
  fs.watch(srcDir, () => { clearTimeout(t); t = setTimeout(build, 100); });
  console.log("[build] watching src/ for changes…");
} else {
  build();
}
