#!/usr/bin/env bash
set -euo pipefail

README_PATH="$1"
VERSION="$2"

MARKER_START="<!-- SKYFLOW-BETA-DISCLAIMER:START -->"
MARKER_END="<!-- SKYFLOW-BETA-DISCLAIMER:END -->"

BANNER_TEXT="> ⚠️ **Beta release — not for production use.** This is a pre-release build provided for early testing and feedback. It has not completed Skyflow's General Availability (GA) validation, its API may change before the stable release, and it is not covered by production SLAs or support commitments. Do not deploy beta builds to production environments."

TEMP_FILE=$(mktemp)
trap "rm -f $TEMP_FILE" EXIT

if [[ "$VERSION" =~ -beta\.[0-9]+ ]]; then
  # Insert banner if not already present
  if ! grep -qF "$MARKER_START" "$README_PATH"; then
    # Find the first heading and insert banner after it
    awk -v marker_start="$MARKER_START" -v marker_end="$MARKER_END" -v banner_text="$BANNER_TEXT" '
      NR == 1 && /^#/ {
        print $0
        print ""
        print marker_start
        print banner_text
        print marker_end
        print ""
        next
      }
      { print }
    ' "$README_PATH" > "$TEMP_FILE"
    mv "$TEMP_FILE" "$README_PATH"
  fi
else
  # Remove banner if present
  if grep -qF "$MARKER_START" "$README_PATH"; then
    awk '
      /<!-- SKYFLOW-BETA-DISCLAIMER:START -->/ { skip = 1; next }
      /<!-- SKYFLOW-BETA-DISCLAIMER:END -->/ { skip = 0; next }
      !skip { print }
    ' "$README_PATH" > "$TEMP_FILE"
    mv "$TEMP_FILE" "$README_PATH"
  fi
fi
