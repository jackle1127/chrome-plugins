const STORAGE_KEY = 'gdm_enabled';
const toggle = document.getElementById('toggle');
const refreshBtn = document.getElementById('refresh-btn');

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

  // Enable refresh button after toggling (canvas tiles need a reload to fully update)
  refreshBtn.disabled = false;
  refreshBtn.classList.add('enabled');
});

// Refresh the active tab
refreshBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
});
