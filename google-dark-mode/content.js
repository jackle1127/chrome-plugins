(function () {
  const CLASS = 'gdm-dark';
  const STORAGE_KEY = 'gdm_enabled';
  const IFRAME_STYLE_ID = 'gdm-iframe-reinvert';

  const isIframe = window !== window.top;

  // --- IFRAME FRAME ---
  // The doc content iframe is same-origin (docs.google.com), so this script runs
  // inside it too. We don't invert here — the parent's filter already does that
  // visually. We only inject a style to re-invert images so they keep original colors.
  if (isIframe) {
    function setIframeReinvert(enabled) {
      let style = document.getElementById(IFRAME_STYLE_ID);
      if (enabled) {
        if (style) return;
        style = document.createElement('style');
        style.id = IFRAME_STYLE_ID;
        style.textContent = 'img, video { filter: invert(1) hue-rotate(180deg) !important; }';
        (document.head || document.documentElement).appendChild(style);
      } else {
        if (style) style.remove();
      }
    }

    chrome.storage.local.get([STORAGE_KEY], (result) => {
      setIframeReinvert(result[STORAGE_KEY] !== false);
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === 'GDM_TOGGLE') setIframeReinvert(msg.enabled);
    });

    return; // nothing else needed in iframes
  }

  // --- TOP FRAME ---
  function setDarkMode(enabled) {
    document.documentElement.classList.toggle(CLASS, enabled);
  }

  chrome.storage.local.get([STORAGE_KEY], (result) => {
    setDarkMode(result[STORAGE_KEY] !== false); // default ON
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'GDM_TOGGLE') {
      setDarkMode(msg.enabled);
      chrome.storage.local.set({ [STORAGE_KEY]: msg.enabled });
    }
  });
})();
