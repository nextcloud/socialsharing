/**
 * SPDX-FileCopyrightText: 2026 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Usage: node sidebar.mjs <base url> <user> <password> <file id> <link share token> <app id>...
 *
 * Opens the Files sidebar of a file with a link share in headless Chrome
 * (CHROME_BIN, default google-chrome) and checks every given app: its
 * action is registered, offered for link shares only, rendered with its
 * label and icon in the link share's actions menu, and opens a URL built
 * from the public link. No dependencies besides Node and Chrome.
 */

import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [base, user, password, fileId, token, ...apps] = process.argv.slice(2)
if (apps.length === 0) {
	console.error('Usage: node sidebar.mjs <base url> <user> <password> <file id> <link share token> <app id>...')
	process.exit(2)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const port = 9300 + Math.floor(Math.random() * 600)
const chrome = spawn(process.env.CHROME_BIN || 'google-chrome', [
	'--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'chrome-'))}`,
	'--no-first-run', '--disable-gpu', '--no-sandbox', '--window-size=1600,1000', 'about:blank',
], { stdio: 'ignore' })

const failures = []
const fail = (message) => {
	failures.push(message)
	console.log(`::error::${message}`)
}

try {
	let page
	for (let i = 0; i < 50 && !page; i++) {
		const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json()).catch(() => [])
		page = targets.find((target) => target.type === 'page') ?? await sleep(200)
	}
	if (!page) {
		throw new Error(`Chrome did not open a page on port ${port}`)
	}
	const ws = new WebSocket(page.webSocketDebuggerUrl)
	await new Promise((resolve, reject) => {
		ws.addEventListener('open', resolve)
		ws.addEventListener('error', () => reject(new Error(`could not connect to ${page.webSocketDebuggerUrl}`)))
	})

	let nextId = 0
	const pending = new Map()
	const consoleErrors = []
	ws.addEventListener('message', ({ data }) => {
		const message = JSON.parse(data)
		if (message.id && pending.has(message.id)) {
			pending.get(message.id)(message)
			pending.delete(message.id)
		} else if (message.method === 'Runtime.exceptionThrown') {
			const details = message.params.exceptionDetails
			consoleErrors.push(`${details.exception?.description ?? details.text} (${details.url ?? ''})`)
		}
	})
	const send = (method, params = {}) => new Promise((resolve) => {
		const id = ++nextId
		pending.set(id, resolve)
		ws.send(JSON.stringify({ id, method, params }))
	})
	const evaluate = async (expression) => {
		const { result } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
		if (result.exceptionDetails) {
			throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text)
		}
		return result.result.value
	}
	const waitFor = async (expression, what, timeout = 30000) => {
		for (let waited = 0; waited < timeout; waited += 250) {
			if (await evaluate(expression)) {
				return true
			}
			await sleep(250)
		}
		if (what) {
			fail(`timed out waiting for ${what}`)
		}
		return false
	}

	await send('Runtime.enable')
	await send('Network.enable')
	await send('Network.setExtraHTTPHeaders', { headers: { Authorization: `Basic ${btoa(`${user}:${password}`)}` } })
	await send('Page.navigate', { url: `${base}/index.php/apps/files/files/${fileId}?dir=/&opendetails=true` })

	const registry = 'window._nc_files_sharing_sidebar_inline_actions'
	if (await waitFor(`${registry} instanceof Map && ${registry}.size > 0`, 'any sidebar action to register')) {
		await waitFor(`${registry}.size >= ${apps.length}`, undefined, 5000)
		const actions = await evaluate(`(() => {
			const opened = []
			const open = window.open
			window.open = (url) => { opened.push(String(url)); return null }
			const share = { id: 1, token: ${JSON.stringify(token)} }
			const result = {}
			for (const [id, action] of ${registry}) {
				const before = opened.length
				action.exec(share, null)
				result[id] = {
					label: action.label(share, null),
					forLink: action.enabled(share, null),
					withoutToken: action.enabled({ id: 2 }, null),
					url: opened.slice(before).join(' '),
				}
			}
			window.open = open
			return result
		})()`)
		for (const app of apps) {
			const action = actions[app]
			if (!action) {
				fail(`${app}: no sidebar action registered`)
				continue
			}
			if (action.forLink !== true || action.withoutToken !== false) {
				fail(`${app}: offered for link shares: ${action.forLink}, without token: ${action.withoutToken}`)
			}
			if (!action.url.includes(`/index.php/s/${token}`)) {
				fail(`${app}: opened "${action.url}", which does not contain the public link`)
			}
		}

		await evaluate(`document.querySelector('[role=tab][aria-controls="tab-sharing"]')?.click()`)
		if (await waitFor(`!!document.querySelector('#tab-sharing li.sharing-entry__link button.action-item__menutoggle[aria-label]')`, 'the link share in the sharing tab')) {
			await evaluate(`document.querySelector('#tab-sharing li.sharing-entry__link button.action-item__menutoggle[aria-label]').click()`)
			const menuItems = `[...document.querySelectorAll('[role=menu] li')].map((item) => ({ text: item.textContent.replace(/\\s+/g, ' ').trim(), icon: !!item.querySelector('svg') }))`
			const labels = JSON.stringify(apps.map((app) => actions[app]?.label).filter(Boolean))
			await waitFor(`document.querySelectorAll('[role=menu] li').length > 0`, 'the link share actions menu')
			await waitFor(`${labels}.every((label) => ${menuItems}.some((item) => item.text === label))`, undefined, 10000)
			const items = await evaluate(menuItems)
			for (const app of apps) {
				const label = actions[app]?.label
				if (!label) {
					continue
				}
				const item = items.find((entry) => entry.text === label)
				if (!item) {
					fail(`${app}: "${label}" is not in the link share actions menu`)
				} else if (!item.icon) {
					fail(`${app}: "${label}" is shown without an icon`)
				} else {
					console.log(`${app}: "${label}" shown with icon, opens ${actions[app].url}`)
				}
			}
		}
	}

	for (const error of consoleErrors.filter((error) => /socialsharing/.test(error))) {
		fail(`JavaScript error: ${error}`)
	}
	ws.close()
} catch (error) {
	fail(error.stack ?? String(error))
} finally {
	chrome.kill()
}

process.exit(failures.length > 0 ? 1 : 0)
