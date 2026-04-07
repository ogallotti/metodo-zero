# Flip Card

3D card flip revealing backside content. Supports hover and click trigger modes via `data-trigger` attribute. Uses `backface-visibility` and `preserve-3d`.

## Usage

Set `data-trigger="hover"` or `data-trigger="click"`. Front face in `.flip-card__front`, back in `.flip-card__back`.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--flip-speed` | `600ms` | Flip animation speed |
| `--flip-perspective` | `1000px` | 3D perspective |
| `--flip-front-bg` | `#1a1a2e` | Front background |
| `--flip-back-bg` | `#16213e` | Back background |
| `--flip-radius` | `16px` | Border radius |
