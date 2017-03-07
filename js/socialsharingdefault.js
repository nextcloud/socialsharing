/**
 * @copyright 2017, Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @author Roeland Jago Douma <roeland@famdouma.nl>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

(function() {
	var twitter = new OC.Share.Social.Model({
		key: 'twitter',
		url: 'https://twitter.com/intent/tweet?url={{reference}}',
		name: 'Twitter',
		iconClass: 'icon-social-twitter'
	});
	OC.Share.Social.Collection.add(twitter);
	var facebook = new OC.Share.Social.Model({
		key: 'facebook',
		url: 'https://www.facebook.com/sharer/sharer.php?u={{reference}}',
		name: 'Facebook',
		iconClass: 'icon-social-facebook'
	});
	OC.Share.Social.Collection.add(facebook);
	var diaspora = new OC.Share.Social.Model({
		key: 'diaspora',
		url: 'https://share.diasporafoundation.org/?url={{reference}}',
		name: 'Diaspora',
		iconClass: 'icon-social-diaspora'
	});
	OC.Share.Social.Collection.add(diaspora);
	var googleplus = new OC.Share.Social.Model({
		key: 'googleplus',
		url: 'https://plus.google.com/share?url={{reference}}',
		name: 'Google+',
		iconClass: 'icon-social-googleplus'
	});
	OC.Share.Social.Collection.add(googleplus);
})();
