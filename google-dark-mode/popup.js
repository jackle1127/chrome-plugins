const STORAGE_KEY = 'gdm_enabled';
const toggle = document.getElementById('toggle');
const refreshRow = document.getElementById('refresh-row');
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

  // Show refresh hint for Docs (canvas tiles need a reload to fully update)
  refreshRow.classList.add('visible');
});

// Refresh the active tab
refreshBtn.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
});
