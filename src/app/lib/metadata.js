const backend = require( './backend-service' );

function notDisabled( item ){

	return  item.disabled_on === null;
}

module.exports.fetch = async () => {

	try {

		const { response, body } = await backend.getMetadata();

		if( response.isSuccess ){

			module.exports.statusTypes = body.status_types;
			module.exports.lossScale = body.loss_range;
			module.exports.boolScale = body.adv_boolean;
			module.exports.countries = body.countries.filter( notDisabled );
			module.exports.govResponse = body.govt_response;
			module.exports.publishResponse = body.publish_response;
			module.exports.reportStages = body.report_stages;
			module.exports.bool = {
				'true': 'Yes',
				'false': 'No'
			};

		} else {

			throw new Error( 'Unable to fetch metadata' );
		}

	} catch( e ){

		throw e;
	}
};
