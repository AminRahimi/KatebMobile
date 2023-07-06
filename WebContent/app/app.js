var kateb = kateb || {};

kateb.externalDependencies = [ 'ui.bootstrap', 'ui.router' ,'angularjs-dropdown-multiselect','restangular',
 								'ui.select', 'ngSanitize', 'cfp.hotkeys','ui.bootstrap.persian.interval.datepicker',
								'ngFileUpload','as.sortable', 'ngclipboard'];
kateb.internalDependency = [ 'vtCommon', 'appFilter', 'treeModule', 'vtMedia',  'indeterminateCheckbox', 'vtCartable' ,'cartableSearch','dateInterval',
							'letterTabModule', 'sharedServices', 'multiselect', 'multiselectReciever',
							'scannerModule' , 'vtArrayRequired', 'isolateForm', 'tagInputModule', 'letterFormTypeDirectiveModule',
							'vtMaxlength', 'vtPDF','vtPDFSignable', 'descriptionDropdownModule', 'notificationHandlerConstModule',
							'vtTypeahead', 'katebPrint', 'vtNotification','optionSelectWebservice',
							'vtDropdownTaginputDirective', 'vtDateInterval', 'vtCartableDateInterval', 'scan', 'scannerCMModule',
							'letterTabCMModule', 'vtDropdownMultiStringModule', 'deleteButton', 'deleteModule', 'deleteFromArchive', 'viraTree', 'viraTreePagination', 'docList', 'vtFolderSelector',
							'vtArchivedLetterListModule', 'vtPatternRestrict', 'vtMoveNextInput', 'labelChooser','mMainMenu','headerMenu','loggedInUserMenu','katebPriorityLabel','katebAttachView'];
kateb.modulesDependency = [ 'katebConfigModule', 'HomeModule', 'ManagementModule', 'SettingModule', 'katebModule', 'schemaForm',
                            'secretariatModule', 'cartableModule', 'logModule', 'messageModule',
							'vtAttachment', 'reportModule','accessAllLettersModule', 'processModule', 'incomingLettertemplateModule', 'globallettertemplateModule',
							'newsModule', 'ruleModule', "objectToArray",'themeModule', 'searchModule'];

var app = angular.module('app', kateb.externalDependencies.concat(kateb.internalDependency).concat(kateb.modulesDependency));

app.factory('lowLevelHttpInterceptor', function(vtShowMessageSrvc,$q) {
	var lowLevelHttpInterceptor = {
		response : function(response) {
			switch (response.status) {
			case 401:
				window.location = "static/login.html";
				break;
			default:
				return response;
				break;
			}
			return response;
		},
		responseError:function(response,b){
			if (window.TrackJS) {
				
				TrackJS.console.log({
					message: 'network error',
					method: response.config.method,
					url: response.config.url,
					status: response.status,
					statusText: response.statusText,
					request: response.config.data,
					response: response.data
				});
				TrackJS.track(response.status + " " + response.statusText + ": " + response.config.method + " " + response.config.url);
			}


			vtShowMessageSrvc.hideLoadingDialog();
			if (response.data && response.data.messages) {
				angular.forEach(response.data.messages, function(a) {
					if (a.type) {
						vtShowMessageSrvc.showMassage(a.type.toLowerCase(), '', a.text);
					}
				});
			}
			switch (response.status) {
			case 403:
				vtShowMessageSrvc.showMassage('error','شما به اطلاعات مورد نظر دسترسی ندارید');
				// window.location = "static/error-403.html";
				break;
			case 401:
				window.location = "static/login.html";
				break;
			case 419:
				window.location = "#/change_password";
				break;
			default:
				break;
			}
			
			return $q.reject(response);
		}
	}
	return lowLevelHttpInterceptor;
});

app.config(kateb.config).run(run).filter('safeHTML', function($sce) {
	return $sce.trustAsHtml;
});




