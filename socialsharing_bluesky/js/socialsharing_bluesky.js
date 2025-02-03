/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

window.addEventListener('DOMContentLoaded', () => {
	if (OCA.Sharing && OCA.Sharing.ExternalLinkActions) {
		OCA.Sharing.ExternalLinkActions.registerAction({
			url: link => `https://bsky.app/intent/compose?text=${t('socialsharing_bluesky', 'I shared a file with you')}:%0A%0A${link}`,
			name: t('socialsharing_bluesky', 'Share to Bluesky'),
			icon: 'icon-social-bluesky'
		});
	}
});