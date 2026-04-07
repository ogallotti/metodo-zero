# Magic Card

Radial gradient spotlight follows cursor across a grid of cards. All cards in the grid respond to cursor position simultaneously, creating a unified lighting effect with border highlights.

## Usage

Wrap `.magic-card` elements in `.magic-grid`. Mouse tracking is applied at grid level so cards share the coordinate system.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--magic-gradient-size` | `250px` | Spotlight radius |
| `--magic-gradient-color` | `rgba(120,119,198,0.15)` | Spotlight color |
| `--magic-bg` | `#111122` | Card background |
| `--magic-border-color` | `rgba(120,119,198,0.25)` | Border highlight |
| `--magic-radius` | `12px` | Grid border radius |
