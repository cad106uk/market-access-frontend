const govukItemsFromObj = require( './govuk-items-from-object' );

describe( 'govukItemsFromObject', () => {
	describe( 'When the object has properties', () => {
		it( 'Should convert an object into an array', () => {

			const input = {
				'1': 'test1',
				'2': 'test2',
				'3': 'test3'
			};

			const output = govukItemsFromObj( input );

			expect( output ).toEqual( [
				{
					value: '1',
					text: 'test1'
				},{
					value: '2',
					text: 'test2'
				},{
					value: '3',
					text: 'test3'
				},
			] );
		} );
	} );

	describe( 'When the object is empty', () => {
		it( 'Returns an empty array', () => {
			expect( govukItemsFromObj( {} ) ).toEqual( [] );
		} );
	} );
} );
