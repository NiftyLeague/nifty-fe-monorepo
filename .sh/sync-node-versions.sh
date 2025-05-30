#!/bin/bash
set -euo pipefail

# Fetch Node.js release data and process it
fetch_lts_codename() {
  local major_version="$1"
  local codename=""
  
  # Try to fetch LTS data (with timeout for CI environments)
  releases=$(curl -sSf --connect-timeout 2 https://nodejs.org/dist/index.json || echo "[]")
  
  codename=$(echo "$releases" | \
    jq -r --arg maj "$major_version" \
    '[.[] | select(.lts != false) | select(.version | startswith("v\($maj)."))] | 
     sort_by(.date) | last | .lts? | if . then "lts/\(. | ascii_downcase)" else empty end')

  if [[ -n "$codename" ]]; then
    echo "$codename"
  else
    # If no LTS found, return the raw version
    echo "v$major_version"
  fi
}

# Main script
main() {
  # Read engines.node from package.json
  local node_range=$(jq -r '.engines.node' package.json)
  
  if [[ -z "$node_range" || "$node_range" == "null" ]]; then
    echo "Error: 'engines.node' not specified in package.json" >&2
    exit 1
  fi

  # Get minimum version (handles ranges like ">=20.0.0")
  local min_version=$(node -e "console.log(require('semver').minVersion(process.argv[1]).major)" "$node_range")
  
  if [[ -z "$min_version" ]]; then
    echo "Error: Invalid version range in engines.node: $node_range" >&2
    exit 1
  fi

  # Get LTS codename or fallback to version
  local target_version=$(fetch_lts_codename "$min_version")

  # Write to .nvmrc
  echo "$target_version" > .nvmrc
  echo "Updated .nvmrc to: $target_version"
}

main "$@"