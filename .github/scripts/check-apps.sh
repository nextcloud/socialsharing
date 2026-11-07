#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: AGPL-3.0-or-later
#
# Checks that the apps in this repository stay consistent with each other:
# the shared files are identical apart from the app id and namespace, every
# app translates with its own id, the info.xml fields that are released
# together match, and every list of apps in the repository names exactly the
# app directories. A file naming a single app refers to it rather than listing
# the apps, and is not checked.

set -euo pipefail
cd "$(dirname "$0")/../.."

SHARED_FILES=(
	.php-cs-fixer.dist.php
	LICENSE
	Makefile
	composer.json
	eslint.config.js
	lib/AppInfo/Application.php
	package.json
	psalm.xml
	stylelint.config.js
	tests/stub.phpstub
	vendor-bin/psalm/composer.json
	vite.config.js
)

APP_LIST_FILES=(
	Makefile
	.github/dependabot.yml
	.github/workflows/*.yml
)

mapfile -t APPS < <(for d in socialsharing_*/; do [ -f "$d/appinfo/info.xml" ] && echo "${d%/}"; done)
[ "${#APPS[@]}" -gt 0 ] || { echo "::error::no app directories found"; exit 1; }
echo "Apps: ${APPS[*]}"

FAILED=0
fail() {
	echo "::error${2:+ file=$2}::$1"
	FAILED=1
}

normalise() {
	local app="$1" short="${1#socialsharing_}"
	local ns="SocialSharing${short^}"
	sed -e "s/$app/APP_ID/g" -e "s/$ns/APP_NAMESPACE/g" "$app/$2"
}

info_field() {
	sed -n "s:.*<$2>\([^<]*\)</$2>.*:\1:p" "$1/appinfo/info.xml" | head -n 1
}

REF="${APPS[0]}"
for file in "${SHARED_FILES[@]}"; do
	for app in "${APPS[@]}"; do
		if [ ! -f "$app/$file" ]; then
			fail "$app/$file is missing" "$app/$file"
		elif [ -f "$REF/$file" ] && ! diff -u --label "$REF/$file" --label "$app/$file" <(normalise "$REF" "$file") <(normalise "$app" "$file"); then
			fail "$app/$file differs from $REF/$file apart from the app id" "$app/$file"
		fi
	done
done

for app in "${APPS[@]}"; do
	for manifest in package.json package-lock.json; do
		name=$(jq -r '.name' "$app/$manifest")
		[ "$name" = "$app" ] || fail "$app/$manifest has name \"$name\", expected \"$app\"" "$app/$manifest"
	done
	lockroot=$(jq -r '.packages[""].name' "$app/package-lock.json")
	[ "$lockroot" = "$app" ] || fail "$app/package-lock.json root package has name \"$lockroot\", expected \"$app\"" "$app/package-lock.json"

	while IFS=: read -r file line match; do
		fail "$file:$line translates with ${match#*(}, expected '$app'" "$file"
	done < <(grep -rnoE "\b[tn]\('[^']*'" "$app/src" | grep -v "('$app'" || true)

	for field in id; do
		value=$(info_field "$app" "$field")
		[ "$value" = "$app" ] || fail "$app/appinfo/info.xml has <$field>$value</$field>, expected $app" "$app/appinfo/info.xml"
	done
done

for field in version licence category website bugs; do
	values=$(for app in "${APPS[@]}"; do info_field "$app" "$field"; done | sort -u)
	[ "$(wc -l <<< "$values")" -eq 1 ] || fail "<$field> differs between the apps: $(tr '\n' ' ' <<< "$values")"
done
ranges=$(for app in "${APPS[@]}"; do grep -oE '<nextcloud [^>]*>' "$app/appinfo/info.xml"; done | sort -u)
[ "$(wc -l <<< "$ranges")" -eq 1 ] || fail "the Nextcloud version range differs between the apps: $(tr '\n' ' ' <<< "$ranges")"

EXPECTED=$(printf '%s\n' "${APPS[@]}" | sort)
for file in "${APP_LIST_FILES[@]}"; do
	listed=$(grep -oE 'socialsharing_[a-z]+' "$file" | sort -u || true)
	[ "$(grep -c . <<< "$listed")" -ge 2 ] || continue
	if [ "$listed" != "$EXPECTED" ]; then
		fail "$file lists the apps \"$(tr '\n' ' ' <<< "$listed")\", expected \"$(tr '\n' ' ' <<< "$EXPECTED")\"" "$file"
	fi
done

if [ "$FAILED" -ne 0 ]; then
	echo "The apps are not consistent, see the errors above."
	exit 1
fi
echo "All ${#APPS[@]} apps are consistent."
