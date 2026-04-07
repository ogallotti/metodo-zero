# Card Stack

Stacked cards that fan out on hover and/or when scrolled into view. Uses CSS transforms for positioning with IntersectionObserver for scroll triggering.

## Usage

Wrap `.stack-card` elements in `.stack-container`. Add `data-scroll-trigger` attribute for scroll-based fan animation.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--stack-offset` | `12px` | Vertical offset between cards |
| `--stack-rotation` | `3deg` | Fan rotation angle |
| `--stack-spread` | `60px` | Horizontal spread distance |
| `--stack-bg` | `#1a1a2e` | Card background |
| `--stack-radius` | `16px` | Border radius |
