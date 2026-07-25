// Single place to update before/after deploying. Nothing else in this site
// hardcodes these values -- grep for BNW_CONFIG if you ever need to check.
window.BNW_CONFIG = {
  // App isn't on the Play Store yet -- the APK itself is published as a
  // GitHub Release asset instead. This URL pattern always points at
  // whichever asset named "beawar-news.apk" is attached to the *latest*
  // release, so it never needs updating again once the repo/filename below
  // are correct -- just publish a new release with the same asset name.
  // TODO: replace "FazeFlynn/beawar-news-web" with your actual GitHub
  // "<username>/<repo>" once this site's repo is created.
  apkDownloadUrl: 'https://github.com/FazeFlynn/beawar-news-web/releases/latest/download/beawar-news.apk',

  // Not live yet, but wired up for the day the app does get listed --
  // switching the download button over is a one-line change here.
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.fazeflynn.beawarkinews',
  playStoreLive: false,

  // Matches C:\Na\src\constants\deepLinks.ts's APP_SCHEME exactly -- must
  // stay in sync if that ever changes.
  appScheme: 'beawarnews',

  // TODO: swap for the real inbox before publishing. Nothing else on the
  // site should ever hardcode an email address -- only this file.
  contactEmail: 'contact@beawarnews.in',
};
