<?php

/**
 * SPDX-FileCopyrightText: 2017 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
namespace OCA\SocialSharingFacebook\AppInfo;

use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;
use OCP\EventDispatcher\Event;
use OCP\EventDispatcher\IEventListener;
use OCP\Util;

/**
 * @implements IEventListener<\OCA\Files\Event\LoadAdditionalScriptsEvent|\OCA\Files\Event\LoadSidebar>
 */
class Application extends App implements IBootstrap, IEventListener {

	public const APP_ID = 'socialsharing_facebook';

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
		Util::addScript(self::APP_ID, self::APP_ID . '-user', 'files');
	}
}
