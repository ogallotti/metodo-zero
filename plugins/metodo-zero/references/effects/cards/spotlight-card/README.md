# Spotlight Card

Radial spotlight glow follows cursor across card surface. Border also illuminates near cursor position using mask-composite technique.

## Usage

Add `.spotlight-card` class. Wrap multiple cards in `.spotlight-group` for grid layout. JS tracks cursor position via CSS custom properties.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--spot-radius` | `300px` | Spotlight radius |
| `--spot-color` | `rgba(120,119,198,0.3)` | Spotlight color |
| `--spot-border-color` | `rgba(120,119,198,0.4)` | Border glow color |
| `--spot-bg` | `#16162a` | Card background |
| `--spot-radius-border` | `12px` | Border radius |
