# Liquid Button

Gooey/liquid morphing button using SVG `feGaussianBlur` + `feColorMatrix` filter. Blob elements emerge on hover and merge with button surface.

## Usage

Include SVG filter definition. Wrap `.liq-btn` and `.liq-btn__blob` spans in `.liq-btn-wrap` with `filter: url(#liq-goo)`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--liq-bg` | `#6366f1` | Button/blob color |
| `--liq-color` | `#ffffff` | Text color |
| `--liq-radius` | `24px` | Border radius |
| `--liq-goo-intensity` | `12` | SVG blur amount |
