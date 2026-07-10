#!/usr/bin/env node
/*
  hexmapper build — concatenates src/*.js (plain global scripts, no modules)
  into a single dist/app.js loaded by index.html. No dependencies.
  --standalone: minify + inline into a single dist/standalone.html with version stamp.
*/
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

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

function minify(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function getVersion() {
  try {
    const date = execSync("date +%Y%m%d").toString().trim();
    const sha = execSync("git rev-parse --short HEAD").toString().trim();
    return date + "." + sha;
  } catch (_) { return "dev"; }
}

function buildStandalone() {
  build();
  const version = getVersion();
  const raw = fs.readFileSync(outFile, "utf8");
  const min = minify(raw);
  let exampleVar = "";
  const examplePath = path.join(root, "example.png");
  if (fs.existsSync(examplePath)) {
    const b64 = fs.readFileSync(examplePath).toString("base64");
    exampleVar = 'const EXAMPLE_IMG="data:image/png;base64,' + b64 + '";\n';
    console.log("[build] inlined example.png (" + (b64.length/1024).toFixed(0) + "KB base64)");
  }
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const out = html.replace(
    '<script src="dist/app.js"></script>',
    '<script>const VERSION="' + version + '";\n' + exampleVar + min + "\n</script>"
  );
  const standaloneFile = path.join(outDir, "standalone.html");
  fs.writeFileSync(standaloneFile, out);
  console.log("[build] standalone: dist/standalone.html (" + out.length + " bytes, version " + version + ")");
}

const args = process.argv.slice(2);
if (args.includes("--standalone")) {
  buildStandalone();
} else if (args.includes("--watch")) {
  build();
  let t;
  fs.watch(srcDir, () => { clearTimeout(t); t = setTimeout(build, 100); });
  console.log("[build] watching src/ for changes…");
} else {
  build();
}
