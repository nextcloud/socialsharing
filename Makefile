# SPDX-FileCopyrightText: 2021 Nextcloud GmbH and Nextcloud contributors
# SPDX-License-Identifier: AGPL-3.0-or-later
appstore:
	(cd socialsharing_diaspora && make appstore)
	(cd socialsharing_email && make appstore)
	(cd socialsharing_facebook && make appstore)
	(cd socialsharing_telegram && make appstore)
	(cd socialsharing_twitter && make appstore)
	(cd socialsharing_whatsapp && make appstore)
	(cd socialsharing_bluesky && make appstore)
