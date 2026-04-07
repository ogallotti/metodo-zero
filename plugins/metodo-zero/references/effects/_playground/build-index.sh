#!/bin/bash
# Build effects-index.json from all meta.json files
# Run from the _playground/ directory

EFFECTS_DIR="$(dirname "$0")/.."
OUTPUT="$(dirname "$0")/effects-index.json"

echo "["
first=true

for meta in "$EFFECTS_DIR"/*/meta.json "$EFFECTS_DIR"/*/*/meta.json; do
  [ -f "$meta" ] || continue

  if [ "$first" = true ]; then
    first=false
  else
    echo ","
  fi

  cat "$meta"
done

echo "]"
