const config = require( '../../../config' );
const metadata = require( '../../../lib/metadata' );
const validators = require( '../../../lib/validators' );
const govukItemsFromObj = require( '../../../lib/govuk-items-from-object' );
const Form = require( '../../../lib/Form' );
const FormProcessor = require( '../../../lib/FormProcessor' );
const backend = require( '../../../lib/backend-service' );
const urls = require( '../../../lib/urls' );
const detailVieWModel = require( '../view-models/detail' );

module.exports = {

	barrier: ( req, res ) => {

		let addCompany = ( config.addCompany || !!req.query.addCompany );

		res.render( 'barriers/views/detail', detailVieWModel( req.barrier, addCompany ) );
	},

	edit: {

		headlines: async ( req, res, next ) => {

			const barrier = req.barrier;

			const form = new Form( req, {
				title: {
					values: [ barrier.barrier_title ],
					required: 'Enter a title for this barrier'
				},
				country: {
					type: Form.SELECT,
					values: [ barrier.export_country ],
					items: metadata.getCountryList(),
					validators: [
						{
							fn: validators.isCountry,
							message: 'Select a location for this barrier'
						}
					]
				},
				status: {
					type: Form.RADIO,
					values: [ barrier.problem_status ],
					items: govukItemsFromObj( metadata.statusTypes ),
					validators: [{
						fn: validators.isMetadata( 'statusTypes' ),
						message: 'Select a barrier urgency'
					}]
				}
			} );

			const processor = new FormProcessor( {
				form,
				render: ( templateValues ) => res.render( 'barriers/views/edit/headlines', templateValues ),
				saveFormData: ( formValues ) => backend.barriers.saveDetails( req, barrier.id, formValues ),
				saved: () => res.redirect( urls.barriers.detail( barrier.id ) )
			} );

			try {

				await processor.process();

			} catch( e ){

				next( e );
			}
		},

		product: async ( req, res, next ) => {

			const barrier = req.barrier;
			const form = new Form( req, {

				product: {
					values: [ barrier.product ],
					required: 'Enter a product or service'
				},
			} );

			const processor = new FormProcessor( {
				form,
				render: ( templateValues ) => res.render( 'barriers/views/edit/product', templateValues ),
				saveFormData: ( formValues ) => backend.barriers.saveProduct( req, barrier.id, formValues ),
				saved: () => res.redirect( urls.barriers.detail( barrier.id ) )
			} );

			try {

				await processor.process();

			} catch( e ){

				next( e );
			}
		},

		description: async ( req, res, next ) => {

			const barrier = req.barrier;
			const form = new Form( req, {

				description: {
					values: [ barrier.problem_description ],
					required: 'Enter a brief description for this barrier'
				},
			} );

			const processor = new FormProcessor( {
				form,
				render: ( templateValues ) => res.render( 'barriers/views/edit/description', templateValues ),
				saveFormData: ( formValues ) => backend.barriers.saveDescription( req, barrier.id, formValues ),
				saved: () => res.redirect( urls.barriers.detail( barrier.id ) )
			} );

			try {

				await processor.process();

			} catch( e ){

				next( e );
			}
		},
	},

	type: require( './type' ),
	interactions: require( './interactions' ),
	status: require( './status' ),
	sectors: require( './sectors' ),
	companies: require( './companies' ),
};
