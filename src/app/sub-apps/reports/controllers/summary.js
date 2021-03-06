const backend = require( '../../../lib/backend-service' );
const Form = require( '../../../lib/Form' );
const FormProcessor = require( '../../../lib/FormProcessor' );
const urls = require( '../../../lib/urls' );
const config = require( '../../../config' );

function isEuExitRequired( body ){

	const messages = body && body.eu_exit_related;
	const message = messages && messages[ 0 ];

	return message && message.includes( 'required' );
}

module.exports = async ( req, res, next ) => {

	const report = req.report;
	const isResolved = report.is_resolved;
	const formConfig = {
		description: {
			values: [ report.problem_description ],
			required: 'Enter a brief description for this barrier'
		},
	};

	if( isResolved ){

		formConfig.resolvedDescription = {
			values: [ report.status_summary ],
			required: 'Enter an explanation of how you solved this barrier'
		};

	} else {

		formConfig.nextSteps = {
			values: [ report.next_steps_summary ],
		};
	}

	const form = new Form( req, formConfig );

	const processor = new FormProcessor( {
		form,
		render: ( templateValues ) => {

			templateValues.backHref =  urls.reports.aboutProblem( report.id );
			templateValues.isResolved = isResolved;
			templateValues.summaryLimit = config.reports.summaryLimit,

			res.render( 'reports/views/summary', templateValues );
		},
		saveFormData: ( formValues ) => {

			if( form.isExit ){

				return backend.reports.saveSummary( req, report.id, formValues );

			} else {

				return backend.reports.saveSummaryAndSubmit( req, report.id, formValues );
			}
		},
		saved: ( body ) => {

			const barrierId = body.id;

			if( form.isExit ){

				res.redirect( urls.reports.detail( barrierId ) );

			} else {

				req.flash( 'barrier-created', barrierId );
				res.redirect( urls.barriers.detail( barrierId ) );
			}
		}
	} );

	try {

		await processor.process();

	} catch( e ){

		if( e.code === 'UNHANDLED_400' && isEuExitRequired( e.responseBody ) ){

			res.render( 'reports/views/error/eu-exit-required' );

		} else {

			next( e );
		}

	}
};
