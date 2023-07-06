import { Plugin } from 'ckeditor5/src/core';
import { ButtonView } from 'ckeditor5/src/ui';

// import ckeditor5Icon from '../theme/icons/ckeditor.svg';
import addImageIcon from '@ckeditor/ckeditor5-core/theme/icons/image.svg';

export default class AddPic extends Plugin {
	static get pluginName() {
		return 'AddPic';
	}

	init() {
		const editor = this.editor;
		const t = editor.t;
		const model = editor.model;

		// Add the "addPicButton" to feature components.
		editor.ui.componentFactory.add('addPicButton', (locale) => {
			const view = new ButtonView(locale);
			const addPicDefinitions = this.editor.config.get('addPic') || [];

			view.set({
				label: addPicDefinitions.label || 'افزودن تصویر',
				icon: addPicDefinitions.icon || addImageIcon,
				tooltip: true,
			});

			// Insert a text into the editor after clicking the button.
			this.listenTo(view, 'execute', () => {
				// console.log(editor);
				addPicDefinitions.onClick(editor);
				// model.change((writer) => {
				// 	const textNode = writer.createText(
				// 		'Hello CfffffffffffffKEditor 5!'
				// 	);

				// 	model.insertContent(textNode);
				// });

				// editor.editing.view.focus();
			});

			return view;
		});
	}
}
