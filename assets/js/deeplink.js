(function () {
  var cfg = window.BNW_CONFIG || {};
  var params = new URLSearchParams(window.location.search);
  var slug = params.get('slug');

  // How long to wait for the custom-scheme redirect below to actually hand
  // off to the app before assuming it isn't installed and showing the
  // download prompt instead. There's no reliable "the app just opened"
  // signal on the web -- this timeout is the standard, if imperfect,
  // approach every app's deep-link fallback page uses.
  var FALLBACK_DELAY_MS = 1800;

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-bnw="download-apk"]').forEach(function (el) {
      el.href = cfg.apkDownloadUrl;
    });

    var spinner = document.getElementById('resolver-spinner');
    var opening = document.getElementById('resolver-opening');
    var fallback = document.getElementById('resolver-fallback');

    function showFallback() {
      if (spinner) spinner.style.display = 'none';
      if (opening) opening.style.display = 'none';
      if (fallback) fallback.style.display = 'block';
    }

    if (!slug) {
      // Someone opened /n/ directly, with nothing to resolve -- straight to
      // the download prompt, no point trying to open the app for "nothing".
      showFallback();
      return;
    }

    var appUrl = cfg.appScheme + '://n/' + encodeURIComponent(slug);
    var timer = setTimeout(showFallback, FALLBACK_DELAY_MS);

    // If the OS actually switches to the app, this tab gets backgrounded --
    // cancel the fallback so it doesn't fire once the user comes back later.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearTimeout(timer);
    });

    window.location.href = appUrl;
  });
})();
