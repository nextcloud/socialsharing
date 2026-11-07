#!/usr/bin/env bash
# SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: AGPL-3.0-or-later
#
# Builds the App Store archive of every app with `make appstore`, as the
# release workflow does, and checks its content: the files a release needs
# must be in it, and the paths the Makefile excludes must not be.
# Expects the apps to be built (js/ present).

set -euo pipefail
cd "$(dirname "$0")/../.."

FAILED=0
for dir in socialsharing_*/; do
	app="${dir%/}"
	[ -f "$app/appinfo/info.xml" ] || continue

	if ! (cd "$app" && make appstore > /dev/null 2> >(grep -v 'private key' >&2)); then
		echo "::error::make appstore failed for $app"
		FAILED=1
		continue
	fi
	archive="$app/build/artifacts/$app.tar.gz"
	if [ ! -f "$archive" ]; then
		echo "::error::$archive was not created"
		FAILED=1
		continue
	fi
	listing=$(tar -tzf "$archive")

	for required in \
		"$app/appinfo/info.xml" \
		"$app/lib/AppInfo/Application.php" \
		"$app/js/$app-user.mjs" \
		"$app/js/$app-user.mjs.license" \
		"$app/img/app.svg" \
		"$app/LICENSE"; do
		grep -qxF "$required" <<< "$listing" || { echo "::error::$archive is missing $required"; FAILED=1; }
	done
	grep -qE "^$app/l10n/[^/]+\.json$" <<< "$listing" || { echo "::error::$archive contains no translations"; FAILED=1; }

	for excluded in .git build composer.json composer.lock Makefile node_modules screenshots tests .tx; do
		if grep -qxF -e "$app/$excluded" -e "$app/$excluded/" <<< "$listing"; then
			echo "::error::$archive contains $app/$excluded, which the Makefile excludes"
			FAILED=1
		fi
	done

	echo "$app: $(wc -l <<< "$listing") entries, $(du -h "$archive" | cut -f1)"
done

exit $FAILED
