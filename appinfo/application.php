<?php

namespace OCA\SocialSharingDefault\AppInfo;

use OCP\AppFramework\App;

class Application extends App {

	/**
	 * Constructor
	 *
	 * @param array $urlParams
	 */
	public function __construct(array $urlParams = []) {
		parent::__construct('socialsharingdefault', $urlParams);
	}
}
