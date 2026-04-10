(function () {
  'use strict';

  // Runs in the MAIN world so we can patch the real CanvasRenderingContext2D.
  // Goal: invert drawing colors (text, fills, strokes) but leave drawImage
  // untouched — images drawn onto canvas tiles will keep their original colors.
  //
  // Applies invert(1) hue-rotate(180deg) to match the CSS filter on the page,
  // so canvas text colors are treated consistently with the rest of the UI.

  const proto = CanvasRenderingContext2D.prototype;

  function isDark() {
    return document.documentElement.classList.contains('gdm-dark');
  }

  // Parse any CSS color string to [r, g, b, a] (0-255, alpha 0-1)
  function parseColor(color) {
    if (typeof color !== 'string') return null;

    const hex6 = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i);
    if (hex6) {
      const [, r, g, b, a] = hex6;
      return [parseInt(r,16), parseInt(g,16), parseInt(b,16), a ? parseInt(a,16)/255 : 1];
    }

    const hex3 = color.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    if (hex3) {
      const [, r, g, b] = hex3;
      return [parseInt(r+r,16), parseInt(g+g,16), parseInt(b+b,16), 1];
    }

    const rgba = color.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)$/);
    if (rgba) {
      return [parseFloat(rgba[1]), parseFloat(rgba[2]), parseFloat(rgba[3]), rgba[4] !== undefined ? parseFloat(rgba[4]) : 1];
    }

    return null;
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s, l];
  }

  function hslToRgb(h, s, l) {
    h /= 360;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // Apply invert(1) hue-rotate(180deg) — matches the CSS filter on the page
  function transformColor(color) {
    const parsed = parseColor(color);
    if (!parsed) return color;

    let [r, g, b, a] = parsed;

    // invert(1)
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    // hue-rotate(180deg)
    let [h, s, l] = rgbToHsl(r, g, b);
    h = (h + 180) % 360;
    [r, g, b] = hslToRgb(h, s, l);

    const rh = r.toString(16).padStart(2, '0');
    const gh = g.toString(16).padStart(2, '0');
    const bh = b.toString(16).padStart(2, '0');
    return a < 1 ? `rgba(${r},${g},${b},${a})` : `#${rh}${gh}${bh}`;
  }

  function patchColorProp(propName) {
    const desc = Object.getOwnPropertyDescriptor(proto, propName);
    if (!desc || !desc.set) return;
    Object.defineProperty(proto, propName, {
      get: desc.get,
      set(value) {
        desc.set.call(this, isDark() ? transformColor(value) : value);
      },
      configurable: true,
    });
  }

  patchColorProp('fillStyle');
  patchColorProp('strokeStyle');
  patchColorProp('shadowColor');
})();