app.ckeditorConfig={
	language: 'fa',
	fontSize: {
		options: [
			'default',
			9,
			11,
			13,
			17,
			19,
			21
		]
	},
	fontFamily: {
		options: [
			'B Yagut, yagut',
			'B Titr',
			'B Nazanin',
			'B Koodak',
			'B Roya',
			'B Zar',
			'IRANYekan',
			'IRANSansX',
			'Times New Roman',
		]
	},
	plugins: [
		CKEditor5.essentials.Essentials,
		CKEditor5.autoformat.Autoformat,
		CKEditor5.blockQuote.BlockQuote,
		CKEditor5.basicStyles.Bold,
		CKEditor5.basicStyles.Underline,
		CKEditor5.basicStyles.Strikethrough,
		CKEditor5.basicStyles.Subscript,
		CKEditor5.basicStyles.Superscript,
		CKEditor5.heading.Heading,
		CKEditor5.image.Image,
		CKEditor5.image.ImageCaption,
		CKEditor5.image.ImageStyle,
		CKEditor5.image.ImageToolbar,
		CKEditor5.image.ImageUpload,
		CKEditor5.indent.Indent,
		CKEditor5.basicStyles.Italic,
		CKEditor5.link.Link,
		CKEditor5.list.List,
		CKEditor5.mediaEmbed.MediaEmbed,
		CKEditor5.paragraph.Paragraph,
		CKEditor5.table.Table,
		CKEditor5.table.TableToolbar,
		CKEditor5.basicStyles.Code,
		CKEditor5.upload.Base64UploadAdapter,
		CKEditor5.font.Font,
		CKEditor5.findAndReplace.FindAndReplace,
		CKEditor5.alignment.Alignment
	],
	toolbar:{
		items:[
			'FindAndReplace',
			'|',
			'FontFamily',
			'FontColor',
			'FontSize',
			'FontBackgroundColor',
			'|',
			'bold',
			'italic',
			'underline',
			'Strikethrough',
			'Subscript',
			'Superscript',
			'link',
			'code',
			// '-', // break point
			'|',
			'heading',
			'alignment',
			'bulletedList',
			'numberedList',
			'outdent',
			'indent',
			'|',
			'addPicButton',
			'blockQuote',
			'insertTable',
			'|',
			'undo',
			'redo',
			// {
			// 	label: 'redo undo',
			// 	icon: 'threeVerticalDots',
			// 	items: [ 'redo', 'undo' ]
			// },
		],

		shouldNotGroupWhenFull: true
	},
	image: {
		toolbar: [
			'imageStyle:inline',
			'imageStyle:block',
			'imageStyle:side',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	}

}


var BOOTSTRAP_ANGULAR = function() {
	fetchData().then(bootstrapApplication);

	function fetchData() {
		var $http = angular.injector([ 'ng' ]).get('$http');
		return $http.get('api/config').then(function(data, status, headers, config) {
			data = data.data;
			var features = data.userConfig.features;
			var obj = {};
			angular.forEach(features, function(feature) {
				obj[feature] = true;
			});
			data.userConfig.features = obj;
			app.constant('configObj', data);
			app.constant('themeConst', data.theme);
			if (Math.abs((data.currentTime - Date.parse(new Date()))/3600000) > 2) {
				window.location = "static/error-DateAndTime.html";
			}
			if (data.downTime) {
				window.location = "static/error-DownTime.html";
			}
				var chooserJsPath = document.createElement("script");
				chooserJsPath.src = data.config.ganjeh.path + "/static/chooser.js";
				// chooserJsPath.src = "http://localhost:7080/Ganjeh/static/chooser.js";
				document.head.appendChild(chooserJsPath);
		}

		, function(res){
			
			switch (res.status) {
				case 401:
					window.location = "static/login.html";
					break;
				default:
					break;
			}
		}).catch(function (err) {
			
		});
	}

	function bootstrapApplication() {
		angular.element(document).ready(function() {

			angular.bootstrap(document, [ "app" ]);
		}

		);
	}
}

BOOTSTRAP_ANGULAR();
