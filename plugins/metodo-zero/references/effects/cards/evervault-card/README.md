# Evervault Card

Matrix-like random character grid background that scrambles characters near cursor. Characters within the proximity radius highlight and continuously randomize.

## Usage

Add `.ev-card` with `.ev-card__matrix` div. JS auto-populates the character grid based on card dimensions. Content in `.ev-card__content` overlays the matrix with a gradient fade.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--ev-bg` | `#0a0a1a` | Card background |
| `--ev-char-color` | `#3b3b5c` | Base char color |
| `--ev-highlight-color` | `#818cf8` | Active char color |
| `--ev-radius` | `16px` | Border radius |
| `--ev-char-size` | `12px` | Character size |
