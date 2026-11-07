/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Usage: node lockfile-downgrades.mjs <dir with the old lockfiles> [<repository root>]
 *
 * Compares <old dir>/<app>/package-lock.json with <root>/<app>/package-lock.json
 * for every app and prints a Markdown section listing the packages that now
 * resolve to an older version.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const [oldDir, root = '.'] = process.argv.slice(2)
if (!oldDir) {
	console.error('Usage: node lockfile-downgrades.mjs <dir with the old lockfiles> [<repository root>]')
	process.exit(2)
}

const packages = (file) => JSON.parse(readFileSync(file, 'utf8')).packages ?? {}

const parse = (version) => {
	const [release, prerelease] = version.split('+')[0].split(/-(.*)/s)
	return { parts: release.split('.').map(Number), prerelease }
}

const isOlder = (next, previous) => {
	const a = parse(next)
	const b = parse(previous)
	for (let i = 0; i < Math.max(a.parts.length, b.parts.length); i++) {
		const diff = (a.parts[i] ?? 0) - (b.parts[i] ?? 0)
		if (diff !== 0) {
			return diff < 0
		}
	}
	if (a.prerelease === b.prerelease) {
		return false
	}
	if (a.prerelease === undefined || b.prerelease === undefined) {
		return a.prerelease !== undefined
	}
	return a.prerelease.localeCompare(b.prerelease, 'en', { numeric: true }) < 0
}

const rows = []
for (const app of readdirSync(root).filter((name) => existsSync(join(root, name, 'appinfo', 'info.xml'))).sort()) {
	const oldFile = join(oldDir, app, 'package-lock.json')
	const newFile = join(root, app, 'package-lock.json')
	if (!existsSync(oldFile) || !existsSync(newFile)) {
		continue
	}
	const before = packages(oldFile)
	const after = packages(newFile)
	for (const [path, entry] of Object.entries(after)) {
		const previous = before[path]?.version
		if (path === '' || !previous || !entry.version || !isOlder(entry.version, previous)) {
			continue
		}
		const name = path.split('node_modules/').filter(Boolean).map((part) => part.replace(/\/$/, '')).join(' › ')
		rows.push(`| ${app} | \`${name}\` | ${previous} | ${entry.version} | ${entry.dev ? 'no (dev)' : '**yes**'} |`)
	}
}

console.log('## Downgrades\n')
if (rows.length === 0) {
	console.log('No package was moved to an older version.')
} else {
	console.log('`npm audit fix` resolved these packages to an **older** version than before, usually because the newer versions still depend on a vulnerable package:\n')
	console.log('| App | Package | Before | After | Shipped |')
	console.log('| --- | --- | --- | --- | --- |')
	console.log(rows.join('\n'))
}
