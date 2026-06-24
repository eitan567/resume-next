import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const nextRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return fs.readFileSync(path.join(nextRoot, rel), "utf8");
}

function exists(rel) {
  assert.ok(fs.existsSync(path.join(nextRoot, rel)), `${rel} should exist in the Next.js project`);
}

exists("package.json");
exists("src/app/layout.tsx");
exists("src/app/page.tsx");
exists("src/app/resume/page.tsx");
exists("src/app/components/site-nav.tsx");
exists("src/app/globals.css");
exists("public/legacy/index.html");
exists("src/app/api/[endpoint]/route.ts");
exists("eslint.config.mjs");
exists("next.config.ts");

const pkg = JSON.parse(read("package.json"));
assert.ok(pkg.dependencies.next, "Next.js should be installed in the new project");
assert.ok(pkg.dependencies.react, "React should be installed in the new project");
assert.ok(pkg.dependencies["react-dom"], "React DOM should be installed in the new project");
assert.match(pkg.scripts.dev, /next dev/, "Next project should expose a dev script");
assert.match(pkg.scripts.build, /next build/, "Next project should expose a build script");
assert.match(pkg.scripts.start, /next start/, "Next project should expose a start script");

const page = read("src/app/page.tsx");
assert.match(page, /href="\/resume"/, "The opening page should link to the current resume experience");
assert.match(page, /className="landingShell"/, "The opening page should render the new landing shell");
assert.doesNotMatch(page, /iframe[\s\S]*src="\/legacy\/index\.html"/, "The opening page should not directly host the legacy iframe");
assert.doesNotMatch(page, /deploymentBadge/, "The Next shell should not render the deployment version badge");
assert.doesNotMatch(page, /VERCEL_GIT_REPO_OWNER/, "The root page should not render source GitHub owner metadata");
assert.doesNotMatch(page, /VERCEL_GIT_COMMIT_SHA/, "The root page should not render source commit metadata");

const resumePage = read("src/app/resume/page.tsx");
assert.match(resumePage, /iframe[\s\S]*src="\/legacy\/index\.html"/, "The resume page should host the preserved legacy UI");
assert.match(resumePage, /title="קורות חיים - גרסת Legacy"/, "The legacy iframe should have an accessible Hebrew title");

const siteNav = read("src/app/components/site-nav.tsx");
assert.match(siteNav, /from "next\/link"/, "The shared nav should use Next Link navigation");
assert.match(siteNav, /href="\/"/, "The shared nav should link back to the opening page");
assert.match(siteNav, /href="\/resume"/, "The shared nav should link to the resume page");
assert.match(siteNav, /איתן ברון/, "The shared nav should carry the personal brand");

const layout = read("src/app/layout.tsx");
assert.match(layout, /<html lang="he" dir="rtl"/, "The root layout should preserve the Hebrew RTL document direction");

const legacyHtml = read("public/legacy/index.html");
assert.match(legacyHtml, /id="settingsModal"/, "The preserved legacy app should include the settings modal");
assert.match(legacyHtml, /syncModalScrollLock/, "The preserved legacy app should include the latest scroll-lock fix");

const route = read("src/app/api/[endpoint]/route.ts");
assert.match(route, /export const runtime = "nodejs"/, "Legacy API routes should run on the Node.js runtime");
assert.match(route, /createRequire/, "The route adapter should load the copied CommonJS API handlers");
assert.match(route, /export async function GET/, "The route adapter should support GET requests");
assert.match(route, /export async function POST/, "The route adapter should support POST requests");
assert.match(route, /payload instanceof Uint8Array[\s\S]*const bytes = new Uint8Array\(payload\);[\s\S]*new Blob\(\[bytes\]\)/, "Binary legacy responses should be converted to a valid Response body");

for (const endpoint of [
  "blob-upload",
  "chat",
  "contact",
  "live-token",
  "narration",
  "narration-save",
  "narration-script",
  "narration-versions",
  "stats",
  "track",
  "tts",
]) {
  assert.match(route, new RegExp(`"${endpoint}"`), `${endpoint} should be routed through the Next.js API adapter`);
  exists(`src/server/legacy-api/${endpoint}.js`);
}
exists("src/server/legacy-api/_db.js");

const eslintConfig = read("eslint.config.mjs");
assert.match(eslintConfig, /src\/server\/legacy-api\/\*\*/, "Copied CommonJS legacy API modules should be excluded from Next lint rules");

const nextConfig = read("next.config.ts");
assert.match(nextConfig, /turbopack:\s*\{[\s\S]*root:/, "The Next project should pin turbopack.root to avoid workspace-root ambiguity");

console.log("next legacy migration contract is intact");
