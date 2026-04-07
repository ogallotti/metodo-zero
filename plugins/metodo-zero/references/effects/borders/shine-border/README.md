# Shine Border

Chrome-like shine highlight traveling along border using `conic-gradient` with `@property` angle animation. Base border remains visible while the bright spot orbits.

## Usage

Add `.shine-bdr` class. Pure CSS with mask-composite for border-only rendering.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--shine-bdr-color` | `rgba(255,255,255,0.6)` | Shine color |
| `--shine-bdr-speed` | `4s` | Rotation speed |
| `--shine-bdr-width` | `1px` | Border width |
| `--shine-bdr-radius` | `12px` | Border radius |
| `--shine-bdr-base` | `rgba(255,255,255,0.08)` | Base border |
| `--shine-bdr-bg` | `#111122` | Background |
