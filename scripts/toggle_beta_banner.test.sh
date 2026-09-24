#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOGGLE="$SCRIPT_DIR/toggle_beta_banner.sh"
FIXTURE="$(mktemp)"
MARKER_START="<!-- SKYFLOW-BETA-DISCLAIMER:START -->"
BANNER_TEXT="> ⚠️ **Beta release — not for production use.** This is a pre-release build provided for early testing and feedback. It has not completed Skyflow's General Availability (GA) validation, its API may change before the stable release, and it is not covered by production SLAs or support commitments. Do not deploy beta builds to production environments."

fail() {
    echo "FAIL: $1"
    rm -f "$FIXTURE"
    exit 1
}

cat > "$FIXTURE" <<'EOF'
# Skyflow React Native SDK

Skyflow's React Native SDK intro text.
EOF

# Test 1: Insert banner for -beta.N version
"$TOGGLE" "$FIXTURE" "1.9.0-beta.1"
[ "$(grep -c -F "$MARKER_START" "$FIXTURE")" -eq 1 ] || fail "banner not inserted for beta version"
grep -qF "$BANNER_TEXT" "$FIXTURE" || fail "banner text not verbatim"

# Test 2: No duplication on repeat run
"$TOGGLE" "$FIXTURE" "1.9.0-beta.1"
[ "$(grep -c -F "$MARKER_START" "$FIXTURE")" -eq 1 ] || fail "banner duplicated on repeat run"

# Test 3: Remove banner for GA version
"$TOGGLE" "$FIXTURE" "1.9.0"
[ "$(grep -c -F "$MARKER_START" "$FIXTURE")" -eq 0 ] || fail "banner not removed for GA version"

# Test 4: Verify content preservation
grep -qF "intro text." "$FIXTURE" || fail "original README content lost"

# Test 5: Verify -dev versions do NOT insert banner (regex should match -beta.N specifically, not -dev.N)
cat > "$FIXTURE" <<'EOF'
# Skyflow React Native SDK

Skyflow's React Native SDK intro text.
EOF
"$TOGGLE" "$FIXTURE" "1.9.0-dev.1"
[ "$(grep -c -F "$MARKER_START" "$FIXTURE")" -eq 0 ] || fail "banner incorrectly inserted for -dev version"

# Test 6: Verify exact regex match (versions like "mybeta1" should not match)
cat > "$FIXTURE" <<'EOF'
# Skyflow React Native SDK

Skyflow's React Native SDK intro text.
EOF
"$TOGGLE" "$FIXTURE" "1.9.0beta.1"
[ "$(grep -c -F "$MARKER_START" "$FIXTURE")" -eq 0 ] || fail "banner incorrectly inserted for version without dash"

rm -f "$FIXTURE"
echo "PASS: toggle_beta_banner.sh"
