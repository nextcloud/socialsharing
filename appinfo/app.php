<?php

namespace OCA\SocialSharingDefault\AppInfo;

use OCP\Util;

$app = new Application();
$c = $app->getContainer();
$appName = $c->query('AppName');

$loadScripts = function() use ($appName) {
	Util::addScript($appName, 'socialsharingdefault');
	Util::addStyle($appName, 'socialsharingdefault');
};

\OC::$server->getEventDispatcher()->addListener('OCA\Files::loadAdditionalScripts', $loadScripts);
