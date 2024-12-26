/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

window.addEventListener('DOMContentLoaded', () => {
	if (OCA.Sharing && OCA.Sharing.ExternalLinkActions) {
		OCA.Sharing.ExternalLinkActions.registerAction({
			url: link =>`https://share.diasporafoundation.org/?url=${link}`,
			name: t('socialsharing_diaspora', 'Share to Diaspora'),
			icon: 'icon-social-diaspora'
		});
	}
});
