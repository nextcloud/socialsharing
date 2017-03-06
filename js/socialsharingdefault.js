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

})();
