<?php
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
namespace OCA\SocialSharingDiaspora\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * @implements IEventListener<\OCA\Files\Event\LoadSidebar|\OCA\Files\Event\LoadAdditionalScriptsEvent>
 */
class Application extends App implements IBootstrap, IEventListener {

	public const APP_ID = 'socialsharing_diaspora';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}

	public function register(IRegistrationContext $context): void {
		$context->registerEventListener(\OCA\Files\Event\LoadSidebar::class, self::class);
		$context->registerEventListener(\OCA\Files\Event\LoadAdditionalScriptsEvent::class, self::class);
	}

	public function boot(IBootContext $context): void {
	}

	public function handle(Event $event): void {
		Util::addScript(self::APP_ID, self::APP_ID, 'files');
		Util::addStyle(self::APP_ID, self::APP_ID);
	}
}
