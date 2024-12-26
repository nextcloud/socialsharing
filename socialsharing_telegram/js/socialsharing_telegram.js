/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

window.addEventListener('DOMContentLoaded', () => {
	if (OCA.Sharing && OCA.Sharing.ExternalLinkActions) {
		OCA.Sharing.ExternalLinkActions.registerAction({
			url: link => `https://telegram.me/share/url?url=${link}&text=${t('socialsharing_telegram', 'I shared a file with you')}`,
			name: t('socialsharing_telegram', 'Share to Telegram'),
			icon: 'icon-social-telegram'
		});
	}
});
