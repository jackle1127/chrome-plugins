const STORAGE_KEY = 'gdm_enabled';
const toggle = document.getElementById('toggle');

// Load current state
chrome.storage.local.get([STORAGE_KEY], (result) => {
  toggle.checked = result[STORAGE_KEY] !== false; // default ON
});

// Send toggle message to the active tab's content script
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ [STORAGE_KEY]: enabled });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'GDM_TOGGLE', enabled });
    }
  });
});
