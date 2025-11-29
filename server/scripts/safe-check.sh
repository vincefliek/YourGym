#!/usr/bin/env bash

echo "🔍 Checking for suspicious postinstall scripts..."
echo ""

# Temporary whitelist: package@version
SAFE_PKGS=(
  # check version from package-lock.json
  # run `jq -r '.dependencies["supabase"].version' package-lock.json`
  "supabase@2.63.1"
  "ljharb-monorepo-symlink-test@0.0.0"
)

# Find all packages with postinstall scripts
PACKAGES=$(
  find node_modules -type f -name package.json | while read pkg; do
    if jq empty "$pkg" >/dev/null 2>&1; then
      jq -r 'if (.scripts.postinstall? != null) then "\(.name)@\(.version)" else empty end' "$pkg"
    fi
  done
)

# PACKAGES=$(find node_modules -maxdepth 5 -type f -name package.json \
#   -exec jq -r 'if (.scripts.postinstall? != null) then "\(.name)@\(.version)" else empty end' {} \;)

# Filter out whitelisted packages (only if whitelist not empty)
if [ ${#SAFE_PKGS[@]} -gt 0 ]; then
  SUSPICIOUS=$(echo "$PACKAGES" | grep -v -F -f <(printf "%s\n" "${SAFE_PKGS[@]}"))
else
  SUSPICIOUS="$PACKAGES"
fi

if [ -n "$SUSPICIOUS" ]; then
  echo "⚠️  Found packages with postinstall scripts (not whitelisted):"
  echo "$SUSPICIOUS" | sed 's/^/   • /'
  echo ""
  echo "❌ Commit blocked. Review these packages before proceeding."
  exit 1
fi

echo "✅ No suspicious postinstall scripts found."
exit 0
