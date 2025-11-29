#!/usr/bin/env bash

echo "🔍 Checking for suspicious postinstall scripts..."
echo ""

# Temporary whitelist: package@version
SAFE_PKGS=(
  # check version from package-lock.json
  # run `jq -r '.dependencies["core-js"].version' package-lock.json`
  "core-js@3.21.1"
  # check version from package-lock.json
  # run `jq -r '.dependencies["core-js-pure"].version' package-lock.json`
  "core-js-pure@3.42.0"
)

# Find all packages with postinstall scripts
PACKAGES=$(find node_modules -maxdepth 2 -type f -name package.json \
  -exec jq -r 'if (.scripts.postinstall? != null) then "\(.name)@\(.version)" else empty end' {} \;)

# Filter out whitelisted packages
SUSPICIOUS=$(echo "$PACKAGES" | grep -v -F -f <(printf "%s\n" "${SAFE_PKGS[@]}"))

if [ -n "$SUSPICIOUS" ]; then
  echo "⚠️  Found packages with postinstall scripts (not whitelisted):"
  echo "$SUSPICIOUS" | sed 's/^/   • /'
  echo ""
  echo "❌ Commit blocked. Review these packages before proceeding."
  exit 1
fi

echo "✅ No suspicious postinstall scripts found."
exit 0
