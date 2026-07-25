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
| `apkDownloadUrl` | `github.com/beawar-news/BeawarNews/releases/.../beawar-news.apk` | Already points at the real repo. **No release has been published yet**, so this 404s until you publish one — see "Publishing the APK" below. |
| `contactEmail` | `contact@beawarnews.in` | Still a placeholder — your real support/contact inbox. |
| `playStoreUrl` / `playStoreLive` | already correct package id, `playStoreLive: false` | Flip `playStoreLive` to `true` once the app is actually listed — the Play Store button is disabled (greyed out, unclickable) until then. |

### Publishing the APK

1. Repo → **Releases → Draft a new release**.
2. Attach the built `.apk` as a release asset, named **exactly** `beawar-news.apk` (must match `apkDownloadUrl` above).
3. Publish. The download button works immediately after — `/releases/latest/download/...` always resolves to whatever you most recently published, so future updates just mean publishing a new release with the same asset name, no site changes needed.

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

This site is live at `https://beawar-news.github.io/BeawarNews/` — a
GitHub Pages *project* site (not a domain root), which is why the path
includes `/BeawarNews`.

**Already done:**
- `C:\Na\src\constants\deepLinks.ts`'s `PUBLIC_WEB_DOMAIN` →
  `https://beawar-news.github.io/BeawarNews`.
- `C:\Na\android\app\src\main\AndroidManifest.xml`'s App Link `<data>` →
  `android:host="beawar-news.github.io"`,
  `android:pathPrefix="/BeawarNews/n/"`.

**Still needs you** (can't be done from this repo — see
`assetlinks-for-root-domain/README.md` in this project for the full
walkthrough): Android's Digital Asset Links check requires
`assetlinks.json` to be served from the **domain root**
(`beawar-news.github.io/.well-known/assetlinks.json`), which a project
site literally cannot serve — that needs its own separate repo named
exactly `beawar-news.github.io`. Short version:
1. Create that repo, enable Pages on it.
2. Copy `assetlinks-for-root-domain/.well-known/assetlinks.json` into it.
3. Fill in the SHA-256 fingerprint (command's in that README — your
   release build currently signs with the debug keystore, so it's a
   one-liner against `android/app/debug.keystore`).
4. Rebuild the Android app.

Until that's done, shared links still work correctly — they just always
land on this site's `/n/<slug>` fallback page (which tries the
`beawarnews://` custom scheme first, same as always) rather than Android
intercepting the link before the browser even opens. Once App Links are
verified, installed users skip this page entirely and go straight into
the app.

## Local preview

No build step — just open `index.html` directly in a browser, or serve
the folder with any static file server (`npx serve .`, etc.) if you want
`404.html`'s redirect trick to behave exactly like it will on GitHub Pages.
