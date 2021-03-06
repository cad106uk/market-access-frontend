const backend = require( '../../../../lib/backend-service' );
const validators = require( '../../../../lib/validators' );
const HttpResponseError = require( '../../../../lib/HttpResponseError' );

module.exports = async ( req, res, next, barrierId ) => {

	if( validators.isUuid( barrierId ) ){

		let barrier;

		try {

			const { response, body } = await backend.barriers.get( req, barrierId );

			if( response.isSuccess ){

				barrier = body;
				req.barrier = barrier;
				res.locals.barrier = barrier;
				next();

			} else {

				if( response.statusCode === 404 ){

					res.status( 404 );
					res.render( 'error/404' );

				} else {

					next( new HttpResponseError( 'Unable to get barrier', response, body ) );
				}
			}

		} catch( e ){

			next( e );
		}

	} else {

		next( new Error( 'Invalid barrierId' ) );
	}
};
