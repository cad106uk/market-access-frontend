const config = require( '../config' );
const urls = require( '../lib/urls' );

const indexUrl = urls.index();
const reportsIndexUrl = urls.reports.index();

module.exports = ( req, res, next ) => {

	const watchLists = req.watchList.lists;
	const urlParts = req.originalUrl.split( '?' );
	const pathname = urlParts.shift();
	const tabs = [];

	if( watchLists.length ){

		const param = urlParts.length && urlParts[ 0 ].split( '&' ).find( ( param ) => param.startsWith( 'list=' ) );
		const listIndex = ( param ? parseInt( param.substring( param.indexOf( '=' ) + 1 ) , 10 ) : 0 );

		watchLists.forEach( ( list, index ) => {
			tabs.push({
				text: list.name,
				href: urls.index( index ),
				isCurrent: ( pathname === indexUrl && listIndex === index ),
			});
		} );

	} else {

		tabs.push({
			text: 'My watch list',
			href: indexUrl,
			isCurrent: ( pathname === indexUrl ),
		});
	}

	tabs.push({
		text: 'My draft barriers',
		href: reportsIndexUrl,
		isCurrent: ( pathname === reportsIndexUrl ),
	});

	res.locals.dashboardData = {
		tabs,
		canAddWatchList: ( watchLists.length < config.watchList.maxLists ),
	};

	next();
};
