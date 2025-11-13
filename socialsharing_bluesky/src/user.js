/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { registerSidebarInlineAction } from '@nextcloud/sharing/ui'
import { generateUrl, getBaseUrl } from '@nextcloud/router'

window.addEventListener('DOMContentLoaded', () => {
	registerSidebarInlineAction({
		id: 'socialsharing_bluesky',
		order: 10,
		enabled(share) {
			return 'token' in share
		},
		exec(share, node) {
			const link = generateUrl('/s/{token}', { token: share.token }, { baseURL: getBaseUrl() })
			window.open(`https://bsky.app/intent/compose?text=${t('socialsharing_bluesky', 'I shared a file with you')}:%0A%0A${link}`)
		},
		label(share, node) {
			return t('socialsharing_bluesky', 'Share to Bluesky')
		},
		iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
<path d="M5.769,3.618C8.291,5.512,11.004,9.352,12,11.412c0.996-2.06,3.709-5.9,6.231-7.793C20.051,2.252,23,1.195,23,4.559\tc0,0.672-0.385,5.644-0.611,6.451c-0.785,2.806-3.647,3.522-6.192,3.089c4.449,0.757,5.581,3.265,3.137,5.774\tc-4.643,4.764-6.672-1.195-7.193-2.722c-0.095-0.28-0.14-0.411-0.14-0.3c-0.001-0.112-0.045,0.019-0.14,0.3\tc-0.521,1.527-2.55,7.486-7.193,2.722c-2.445-2.509-1.313-5.017,3.137-5.774c-2.546,0.433-5.407-0.282-6.192-3.089\tC1.385,10.203,1,5.231,1,4.559C1,1.195,3.949,2.252,5.769,3.618L5.769,3.618z"></path>
</svg>`,
	})
})
