# 3D Tilt Card

Card tilts in 3D following cursor position with depth layers, shine overlay, and dynamic shadow. Uses `perspective` and `transform-style: preserve-3d` for true 3D depth with child elements at different Z-levels.

## Usage

Wrap `.tilt-card` in `.tilt-card-wrapper` (provides perspective context). Inner elements use `translateZ()` for parallax depth.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--tilt-max` | `15deg` | Maximum tilt angle |
| `--tilt-shine-opacity` | `0.3` | Shine layer opacity |
| `--tilt-perspective` | `800px` | Perspective distance |
| `--tilt-scale` | `1.05` | Scale on hover |
| `--tilt-transition` | `400ms` | Transition speed |
| `--tilt-bg` | `#1a1a2e` | Card background |
| `--tilt-radius` | `16px` | Border radius |
