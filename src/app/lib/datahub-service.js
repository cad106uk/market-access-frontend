const config = require( '../config' );
const datahub = config.datahub.stub ? require( './datahub-request.stub' ) : require( './datahub-request' );

module.exports = {

	getCompany: ( req, id ) => datahub.get( `/v3/company/${ id }`, req.session.ssoToken ),

	searchCompany: ( req, name, page = 1, limit = 20 ) => {

		const body = {
			name,
			offset: (page * limit) - limit,
			limit
		};

		const url = '/v3/search/company';

		return datahub.post( url, req.session.ssoToken, body );
	}
};