/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

window.addEventListener('DOMContentLoaded', () => {
	if (OCA.Sharing && OCA.Sharing.ExternalLinkActions) {
		OCA.Sharing.ExternalLinkActions.registerAction({
			url: link => `mailto:?subject=${t('socialsharing_email', 'I shared a file with you')}&body=${link}`,
			name: t('socialsharing_email', 'Share via email'),
			icon: 'icon-social-mail'
		});
	}
});
