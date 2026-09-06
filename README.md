# Remodeling Supplier — remodelingsupplier.us

Static marketing site for appliance repair and installation in Central Florida. Public name is **Remodeling Supplier** for now and can be swapped later.

Coverage called out on the site and in SEO copy:

- Primary cities: **Orlando, Kissimmee, St. Cloud**
- Radius: about **100 miles from downtown Orlando, FL**
- Secondary: other Central Florida towns inside that ring

There is no application server. Open `index.html` locally or drop the folder on any static host.

## Edit business details

All public contact fields live in **`js/config.js`**:

| Field | What to put |
| --- | --- |
| `BUSINESS_NAME` | Public company name (placeholder today) |
| `PHONE` | Real number, or leave `REPLACE_WITH_PHONE` |
| `EMAIL` | Inbox for mailto forms, or leave `REPLACE_WITH_EMAIL` |
| `ADDRESS` | Street address when you have one, or leave `REPLACE_WITH_ADDRESS` |
| `INSTAGRAM_URL` | Full profile URL, or `""` to hide the link |
| `FACEBOOK_URL` | Full profile URL, or `""` to hide the link |
| `OTHER_LINKS` | Optional `{ label, url }` objects (Google Business Profile, etc.) |
| `FORMSPREE_QUOTE` / `FORMSPREE_CONTACT` | Formspree endpoints, or `""` |
| `SITE_URL` | Canonical origin, already set to `https://remodelingsupplier.us` |

Do not invent phone numbers, street addresses, licenses, or social handles. Empty strings and `REPLACE_WITH_*` values stay hidden in the header and footer.

After you change `BUSINESS_NAME` or NAP fields, also skim the `<title>`, meta tags, and the static JSON-LD block in `index.html` if you want crawlers that do not run JavaScript to see the same text. `js/site.js` refreshes the `#business-jsonld` block from this config at runtime.

## Forms

Two forms ship on the home page and again on clean URLs:

1. **Request a quote** — `/` `#quote` and `/quote/`  
   Name, phone, email, city/ZIP, appliance type, issue
2. **Get information** — `/` `#contact` and `/contact/`  
   Name, phone or email, message

**Default (mailto):** leave the Formspree fields empty and set `EMAIL`. Submit opens the visitor’s email app with the message filled in.

**Formspree:** create a form at [formspree.io](https://formspree.io), then paste the endpoint (example: `https://formspree.io/f/xxxxxxxx`) into `FORMSPREE_QUOTE` and/or `FORMSPREE_CONTACT`. Confirm the same email in Formspree’s dashboard. There is no custom backend in this repo.

A hidden `website` field is a basic honeypot for bots.

## Local preview

```bash
# any static server; examples:
python3 -m http.server 8080
npx --yes serve -l 8080
```

Open http://localhost:8080

## Deploy

Publish the **repository root** (this folder). No build step.

### Netlify

1. New site from Git, or drag this folder onto Netlify Drop.
2. Publish directory: `.` (or leave the build command blank).
3. `netlify.toml` already sets security headers and `/quote` → `/quote/` redirects.
4. Domain settings → add `remodelingsupplier.us` and `www.remodelingsupplier.us`.

### Vercel

1. Import the Git repo.
2. Framework preset: Other. Output is the repo root.
3. `vercel.json` enables clean URLs with trailing slashes.
4. Project → Domains → add `remodelingsupplier.us`.

### GitHub Pages

1. Repo **Settings → Pages**.
2. Source: Deploy from a branch (`main`, `/` root).
3. `CNAME` is already `remodelingsupplier.us`. `.nojekyll` stops Jekyll from ignoring folders.
4. After the first Pages deploy, GitHub will show the DNS records to use.

### IONOS (or any FTP/S3 static host)

1. Upload every file and folder in this repo except `.git`.
2. Make sure `index.html` is the directory index.
3. Point the domain’s document root at that upload folder.

### Render (optional)

Create a **Static Site**. Build command can be empty. Publish directory: `.`

## Point remodelingsupplier.us DNS

Use the exact records your host shows in its “custom domain” screen. Typical pattern:

| Host | Type | Value |
| --- | --- | --- |
| `www` | `CNAME` | the hostname your host gives you (e.g. `something.netlify.app`) |
| `@` (apex) | `A`, `ALIAS`, or `ANAME` | the apex instructions from that same screen |

Notes:

- GitHub Pages often wants `A` records to their published IPs **or** an apex `CNAME` if they still allow it — copy what Pages displays, do not guess IPs from an old blog post.
- After DNS is live, turn on HTTPS in the host dashboard (Let’s Encrypt is automatic on Netlify, Vercel, GitHub Pages, and Render).
- Keep `CNAME` in this repo matching `remodelingsupplier.us` if you stay on GitHub Pages.

WHOIS/registrar (IONOS or otherwise) only needs those DNS records. You do not need a second copy of the site at the registrar if the host is already serving files.

## Site map

| URL | Purpose |
| --- | --- |
| `/` | Landing page: hero, services, area, how it works, both forms, FAQ |
| `/quote/` | Quote form (standalone) |
| `/contact/` | Information / contact form |
| `/privacy/` | Short privacy note |
| `/robots.txt` | Allow indexing + sitemap pointer |
| `/sitemap.xml` | Canonical URLs |

## SEO already included

- Unique title and meta description aimed at appliance repair in Orlando, Kissimmee, and St. Cloud
- Meta keywords, Open Graph, and Twitter card tags
- Semantic headings and a LocalBusiness / HomeAndConstructionBusiness JSON-LD graph with placeholder NAP
- `robots.txt` and `sitemap.xml`
- Mobile-first HTML/CSS, labeled forms, skip link, visible focus, and contrast-checked colors

When the real phone, email, and address exist, replace the placeholders and request indexing in [Google Search Console](https://search.google.com/search-console) for `https://remodelingsupplier.us/`.
