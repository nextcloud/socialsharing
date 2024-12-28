/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

window.addEventListener('DOMContentLoaded', () => {
	if (OCA.Sharing && OCA.Sharing.ExternalLinkActions) {
		OCA.Sharing.ExternalLinkActions.registerAction({
			url: link => `https://www.facebook.com/sharer/sharer.php?u=${link}`,
			name: t('socialsharing_facebook', 'Share to Facebook'),
			icon: 'icon-social-facebook'
		});
	}
});
