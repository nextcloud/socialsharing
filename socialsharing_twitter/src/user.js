/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { registerSidebarInlineAction } from '@nextcloud/sharing/ui'
import { generateUrl, getBaseUrl } from '@nextcloud/router'

window.addEventListener('DOMContentLoaded', () => {
	registerSidebarInlineAction({
		id: 'socialsharing_twitter',
		order: 10,
		enabled(share) {
			return 'token' in share
		},
		exec(share, node) {
			const link = generateUrl('/s/{token}', { token: share.token }, { baseURL: getBaseUrl() })
			window.open(`https://twitter.com/intent/tweet?url=${link}`)
		},
		label(share, node) {
			return t('socialsharing_twitter', 'Share to X')
		},
		iconSvg: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg">\n'
			+ '  <path d="M24.7021 2.5h4.5985L19.2039 13.9962 31 29.591h-9.257l-7.2475-9.4769-8.2972 9.4769H1.5998l10.6964-12.296L1 2.5h9.4868l6.5479 8.6571zm-1.6095 24.3919h2.5492L9.1473 5.099H6.4082z" style="stroke-width:.999997"/>\n'
			+ '</svg>',
	})
})
