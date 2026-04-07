# Macbook Scroll

Product showcase where an image/device transforms in 3D as the user scrolls, revealing content beneath. Inspired by Apple product pages.

## Usage

Wrap the showcase section in `.macbook-pin-wrapper`. The device element `.macbook-device` is pinned and animated via GSAP ScrollTrigger. Include GSAP + ScrollTrigger CDNs before `script.js`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|-|
| `--macbook-rotation-x` | `35deg` | Max X-axis rotation during scroll |
| `--macbook-rotation-y` | `0deg` | Max Y-axis rotation during scroll |
| `--macbook-scale-start` | `1.2` | Initial scale of the device |
| `--macbook-scale-end` | `0.6` | Final scale of the device |
| `--macbook-pin-duration` | `1500px` | Scroll distance the section stays pinned |

## Dependencies

- GSAP 3.12+
- ScrollTrigger plugin

## Accessibility

- Fully disabled when `prefers-reduced-motion: reduce` is active
- Uses GPU-accelerated transforms
