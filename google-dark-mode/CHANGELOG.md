# Changelog

## [1.2.2] - 2026-04-20
### Fixed
- Google Slides no longer affected by dark mode (extension excluded from `docs.google.com/presentation/*`)
- Google Account popup avatar photo no longer appears inverted - iframes are double-inverted back to original colors

## [1.2.1] - 2026-04-10
### Fixed
- Canvas text colors now match the CSS filter exactly - applied `invert(1) hue-rotate(180deg)` in `canvas-patch.js` instead of invert-only, so hues are consistent between UI and document canvas

## [1.2.0] - 2026-04-08
### Changed
- Renamed extension to "Google Docs Dark Mode"
- New icon design

### Added
- Google Sheets dark mode support (pure CSS inversion, no canvas patching)
- Refresh button in popup (enabled after toggling) to clear stale canvas pixels

### Fixed
- Canvas-patch.js scoped to `/document/*` only - prevents double-inversion on Google Sheets

## [1.1.0]
### Added
- Extension icon used in popup header

## [1.0.0]
### Added
- Initial release
- Dark mode for Google Docs via triple-inversion: CSS inverts page, CSS re-inverts canvas tiles, JS canvas-patch inverts draw calls (preserving images drawn via `drawImage`)
- Persistent toggle via `chrome.storage`
