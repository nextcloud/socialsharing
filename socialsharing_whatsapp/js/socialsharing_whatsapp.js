/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

window.addEventListener('DOMContentLoaded', () => {
	if (OCA.Sharing && OCA.Sharing.ExternalLinkActions) {
		OCA.Sharing.ExternalLinkActions.registerAction({
			url: link => `whatsapp://send?text=${t('socialsharing_email', 'I shared a file with you')}:%0A%0A${link}`,
			name: t('socialsharing_whatsapp', 'Share to Whatsapp'),
			icon: 'icon-social-whatsapp'
		});
	}
});
