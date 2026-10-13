// Checks the page titles and descriptions against their length rules, that none is repeated,
// and that index.html, the sitemap and robots.txt agree with them. Run with `npm run check:seo`.
import { readFileSync } from 'node:fs';
import { PAGES, SITE_URL } from '../src/data/seo.js';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const errors = [];
const pages = Object.entries(PAGES);

for (const [key, page] of pages) {
    const t = page.title.length;
    const d = page.description.length;
    if (t < 50 || t > 60) errors.push(`${key}: title is ${t} characters (50–60)`);
    if (d < 150 || d > 160) errors.push(`${key}: description is ${d} characters (150–160)`);
    console.log(`${key.padEnd(11)} title ${t}  description ${d}  ${page.path}`);
}
for (const field of ['title', 'description', 'path']) {
    const values = pages.map(([, p]) => p[field]);
    if (new Set(values).size !== values.length) errors.push(`duplicated ${field}`);
}

const html = read('index.html');
if (!html.includes(`<title>${PAGES.home.title}</title>`)) errors.push('index.html: title differs from PAGES.home');
if (html.split(`content="${PAGES.home.description}"`).length !== 4) errors.push('index.html: description, og:description and twitter:description must all be PAGES.home');
if (html.split(`content="${PAGES.home.title}"`).length !== 3) errors.push('index.html: og:title and twitter:title must both be PAGES.home');
if (!html.includes(`<link rel="canonical" href="${SITE_URL}/" />`)) errors.push('index.html: canonical differs from SITE_URL');

const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
try {
    JSON.parse(jsonLd[1]);
} catch {
    errors.push('index.html: the JSON-LD block is missing or is not valid JSON');
}

const sitemap = read('public/sitemap.xml');
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const [key, page] of pages) {
    if (!listed.includes(`${SITE_URL}${page.path}`)) errors.push(`sitemap.xml: ${key} (${page.path}) is missing`);
}
if (listed.length !== pages.length) errors.push(`sitemap.xml lists ${listed.length} addresses for ${pages.length} pages`);
if (!read('public/robots.txt').includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) errors.push('robots.txt: sitemap address differs from SITE_URL');

// Each page is built to its own HTML file, and needs the rewrite in vercel.json that serves it;
// without one the host answers that address with the 404 page.
const rewrites = JSON.parse(read('vercel.json')).rewrites;
for (const [key, page] of pages) {
    if (page.path === '/') continue;
    if (!rewrites.some((r) => r.source === page.path && r.destination === `${page.path}.html`)) errors.push(`vercel.json: no rewrite for ${key} (${page.path})`);
}

if (errors.length) {
    console.error(`\n${errors.join('\n')}`);
    process.exit(1);
}
console.log('\nSEO data is consistent.');
