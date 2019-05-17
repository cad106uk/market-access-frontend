const urls = require( '../lib/urls' );

module.exports = ( req, res, next ) => {

	const userProfile = req.session.user.userProfile || {};
	const currentUrl = req.originalUrl;

	let tabs = [];

	tabs = [
		{
			text: userProfile.watchList ? userProfile.watchList.name : 'My watch list',
			href: urls.index(),
			isCurrent: currentUrl === urls.index(),
		}, 
		{
			text: 'My draft barriers',
			href: urls.reports.index(), 
			isCurrent: currentUrl === urls.reports.index()
		}
	];

	res.locals.tabList = tabs;

	next();
};
