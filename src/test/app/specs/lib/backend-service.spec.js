const proxyquire = require( 'proxyquire' );
const uuid = require( 'uuid/v4' );
const modulePath = '../../../../app/lib/backend-service';

describe( 'Backend Service', () => {

	let token;
	let backend;
	let service;
	let req;

	beforeEach( () => {

		token = uuid();
		req = { session: { ssoToken: token} };
		backend = {
			get: jasmine.createSpy( 'backend.get' ),
			post: jasmine.createSpy( 'backend.post' )
		};

		service = proxyquire( modulePath, {
			'./backend-request': backend
		} );
	} );

	describe( 'getUser', () => {

		it( 'Should call the correct path', () => {

			service.getUser( req );

			expect( backend.get ).toHaveBeenCalledWith( '/whoami/', token );
		} );
	} );

	describe( 'getMetadata', () => {

		it( 'Should call the correct path', () => {

			service.getMetadata();

			expect( backend.get ).toHaveBeenCalledWith( '/metadata/' );
		} );
	} );

	describe( 'saveNewReport', () => {

		it( 'Should POST to the correct path', () => {

			const status = 1;
			const emergency = 2;
			const company = { id: 3, name: 'test company' };

			service.saveNewReport( req, { status, emergency }, company );

			expect( backend.post ).toHaveBeenCalledWith( '/barriers/', token, {
				problem_status: status,
				is_emergency: emergency,
				company_id: company.id,
				company_name: company.name
			} );
		} );
	} );

	describe( 'getBarriers', () => {

		it( 'Should call the correct path', () => {

			service.getBarriers( req );

			expect( backend.get ).toHaveBeenCalledWith( '/barriers/', token );
		} );
	} );
} );
