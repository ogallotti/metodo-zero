# Meteors

Meteor streaks flying across the screen with glowing trails. Pure CSS animation.

## Usage

Add `.mt-container` with `.mt-meteor` children (one per meteor). All animation is CSS-driven.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--mt-color` | `#6366f1` | Meteor and glow color |
| `--mt-speed` | `3s` | Base animation duration |
| `--mt-angle` | `215deg` | Fall angle |

## Accessibility

Animations are disabled when `prefers-reduced-motion: reduce` is active.
