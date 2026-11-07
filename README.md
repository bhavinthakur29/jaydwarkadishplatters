# Jay Dwarkadhish Platters & Decor

Showcase website for a handmade platters, chhab and hampers business in Una, Gujarat.
Next.js (App Router) · TypeScript · Tailwind CSS v4 · bun. Languages: English (default, `/`), Hindi (`/hi`), Gujarati (`/gu`).

```bash
bun install
bun run dev        # http://localhost:3000
bun run validate   # check all content + images without building
bun run build      # production build (also validates content)
bun run images     # optimise raw photos -> public/images
```

## Where things live

```
content/
  site.json            business name, phone, address, hours, social links, map
  categories.json      the categories (name, intro, SEO text in en/hi/gu)
  products/<slug>.json one file per category: the products shown in it
messages/              UI text (buttons, nav, labels): en.json hi.json gu.json
public/images/<cat>/   optimised photos
public/brand/          logo.svg, og.png  (placeholders, see TODO)
raw-images/<cat>/      your original downloads (git-ignored)
src/lib/content.ts     the ONLY file that reads content/*.json
src/components/        ui/ (generic), sections/ (page blocks), layout/
```

Components never read JSON directly. To move to a CMS or Supabase later, rewrite `src/lib/content.ts` only.

## Adding a product

1. Put the photo in `raw-images/<category>/`, named descriptively, e.g. `engagement-ring-plate-with-lights.jpg` (the filename becomes part of the URL and helps Google Images).
2. `bun run images` -> creates `public/images/<category>/engagement-ring-plate-with-lights.webp`.
3. Add an entry to `content/products/<category>.json`:

```json
{
  "slug": "ring-plate-with-lights",
  "name": { "en": "Ring plate with lights", "hi": "लाइट वाली रिंग प्लेट", "gu": "લાઇટવાળી રિંગ પ્લેટ" },
  "description": { "en": "Handcrafted ring plate with warm lights. Colours customisable." },
  "images": [
    { "src": "engagement-ring-plate-with-lights.webp",
      "alt": { "en": "Handcrafted engagement ring plate with lights", "gu": "લાઇટવાળી હાથે બનાવેલી સગાઈ રિંગ પ્લેટ" } }
  ],
  "featured": true
}
```

4. `bun run validate`. It reports typos, unknown language keys, missing images and missing translations.

Notes: `hi`/`gu` are optional (English is shown if missing). `"featured": true` puts it on the home page. `"published": false` hides it. The first image is the cover (extra images are stored for the later ordering phase; the gallery currently shows the cover). **Delete the `sample-design-*` placeholder products and `public/images/*/sample-*.webp` once real photos are in**, and update each category's `cover` in `categories.json`.

## Adding a category

Add it to `content/categories.json` (copy an existing one), create `content/products/<slug>.json` (can be `[]`), and add a cover image. It appears in the nav, footer, home page, sitemap and gets its own SEO page automatically.

## TODO before launch

- [ ] **Logo**: replace `public/brand/logo.svg` with her real logo (a stand-in is there now). Ideally also provide a square PNG for Google; Google does not accept SVG logos in structured data.
- [ ] **OG image**: replace `public/brand/og.png` (1200x630) with a nice photo/brand card. This is the preview shown when the link is shared on WhatsApp.
- [ ] **Real photos** (see above), with her permission.
- [ ] **Domain**: edit `url` in `content/site.json` (placeholder `https://dwarkadhish.tekbiz.dev`), or set `NEXT_PUBLIC_SITE_URL` in the host's environment variables.
- [ ] **Address**: confirm street and PIN code (`362560` was inferred for Una, Gujarat; verify it).
- [ ] **Opening hours**: fill `hours` in `site.json` (empty = nothing shown or published).
- [ ] **Second number** (7777905300): not shown anywhere. Decide whether to add it.
- [ ] **Map embed**: optionally add `map.embedUrl` (Google Maps -> Share -> Embed a map) to show a map on /contact.
- [ ] **Translations**: all Hindi/Gujarati text is a first draft. Review with your Gujarati friend, especially the glossary below.
- [ ] Favicon: replace `src/app/favicon.ico`.
- [ ] After deploying: add the site to Google Search Console, submit `/sitemap.xml`, and link the site from her Google Business Profile.

## Translation glossary (please confirm spellings)

| English | Hindi | Gujarati |
|---|---|---|
| Chhab | छाब | છાબ |
| Jamai chhab | जमाई छाब | જમાઈ છાબ |
| Mameru | मामेरा | મામેરું |
| Kunku pagla | कुमकुम पगले | કુંકુ પગલાં |
| Haldi | हल्दी | હળદર |
| Mehendi | मेहंदी | મહેંદી |
| Una | ऊना | ઊના |
| Platter | प्लैटर | પ્લેટર |
| Hamper | हैम्पर | હેમ્પર |

Hindi terms for local ceremonies vary by region; Gujarati speakers also search in Latin letters ("chhab", "chaab"), so both spellings are worth using in descriptions.

## How languages and SEO work

- `src/proxy.ts` rewrites `/about` to the English page; `/hi/...` and `/gu/...` are real URLs; `/en/...` redirects to the unprefixed URL. There is no automatic redirect by browser language, so search engines can crawl every version.
- Every page has its own title/description per language, canonical URL, `hreflang` alternates, Open Graph tags, and `LocalBusiness` / `BreadcrumbList` structured data. `/sitemap.xml` and `/robots.txt` are generated.
- UI strings live in `messages/*.json` (all three files must have identical keys; TypeScript enforces this).

## Deploy (Vercel)

Import the repo on Vercel (it detects Next.js and bun), add the `tekbiz.dev` subdomain under Domains, set `NEXT_PUBLIC_SITE_URL` to the final URL. Later phases (orders, admin, payments) will be added as a separate `src/features/orders/` module plus a database, without changing the portfolio code.
