const metadata = require( '../metadata' );

function updateStatus( item ){

	const id = item.problem_status;

	item.problem_status = {
		id,
		name: metadata.statusTypes[ id ],
		isEmergency: item.is_emergency
	};

	return item;
}

module.exports = ( reports ) => {

	if( reports && reports.length ){

		reports = reports.map( updateStatus );
	}

	return {	reports	};
};