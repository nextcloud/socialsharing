/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { registerSidebarInlineAction } from '@nextcloud/sharing/ui'
import { generateUrl, getBaseUrl } from '@nextcloud/router'

window.addEventListener('DOMContentLoaded', () => {
	registerSidebarInlineAction({
		id: 'socialsharing_telegram',
		order: 10,
		enabled(share) {
			return 'token' in share
		},
		exec(share, node) {
			const link = generateUrl('/s/{token}', { token: share.token }, { baseURL: getBaseUrl() })
			window.open(`https://telegram.me/share/url?url=${link}&text=${t('socialsharing_telegram', 'I shared a file with you')}`)
		},
		label(share, node) {
			return t('socialsharing_telegram', 'Share to Telegram')
		},
		iconSvg: '<svg viewBox="0 0 32 32" height="32" width="32" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2"><path d="M16 2c7.727 0 14 6.273 14 14s-6.273 14-14 14S2 23.727 2 16 8.273 2 16 2ZM8.337 15.852c-.663.264-1.01.522-1.041.774-.061.484.636.634 1.513.92.714.232 1.676.504 2.176.514.453.01.96-.177 1.518-.56 3.813-2.575 5.782-3.876 5.905-3.904.088-.02.208-.044.29.028.082.073.074.211.065.248-.069.296-3.651 3.554-3.857 3.768-.788.818-1.684 1.319-.302 2.23 1.196.788 1.892 1.29 3.125 2.098.787.516 1.404 1.129 2.217 1.054.374-.035.76-.386.957-1.436.464-2.479 1.376-7.851 1.586-10.065a2.47 2.47 0 0 0-.023-.551.59.59 0 0 0-.2-.38c-.167-.135-.426-.164-.542-.162-.526.01-1.334.29-5.222 1.907-1.362.567-4.084 1.74-8.165 3.517Z"/></svg>',
	})
})
