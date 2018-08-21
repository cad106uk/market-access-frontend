const config = require( '../config' );
const raven = require( 'raven' );
const logger = require( './logger' );

const useSentry = !!config.sentryDsn;

if( useSentry ){

	raven.config( config.sentryDsn, { release: config.version } ).install();
}

module.exports = {

	setup: function( app ){

		if( useSentry ){

			app.use( raven.requestHandler() );
		}
	},

	handleErrors: function( app ){

		if( useSentry ){

			app.use( raven.errorHandler() );
		}
	},

	message: function( level, msg, extra ){

		if( useSentry ){

			raven.captureMessage( msg, {
				level,
				extra
			} );

		} else {

			logger.warn( msg, JSON.stringify( extra ) );
		}
	},

	captureException: function( err, extra ){

		if( useSentry ){

			raven.captureException( err, { extra } );

		} else {

			logger.error( err );
		}
	}
};
