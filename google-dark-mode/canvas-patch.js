(function () {
  'use strict';

  // Runs in the MAIN world so we can patch the real CanvasRenderingContext2D.
  // Goal: invert drawing colors (text, fills, strokes) but leave drawImage
  // untouched — images drawn onto canvas tiles will keep their original colors.
  //
  // CSS applies invert(1) hue-rotate(180deg) to the whole page, then
  // re-inverts .kix-canvas-tile-content, so the net CSS effect on those
  // canvases is zero. The only color change visible in the canvas tiles comes
  // from this JS patch — dark fills become light and vice versa.

  const proto = CanvasRenderingContext2D.prototype;

  function isDark() {
    return document.documentElement.classList.contains('gdm-dark');
  }

  function invertColor(color) {
    if (typeof color !== 'string') return color;

    // Hex #rrggbb or #rrggbbaa
    const hex = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i);
    if (hex) {
      const [, r, g, b, a] = hex;
      return '#'
        + (255 - parseInt(r, 16)).toString(16).padStart(2, '0')
        + (255 - parseInt(g, 16)).toString(16).padStart(2, '0')
        + (255 - parseInt(b, 16)).toString(16).padStart(2, '0')
        + (a || '');
    }

    // Shorthand hex #rgb
    const hex3 = color.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (hex3) {
      const [, r, g, b] = hex3;
      return '#'
        + (15 - parseInt(r, 16)).toString(16)
        + (15 - parseInt(g, 16)).toString(16)
        + (15 - parseInt(b, 16)).toString(16);
    }

    // rgb() / rgba()
    const rgba = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
    if (rgba) {
      const [, r, g, b, a] = rgba;
      const inv = `${255 - parseInt(r)}, ${255 - parseInt(g)}, ${255 - parseInt(b)}`;
      return a !== undefined ? `rgba(${inv}, ${a})` : `rgb(${inv})`;
    }

    return color;
  }

  function patchColorProp(propName) {
    const desc = Object.getOwnPropertyDescriptor(proto, propName);
    if (!desc || !desc.set) return;
    Object.defineProperty(proto, propName, {
      get: desc.get,
      set(value) {
        desc.set.call(this, isDark() ? invertColor(value) : value);
      },
      configurable: true,
    });
  }

  patchColorProp('fillStyle');
  patchColorProp('strokeStyle');
  patchColorProp('shadowColor');
})();
