# Progressive Blur

Content blurs progressively from edge, creating a depth-of-field effect. Pure CSS.

## Usage

Add `.pb-container` wrapping content with `.pb-overlay` containing 5 `.pb-layer` divs.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--pb-direction` | `to bottom` | Blur direction |
| `--pb-max-blur` | `12px` | Maximum blur at edge |
| `--pb-start` | `40%` | Where blur begins |
