const metadata = require( '../lib/metadata' );

const { OPEN, RESOLVED, HIBERNATED } = metadata.barrier.status.types;
const barrierStatusTypeInfo = metadata.barrier.status.typeInfo;

function isSelected( value ){

	return ( item ) => {

		if( item.value === value ){

			item.selected = true;
		}

		return item;
	};
}

module.exports = function( params ){

	const { count, barriers, filters } = params;
	const barrierList = [];

	for( let barrier of barriers ){

		const sectors = ( barrier.sectors && barrier.sectors.map( metadata.getSector ) || [] );
		const barrierStatusCode = barrier.current_status.status;
		const status = barrierStatusTypeInfo[ barrierStatusCode ] || {};

		barrierList.push( {
			id: barrier.id,
			title: barrier.barrier_title,
			isOpen: ( barrierStatusCode === OPEN ),
			isResolved: ( barrierStatusCode === RESOLVED ),
			isHibernated: ( barrierStatusCode === HIBERNATED ),
			country: metadata.getCountry( barrier.export_country ),
			sectors,
			sectorsList: sectors.map( ( sector ) => sector.name ),
			status,
			date: {
				reported: barrier.reported_on,
				status: barrier.current_status.status_date
			}
		} );
	}

	return {
		count,
		barriers: barrierList,
		filters: {
			country: metadata.getCountryList( 'All locations' ).map( isSelected( filters.country ) )
		}
	};
};
