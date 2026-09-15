#!/usr/bin/env python3
"""sRGB <-> OKLCH conversion and WCAG contrast, for building and verifying the theme.

No dependencies. Used to derive the daisyUI theme from the Colly mascot palette and to
prove every -content pair clears its target ratio instead of eyeballing it.
"""
import math

def _srgb_to_lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

def _lin_to_srgb(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055

def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))

def rgb_to_hex(rgb):
    return "#" + "".join(f"{max(0, min(255, round(c * 255))):02x}" for c in rgb)

def rgb_to_oklch(rgb):
    r, g, b = (_srgb_to_lin(c) for c in rgb)
    l = (0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) ** (1 / 3)
    m = (0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) ** (1 / 3)
    s = (0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b) ** (1 / 3)
    L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
    a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
    bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
    C = math.hypot(a, bb)
    H = math.degrees(math.atan2(bb, a)) % 360
    return L, C, H

def oklch_to_rgb(L, C, H):
    a = C * math.cos(math.radians(H))
    b = C * math.sin(math.radians(H))
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
    s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return tuple(min(1.0, max(0.0, _lin_to_srgb(c))) for c in (r, g, bl))

def oklch_str(L, C, H):
    return f"oklch({L * 100:.1f}% {C:.3f} {H:.1f})"

def luminance(rgb):
    r, g, b = (_srgb_to_lin(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def contrast(rgb1, rgb2):
    a, b = luminance(rgb1), luminance(rgb2)
    hi, lo = max(a, b), min(a, b)
    return (hi + 0.05) / (lo + 0.05)

def grade(ratio):
    return "AAA" if ratio >= 7 else "AA" if ratio >= 4.5 else "AA-large" if ratio >= 3 else "FAIL"

if __name__ == "__main__":
    mascot = {
        "teal foncé": "#325656",
        "sauge":      "#86a79c",
        "crème":      "#e3d9c1",
        "orange":     "#df8d4f",
    }
    print("Palette de la mascotte Colly, échantillonnée sur la planche :\n")
    for name, h in mascot.items():
        L, C, H = rgb_to_oklch(hex_to_rgb(h))
        print(f"  {name:<12} {h}  {oklch_str(L, C, H)}")
