# Neon Gradient Card

Animated neon gradient border using conic-gradient rotation. Glow intensifies on hover. Pure CSS animation.

## Usage

Add `.neon-card` with `.neon-card__glow` div inside. The `::before` pseudo creates the rotating border, `::after` masks the inner area.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--neon-color-1` | `#ff006e` | Gradient stop 1 |
| `--neon-color-2` | `#8338ec` | Gradient stop 2 |
| `--neon-color-3` | `#3a86ff` | Gradient stop 3 |
| `--neon-speed` | `3s` | Rotation speed |
| `--neon-blur` | `12px` | Glow blur radius |
| `--neon-bg` | `#0f0f23` | Card background |
| `--neon-border-width` | `2px` | Border thickness |
| `--neon-radius` | `16px` | Border radius |
