# Beawar Ki News — Website

Static marketing site + APK download page + shared-article deep-link
fallback for the Beawar Ki News app. Plain HTML/CSS/JS, no build step —
deploy as-is to GitHub Pages.

## Structure

```
index.html        Landing page (features, coverage area, download CTA)
privacy.html       Privacy Policy
n/index.html        Deep-link resolver: tries to open a shared article in
                    the app, falls back to the download page if it can't
404.html            GitHub Pages has no server routing, so a request for
                    /n/<slug> (one URL per article, can't be a real file)
                    lands here and forwards to n/index.html?slug=...
assets/css/style.css  Design tokens mirror C:\Na\global.css exactly (same
                       light/dark colors as the app itself)
assets/js/config.js    Every placeholder value (see below) lives ONLY here
assets/js/main.js      Nav, scroll-reveal, sticky download bar, config wiring
assets/js/deeplink.js  n/index.html's "try the app, else fallback" logic
assets/img/            Logo already in place; landmark/screenshot images
                       are placeholders (see below)
```

## Before you deploy — placeholders to fill in

All of these live in **`assets/js/config.js`** — that's the only file you
should need to touch:

| Value | Current placeholder | What to set it to |
|---|---|---|
| `apkDownloadUrl` | `github.com/FazeFlynn/beawar-news-web/releases/.../beawar-news.apk` | Update the `FazeFlynn/beawar-news-web` part to your real `<username>/<repo>` once this site's repo exists. Keep publishing the APK as a GitHub **Release** asset named exactly `beawar-news.apk` — the `/releases/latest/download/...` URL then always points at whatever you most recently released, no further edits needed. |
| `contactEmail` | `contact@beawarnews.in` | Your real support/contact inbox. |
| `playStoreUrl` / `playStoreLive` | already correct package id, `playStoreLive: false` | Flip `playStoreLive` to `true` once the app is actually listed — the Play Store button is disabled (greyed out, unclickable) until then. |

Images still needed in `assets/img/` (the app logo is already there, copied
from `C:\Na\launcher_icons`):

- `screenshot-home.png` — a real screenshot of the app's home feed, referenced
  in `index.html`'s hero phone mockup.
- `landmark-1.jpg` … `landmark-4.jpg` — Beawar landmark photos for the
  gallery section near the bottom of the homepage.

Both are left as clearly-labeled placeholder boxes in `index.html` until
you drop the real files in (same filenames, same folder).

## Deploying to GitHub Pages

1. Create a repo (e.g. `beawar-news-web`), push this folder's contents to
   its default branch.
2. Repo → **Settings → Pages** → Source: deploy from the default branch,
   root folder.
3. Publish the app's `.apk` as a **GitHub Release** in the *same* repo,
   with the asset named `beawar-news.apk` (must match `config.js`'s
   `apkDownloadUrl` exactly, including case).
4. Update `assets/js/config.js`'s `apkDownloadUrl`/`contactEmail` if you
   haven't already.

## Wiring up real "tap a shared link → opens the app" behavior

Right now, sharing an article from the app produces a link like
`https://your-dashboard-domain.example.com/n/<slug>` — a placeholder
domain (see `C:\Na\src\constants\deepLinks.ts`). Once this site is live:

1. Note the exact URL GitHub Pages gives you (e.g.
   `https://fazeflynn.github.io/beawar-news-web` for a project site, or a
   custom domain if you set one up in repo Settings → Pages).
2. Update **`C:\Na\src\constants\deepLinks.ts`**'s `PUBLIC_WEB_DOMAIN` to
   that exact URL (protocol included, no trailing slash).
3. Update **`C:\Na\android\app\src\main\AndroidManifest.xml`**'s App Link
   `<data android:host="..." />` to match the same domain, and rebuild the
   app.
4. Host a `.well-known/assetlinks.json` at that domain (a file in *this*
   repo, at `.well-known/assetlinks.json`, works fine for GitHub Pages)
   declaring your app's package name and signing certificate SHA-256
   fingerprint — get the fingerprint from your release keystore
   (`keytool -list -v -keystore <your-keystore>`), not something this
   project can generate for you.

Until all four of those are done, shared links still work correctly —
they just always land on this site's `/n/<slug>` fallback page (which
tries the `beawarnews://` custom scheme first, same as always) rather
than Android intercepting the link before the browser even opens. Once
App Links are verified, installed users skip this page entirely and go
straight into the app.

## Local preview

No build step — just open `index.html` directly in a browser, or serve
the folder with any static file server (`npx serve .`, etc.) if you want
`404.html`'s redirect trick to behave exactly like it will on GitHub Pages.
