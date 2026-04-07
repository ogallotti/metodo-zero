# Electric Border

Canvas-based lightning arcs crackling along the perimeter. Uses recursive midpoint displacement for jagged bolt generation. Arcs flicker and randomly reposition.

## Usage

Add `.elec-bdr` with `<canvas class="elec-bdr__canvas"></canvas>` and `.elec-bdr__glow` div.

## CSS Custom Properties

| Property | Default | Description |
|-|-|
| `--elec-color` | `#38bdf8` | Lightning color |
| `--elec-intensity` | `6` | Number of arcs |
| `--elec-speed` | `60ms` | Flicker interval |
| `--elec-radius` | `12px` | Border radius |
| `--elec-bg` | `#0c0c20` | Background |
