# Expandable Cards

Cards expand to a full detail modal view on click. Overlay dims background. Closes on overlay click, close button, or Escape key. Keyboard accessible.

## Usage

Each `.exp-card` needs an image, visible body, and hidden `.exp-card__detail` for expanded content. Shared `.exp-overlay` and `.exp-expanded` elements handle the modal.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--exp-bg` | `#141428` | Card/modal background |
| `--exp-radius` | `16px` | Border radius |
| `--exp-transition` | `400ms` | Animation speed |
| `--exp-overlay` | `rgba(0,0,0,0.6)` | Overlay color |
