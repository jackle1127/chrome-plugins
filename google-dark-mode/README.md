# Google Docs Dark Mode

A Chrome extension that applies dark mode to Google Docs by inverting colors while preserving the original appearance of images and media.

## How it works

- Applies `filter: invert(1) hue-rotate(180deg)` to the `<html>` element to flip the entire page dark
- Counter-applies the same filter to `<img>`, `<canvas>`, `<video>`, and `<iframe>` elements so they render with original colors
- Uses a `MutationObserver` to handle lazily loaded iframes as Google Docs injects them dynamically
- Persists on/off state via `chrome.storage.local` across reloads and new tabs
- Dark mode is enabled by default on first install

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest (MV3) |
| `dark.css` | Injected CSS - applies invert filter and re-inverts media |
| `canvas-patch.js` | Patches canvas rendering before the page loads |
| `content.js` | Reads persisted state, toggles the CSS class, listens for popup messages |
| `popup.html` | Toggle UI |
| `popup.js` | Reads/writes storage and sends toggle message to the active tab |
| `icons/` | Extension icons (16, 48, 128px) |

## Installation

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select this folder
