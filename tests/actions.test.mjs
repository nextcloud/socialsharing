/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { before, describe, test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const baseUrl = 'https://cloud.example.com'
const token = 'AbCdEf123456789'
const webroot = '/nextcloud'
const link = `${baseUrl}${webroot}/index.php/s/${token}`

const expected = {
	socialsharing_bluesky: {
		label: 'Share to Bluesky',
		url: (text) => `https://bsky.app/intent/compose?text=${text}:%0A%0A${link}`,
	},
	socialsharing_diaspora: {
		label: 'Share to Diaspora',
		url: () => `https://share.diasporafoundation.org/?url=${link}`,
	},
	socialsharing_email: {
		label: 'Share via email',
		url: (text) => `mailto:?subject=${text}&body=${link}`,
	},
	socialsharing_facebook: {
		label: 'Share to Facebook',
		url: () => `https://www.facebook.com/sharer/sharer.php?u=${link}`,
	},
	socialsharing_telegram: {
		label: 'Share to Telegram',
		url: (text) => `https://telegram.me/share/url?url=${link}&text=${text}`,
	},
	socialsharing_twitter: {
		label: 'Share to X',
		url: () => `https://twitter.com/intent/tweet?url=${link}`,
	},
	socialsharing_whatsapp: {
		label: 'Share to Whatsapp',
		url: (text) => `whatsapp://send?text=${text}:%0A%0A${link}`,
	},
}

const apps = readdirSync(root).filter((name) => existsSync(`${root}/${name}/appinfo/info.xml`)).sort()
const translate = (app, text) => `[${app}] ${text}`
const opened = []
let actions

before(async () => {
	const listeners = []
	globalThis.window = globalThis
	window.addEventListener = (type, listener) => {
		if (type === 'DOMContentLoaded') {
			listeners.push(listener)
		}
	}
	Object.defineProperty(globalThis, 'location', { value: new URL(`${baseUrl}${webroot}/index.php/apps/files/`), configurable: true })
	Object.defineProperty(globalThis, 'localStorage', { value: undefined, configurable: true })
	globalThis._oc_webroot = webroot
	globalThis.OC = { config: { modRewriteWorking: false } }
	globalThis.t = translate
	globalThis.open = (url) => opened.push(String(url))

	for (const app of apps) {
		const bundle = `${root}/${app}/js/${app}-user.mjs`
		assert.ok(existsSync(bundle), `${bundle} is missing, build the app first`)
		await import(pathToFileURL(bundle).href)
	}
	listeners.forEach((listener) => listener())
	actions = window._nc_files_sharing_sidebar_inline_actions
})

test('every app folder has expected values in this test', () => {
	assert.deepEqual(apps, Object.keys(expected).sort())
})

test('every app registers exactly one inline action under its own id', () => {
	assert.ok(actions instanceof Map, 'no sidebar inline action registry')
	assert.deepEqual([...actions.keys()].sort(), apps)
})

for (const app of Object.keys(expected)) {
	describe(app, () => {
		const action = () => actions.get(app)

		test('is offered for link shares only', () => {
			assert.equal(action().enabled({ id: 1, token }), true)
			assert.equal(action().enabled({ id: 1 }), false)
		})

		test('translates its label with its own app id', () => {
			assert.equal(action().label({ id: 1, token }), translate(app, expected[app].label))
		})

		test('has an SVG icon', () => {
			assert.match(action().iconSvg, /^<svg[\s>]/)
		})

		test('opens the service with the public link and its own translated text', () => {
			opened.length = 0
			action().exec({ id: 1, token })
			assert.deepEqual(opened, [expected[app].url(translate(app, 'I shared a file with you'))])
		})
	})
}
