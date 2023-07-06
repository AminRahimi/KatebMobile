import { AddPic as AddPicDll, icons } from '../src';
import AddPic from '../src/addpic';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 AddPic DLL', () => {
	it( 'exports AddPic', () => {
		expect( AddPicDll ).to.equal( AddPic );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
