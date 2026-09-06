# Serhii Appliances Services — remodelingsupplier.us

Static marketing site for appliance repair and installation in Central Florida. Public name is **Serhii Appliances Services**. The domain stays **remodelingsupplier.us**.

Coverage called out on the site and in SEO copy:

- Primary cities: **Orlando, Kissimmee, St. Cloud**
- Radius: about **100 miles from downtown Orlando, FL**
- Secondary: other Central Florida towns inside that ring

There is no application server. Open `index.html` locally or drop the folder on any static host.

## Edit business details

All public contact fields live in **`js/config.js`**:

| Field | Current value |
| --- | --- |
| `BUSINESS_NAME` | Serhii Appliances Services |
| `PHONE` | (813) 382-7292 — `tel:` links use `+18133827292` |
| `EMAIL` | sergeyvirych81@yahoo.com (quote and contact mailto) |
| `ADDRESS` | `REPLACE_WITH_ADDRESS` until a street address exists |
| `INSTAGRAM_URL` | https://www.instagram.com/sserge_sserge |
| `FACEBOOK_URL` | https://www.facebook.com/share/19X2FFmokt/?mibextid=wwXIfr |
| `TIKTOK_URL` | https://www.tiktok.com/@guestintime |
| `OTHER_LINKS` | Optional extra footer links |
| `FORMSPREE_QUOTE` / `FORMSPREE_CONTACT` | Empty — forms use mailto |
| `SITE_URL` | https://remodelingsupplier.us |

The official logo is `assets/logo.png` (header and brand mark). `assets/favicon.png` is a square crop for the tab icon.

Empty strings and `REPLACE_WITH_*` values stay hidden. Instagram, Facebook, and TikTok show in the header and footer whenever their URLs are non-empty.

After you change NAP fields, skim the `<title>`, meta tags, and the static JSON-LD block in `index.html` if you want non-JS crawlers to see the same text. `js/site.js` refreshes `#business-jsonld` from this config at runtime.

## Forms

Two forms ship on the home page and again on clean URLs:

1. **Request a quote** — `/` `#quote` and `/quote/`  
   Name, phone, email, city/ZIP, appliance type, issue
2. **Get information** — `/` `#contact` and `/contact/`  
   Name, phone or email, message

**Default (mailto):** submit opens the visitor’s email app to `sergeyvirych81@yahoo.com`.

**Formspree (optional):** paste an endpoint into `FORMSPREE_QUOTE` and/or `FORMSPREE_CONTACT`. There is no custom backend in this repo.

A hidden `website` field is a basic honeypot for bots.

## Local preview

```bash
python3 -m http.server 8080
```

Open http://localhost:8080

## Deploy

Publish the **repository root**. No build step.

### Netlify

1. New site from Git, or drag this folder onto Netlify Drop.
2. Publish directory: `.`
3. Add `remodelingsupplier.us` and `www.remodelingsupplier.us`.

### Vercel

1. Import the Git repo (framework: Other).
2. Add `remodelingsupplier.us` under Domains.

### GitHub Pages

1. Settings → Pages → deploy from a branch (`main`, `/` root).
2. `CNAME` is already `remodelingsupplier.us`.

### IONOS (or any FTP host)

1. Upload every file except `.git`.
2. Make `index.html` the directory index.

## Point remodelingsupplier.us DNS

Use the records your host shows on its custom-domain screen:

| Host | Type | Value |
| --- | --- | --- |
| `www` | `CNAME` | the hostname your host gives you |
| `@` (apex) | `A`, `ALIAS`, or `ANAME` | from that same screen |

Turn on HTTPS after DNS is live.

## Site map

| URL | Purpose |
| --- | --- |
| `/` | Landing page: hero, services, area, how it works, both forms, FAQ |
| `/quote/` | Quote form |
| `/contact/` | Information / contact form |
| `/privacy/` | Short privacy note |
| `/robots.txt` | Allow indexing + sitemap |
| `/sitemap.xml` | Canonical URLs |
