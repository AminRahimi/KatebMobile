angular.module('schemaForm').controller(
		'AdvancedEntityTypeManagementCtrl',
		function($scope, $rootScope, $state, $modal, toaster, entitySrvc, baseSelectSrvc, hotkeys, $location, $timeout) {
			$rootScope.absUrl = $location.absUrl();
			$scope.isEditMode = false;
			$scope.Data = {
				mainForm : null,
				mode : 'view',
				hasError : false,
				entityTypeList : [],
				baseSelectorList : [],
				newEntityType : {
					entityKey : '',
					name : '',
					collectionName : '',
					jsonSchema : {
						viewGroups : []
					},
					parentEntityKey : '',
					hotkey : ''
				},
				formItem : {
					title : '',
					properties : {},
					viewGroups : []
				},
				newProperty : {
					title : '',
					label : '',
					type : {},
					widget : '',
					required : false,
					multiple : undefined,
					searchable : false,
					widgetParams : {}
				},
				newGroup : {
					name : '',
					memebers : []
				},
				widgets : [],
				selectedWidget : "",
				selectedTopic : {},
				parentEntityType : {},
				parentsList : [],
			};
			$scope.Func = {
				onFormDesignClick : function() {
					$state.go("home.management.formManage", {
						entityTypeKey : $scope.Data.newEntityType.entityKey
					});
				},
				onToggleDisplayString:function(){
					/*$timeout(function() {
						displayStringEditor.resize();
						validationCodeEditor.resize();
					}, 1);*/
				},
				onToggleValidationCode:function(){
					/*$timeout(function() {
						displayStringEditor.resize();
						validationCodeEditor.resize();
					}, 1);*/
				},
				reset : function() {
					$scope.Data.newEntityType = {
						entityKey : '',
						name : '',
						collectionName : '',
						jsonSchema : {},
						parentEntityKey : '',
						hotkey : ''
					};
					$scope.Data.formItem = {
						title : '',
						properties : {},
						viewGroups : []
					};
					$scope.Data.newProperty = {
						title : '',
						label : '',
						type : {},
						widget : '',
						required : false,
						multiple : undefined,
						searchable : false,
						widgetParams : {}
					};
					$scope.Data.newGroup = {
						name : '',
						memebers : []
					};
					$scope.Data.selectedWidget = "";
					$scope.Data.selectedTopic = {};
					$scope.parent = $scope.Data.parentsList[0];
					$scope.Func.onSelectParent();
					$scope.Data.parentEntityType = {};
					$scope.widgets = [];
				},
				onAddEntityTypeClick : function() {
					$scope.Data.mode = 'add';
					/*$timeout(function() {
						displayStringEditor.resize();
						validationCodeEditor.resize();
					}, 1);*/
					$scope.Func.reset();
					
					
					$scope.Data.hasDisplayString=true;
				},
				onGotoEditModeClick:function(){
				/*	$timeout(function() {
						displayStringEditor.resize();
						validationCodeEditor.resize();
					}, 1);*/
					// $scope.parent = $scope.Data.parentsList[0];
					$scope.parent={
							entityKey:$scope.Data.newEntityType.parentEntityKey
					}
					$scope.Func.onSelectParent();
					$scope.Data.mode='edit';
				},
				onSelectType : function() {
					$scope.widgets = $scope.Data.widgets[$scope.Data.newProperty.type.en];
					if ($scope.widgets.length < 2)
						$scope.Data.selectedWidget = $scope.widgets[0];
				},
				onSelectPropForDisplayString:function(){
					/*displayStringEditor.setValue(js_beautify("function(){return "+ $scope.selectedPropForDisplayString.name +"}"));
					$scope.Data.hasDisplayString=true;*/
				},
				onSelectParent : function() {
					entitySrvc.getEntityType($scope.parent.entityKey).then(function(response) {
						$scope.Data.parentEntityType = response.data;
						
						/*var entityTypePropNames=[];
						 angular.forEach($scope.Data.parentEntityType.jsonSchema.properties,function(propVal,propName){
							 entityTypePropNames.push({name:propName,value:propName,meta:''});
						 });
						 
						 angular.forEach($scope.Data.formItem.viewGroups,function(viewGroup){
							 angular.forEach(viewGroup.members,function(member){
								 entityTypePropNames.push({name:member,value:member,meta:""});
							 });
						 });
						 
						 $scope.entityTypePropNames = angular.copy(entityTypePropNames); 
						 
						var entityTypePropertyCompleter = {
								getCompletions : function(editor, session, pos, prefix, callback) {
									if ( prefix.length === 0) {
										callback(null, []);
										return
									}
									
									callback(null,entityTypePropNames);
								}
							}
						
						langTools.setCompleters([entityTypePropertyCompleter]);
						var oldDisplayStringEditorVal=  displayStringEditor.getValue();
						var oldValidationCodeEditorVal=  validationCodeEditor.getValue();
						
						displayStringEditor.destroy()*/
						
						// ACE EDITOR BEGIN
						/* langTools = ace.require("ace/ext/language_tools");
						 displayStringEditor = ace.edit("displayStringEditor");
						 validationCodeEditor = ace.edit("validationCodeEditor");
						displayStringEditor.setTheme("ace/theme/monokai");
						// displayStringEditor.setTheme("ace/theme/twilight");
						displayStringEditor.getSession().setMode("ace/mode/javascript");
						displayStringEditor.setOptions({
							enableBasicAutocompletion : true,
							enableSnippets : true,
							enableLiveAutocompletion : false
						});

						validationCodeEditor.setTheme("ace/theme/twilight");
						validationCodeEditor.getSession().setMode("ace/mode/javascript");
						validationCodeEditor.setOptions({
							enableBasicAutocompletion : true,
							enableSnippets : true,
							enableLiveAutocompletion : false
						});
						displayStringEditor.setValue(oldDisplayStringEditorVal);
						validationCodeEditor.setValue(oldValidationCodeEditorVal);*/
						// ACE EDITOR END
					});
				},
				onAddPropertyClick : function(index) {
					$scope.Data.newProperty.title = $scope.Func.correctUrlValidation($scope.Data.newProperty.title);
					if ($scope.Func.checkUrlValidation($scope.Data.newProperty.title)) {
						if ($scope.Func.checkPropInput()) {
							if ($scope.Data.newProperty.multiple == undefined)
								$scope.Data.newProperty.multiple = false;
							$scope.Func.addProperty(index);
							$scope.Func.clearNewProp();
							$scope.hasError_validProp = false;
						}
					} else {
						$scope.hasError_validProp = true;
					}
				},
				addProperty : function(index) {
					$scope.Data.formItem.properties[$scope.Data.newProperty.title] = {
						label : $scope.Data.newProperty.label,
						required : $scope.Data.newProperty.required,
						multiple : $scope.Data.newProperty.multiple,
						searchable : $scope.Data.newProperty.searchable,
						widgetParams : $scope.Data.newProperty.widgetParams
					};
					$scope.Data.formItem.properties[$scope.Data.newProperty.title].type = $scope.Data.newProperty.type.en;
					$scope.Data.formItem.properties[$scope.Data.newProperty.title].widget = $scope.Data.selectedWidget;
					if ($scope.Data.newProperty.type.en == 'enum')
						$scope.Data.formItem.properties[$scope.Data.newProperty.title].enumType = $scope.Data.newProperty.enumType.key;
					$scope.Data.formItem.viewGroups[index].members.push($scope.Data.newProperty.title);
				},
				deleteProp : function(prop, index) {
					delete $scope.Data.formItem.properties[prop];
					$scope.Data.formItem.viewGroups[index].members.splice($scope.Data.formItem.viewGroups[index].members.indexOf(prop), 1);
				},
				editProperty : function(prop) {
					$scope.editPropFlag = true;
					$scope.Data.beingEditProp = prop;
					$scope.Data.newProperty = angular.copy($scope.Data.formItem.properties[prop]);
					$scope.Data.newProperty.title = prop;
					for (var int = 0; int < $scope.Data.types.length; int++) {
						if ($scope.Data.newProperty.type == $scope.Data.types[int].en) {
							$scope.Data.newProperty.type = $scope.Data.types[int];
							$scope.Func.onSelectType();
						}
					}
					if ($scope.Data.newProperty.type.en == 'enum')
						for (var jnt = 0; jnt < $scope.Data.baseSelectorList.length; jnt++)
							if ($scope.Data.newProperty.enumType == $scope.Data.baseSelectorList[jnt].key)
								$scope.Data.newProperty.enumType = $scope.Data.baseSelectorList[jnt];

					$scope.Data.selectedWidget = $scope.Data.formItem.properties[prop].widget;
				},
				onUpdatePropertyClick : function(index) {
					$scope.Data.newProperty.title = $scope.Func.correctUrlValidation($scope.Data.newProperty.title);
					if ($scope.Func.checkUrlValidation($scope.Data.newProperty.title)) {
						if ($scope.Func.checkPropInput()) {
							$scope.Func.deleteProp($scope.Data.beingEditProp, index);
							$scope.Func.addProperty(index);
							$scope.Func.clearNewProp();
							$scope.hasError_validProp = false;
							$scope.editPropFlag = false;
						}
					} else {
						$scope.hasError_validProp = true;
					}
				},
				clearNewProp : function() {
					$scope.Data.newProperty.title = '';
					$scope.Data.newProperty.label = '';
					$scope.Data.newProperty.type = {};
					$scope.Data.newProperty.widget = '';
					$scope.Data.newProperty.required = false;
					$scope.Data.newProperty.multiple = undefined;
					$scope.Data.newProperty.searchable = false;
					$scope.Data.newProperty.widgetParams = {};
					$scope.widgets = [];
					$scope.editPropFlag = false;
				},
				onAddGroupClick : function() {
					var modalInstance = $modal.open({
						templateUrl : 'app/lib/vtSchemaDirective/form-management/addViewGroup.html',
						controller : 'addViewGroupCtrl',
						size : 'sm',
						resolve : {
							viewGroup : function() {
								return {
									id : '',
									name : ''
								};
							}
						}
					});

					modalInstance.result.then(function(viewGroup) {
						if (!$scope.Data.formItem.viewGroups)
							$scope.Data.formItem.viewGroups = [];
						$scope.Data.formItem.viewGroups.push({
							id : viewGroup.id,
							name : viewGroup.name,
							members : []
						})
						$scope.Func.clearNewProp();
						$scope.tabActiveIndex = $scope.Data.formItem.viewGroups.length - 1;
					}, function() {
					});
				},
				onEditGroupClick : function(viewGroup) {
					var modalInstance = $modal.open({
						template : function(){
							var strVar="";
							strVar += "<div class=\"modal-header\">";
							strVar += "   <h3 class=\"modal-title\">مشخصات فرم<\/h3>";
							strVar += "<\/div>";
							strVar += "<div class=\"modal-body  haveFormRows clearfix\">";
							strVar += "	<div class=\"row rowForm haveMargin\" ng-class=\"{'has-error':hasError_id}\">";
							strVar += "		<label class=\"col-sm-5 pull-right required\">نام انگلیسی<\/label>";
							strVar += "		<input type=\"text\" class=\"form-control col-sm-5\" ng-model=\"viewGroup.id\" ui-keypress=\"{'ctrlKey && 13':'create();'}\">";
							strVar += "	<\/div>";
							strVar += "   	<div class=\"row rowForm haveMargin\" ng-class=\"{'has-error':hasError_name}\">";
							strVar += "		<label class=\"col-sm-5 pull-right required\">نام فارسی<\/label>";
							strVar += "		<input type=\"text\" class=\"form-control col-sm-5\" ng-model=\"viewGroup.name\" ui-keypress=\"{'ctrlKey && 13':'create();'}\">";
							strVar += "	<\/div>";
							strVar += "<\/div>";
							strVar += "<div class=\"modal-footer\">";
							strVar += "   <button class=\"btn btn-sm btn-sm btn-success\" ng-click=\"create()\" ng-show=\"!editFlag\">افزودن<\/button>";
							strVar += "   <button class=\"btn btn-sm btn-sm btn-success\" ng-click=\"create()\" ng-show=\"editFlag\">ذخیره<\/button>";
							strVar += "   <button class=\"btn btn-sm btn-sm btn-warning pull-left\" ng-click=\"onReturnClick()\">بازگشت<\/button>";
							strVar += "<\/div>";
							strVar += "";
							strVar += "";
							strVar += "";
							strVar += "";
							return strVar;
						}(),
						controller : 'addViewGroupCtrl',
						size : 'sm',
						resolve : {
							viewGroup : function() {
								return {
									id : viewGroup.id,
									name : viewGroup.name
								};
							}
						}
					});

					modalInstance.result.then(function(editedViewGroup) {
						viewGroup.id = editedViewGroup.id;
						viewGroup.name = editedViewGroup.name;
					}, function() {
					});
				},
				changeTab : function(index) {
					$scope.tabActiveIndex = index;
					$scope.Func.clearNewProp();
				},
				onSaveEntityTypeClick : function() {
					// if ($scope.Func.checkInputs()) {
						$scope.Data.formItem["extents"] = {};
						$scope.Data.newEntityType.collectionName = $scope.Data.parentEntityType.collectionName;
						/*if($scope.Data.hasDisplayString){
							$scope.Data.formItem.displayString = displayStringEditor.getValue();
						}
						if($scope.Data.hasValidationCode){
							$scope.Data.formItem.validationCode = validationCodeEditor.getValue();
						}*/
						
						$scope.Data.newEntityType.jsonSchema = JSON.stringify($scope.Data.formItem);
						$scope.Data.newEntityType.parentEntityKey = $scope.Data.parentEntityType.entityKey;
						$scope.Data.newEntityType.exportFileTemplate = $scope.Data.newEntityType.exportFileTemplate ? $scope.Data.newEntityType.exportFileTemplate.hash : undefined;

						$scope.Func.saveEntityType();
					// }
				},
				saveEntityType : function() {
					entitySrvc.addEntityType($scope.Data.newEntityType).then(function() {
						$scope.Func.restNewEntity();
						$scope.Func.getEntityTypeList();
						$scope.Func.getParentsList();
						$scope.Data.mode = "view";
					});
				},
				onUpdateEntityTypeClick : function() {
					var sendData = {};
					// $scope.Data.newEntityType.jsonSchema.viewGroups[0]={
					// id: 'childAdded',
					// name:$scope.Data.viewGroupTitle,
					// members:Object.keys($scope.Data.newEntityType.jsonSchema.properties)
					// }
					/*if($scope.Data.hasDisplayString){
						$scope.Data.newEntityType.jsonSchema.displayString = displayStringEditor.getValue();
					}
					if($scope.Data.hasValidationCode){
						$scope.Data.newEntityType.jsonSchema.validationCode = validationCodeEditor.getValue();
					}*/
					sendData.jsonSchema = JSON.stringify($scope.Data.newEntityType.jsonSchema);
					sendData.entityKey = $scope.Data.newEntityType.entityKey.replace(/ /g, "_");
					sendData.parentEntityKey = $scope.Data.newEntityType.parentEntityKey;
					sendData.collectionName = $scope.Data.newEntityType.collectionName;
					sendData.hotkey = $scope.Data.newEntityType.hotkey;
					sendData.exportFileTemplate = $scope.Data.newEntityType.exportFileTemplate ? $scope.Data.newEntityType.exportFileTemplate.hash :  $scope.Data.newEntityType.exportFileTemplate;
					sendData.name = $scope.Data.newEntityType.name;
					entitySrvc.updateEntityType(sendData).then(function() {
						$scope.Func.restNewEntity();
						$scope.Func.getEntityTypeList();
						$scope.Data.mode = "view";
					});
				},
				restNewEntity : function() {
					$scope.Data.newEntityType.entityKey = '';
					$scope.Data.newEntityType.name = '';
					$scope.Data.newEntityType.collectionName = '';
					$scope.Data.newEntityType.jsonSchema = {};
					$scope.Data.newEntityType.parentEntityKey = '';
				},
				getParentsList : function() {
					return entitySrvc.getEntityTypeList().then(function(response) {
						$scope.Data.parentsList.length = 0;
						for (var index = 0; index < response.data.length; index++) {
							if (response.data[index].parentEntityKey == null) {
								$scope.Data.parentsList.push(response.data[index]);
							}
						}
					});
				},
				createWidgetsList : function() {
//					$scope.Data.types = [ {
//						fa : "متن",
//						en : "string"
//					}, {
//						fa : "عدد",
//						en : "integer"
//					}, {
//						fa : "تاریخ",
//						en : "date"
//					}, {
//						fa : "فایل",
//						en : "file"
//					}, {
//						fa : "ضمیمه فایل",
//						en : "attachment"
//					}, {
//						fa : "انتخابگر پایه",
//						en : "enum"
//					}, {
//						fa : "برچسب",
//						en : "tag"
//					} ];
//					$scope.Data.widgets = {
//						file : [ "fileSelector", "imageSelector" ],
//						attachment : [ "attachFile" ],
//						date : [ "jalali", "gregorian" ],
//						string : [ "textBox", "textarea", "bigText" ],
//						integer : [ "intBox" ],
//						enum : [ "optionSelector", "radio" ],
//						tag : [ 'textBox' ]
//					};
//					$scope.Data.Translate = {
//						fileSelector : "انتخابگر فایل",
//						imageSelector : "انتخابگر تصویر",
//						bigText : "ویرایش‌گر متن طولانی",
//						textBox : "ویرایشگر عادی",
//						textarea : "ویرایشگر متن",
//						jalali : "جلالی",
//						gregorian : "گرگوریان",
//						radio : "رادیو",
//						optionSelector : "منوی کشویی"
//					};
				},
				getEntityTypeList : function() {
					$scope.Data.entityTypeList.length = 0;
					$scope.Func.createWidgetsList();
					return entitySrvc.getEntityTypeList().then(function(response) {
						for (var index = 0; index < response.data.length; index++) {
							if (!$scope.Data.widgets[response.data[index].entityKey]) {
								$scope.Data.types.push({
									fa : response.data[index].name,
									en : response.data[index].entityKey
								});
								$scope.Data.widgets[response.data[index].entityKey] = [ "popupSelector" ];
							}
							if (response.data[index].parentEntityKey != null) {
								for (var i = 0; i < response.data.length; i++) {
									if (response.data[index].parentEntityKey == response.data[i].entityKey)
										response.data[index].parentEntityName = response.data[i].name;
								}
								$scope.Data.entityTypeList.push(response.data[index]);
							}
						}
					});
				},
				editEntityType : function(entityType) {
					// var entityTypeTemp = {};
					for (var int = 0; int < $scope.Data.entityTypeList.length; int++) {
						$scope.Data.entityTypeList[int].class = '';
					}
					entityType.class = 'info';
					$scope.Data.selected = angular.copy(entityType);
					entitySrvc.getEntityTypeChild(entityType.entityKey).then(function(response) {
						$scope.Data.newEntityType = response.data;
						if (response.data.jsonSchema.properties == undefined) {
							$scope.Data.newEntityType = response.data.originalElement;
						}
						$scope.Data.formItem = $scope.Data.newEntityType.jsonSchema;
						$scope.Func.clearNewProp();
						$scope.tabActiveIndex = 0;
						$scope.Data.mode = 'preview';
					});
				},
				checkInputs : function() {
				/*
				 * $scope.hasError = false; $scope.hasError_parent = false;
				 * $scope.hasError_name = false; $scope.hasError_entityKey =
				 * false; $scope.hasError_topic = false; $scope.hasError_valid =
				 * false; if (!$scope.Data.parentEntityType.entityKey) {
				 * $scope.hasError = true; $scope.hasError_parent = true; } if
				 * ($scope.Data.newEntityType.name == "") { $scope.hasError =
				 * true; $scope.hasError_name = true; } if
				 * ($scope.Data.newEntityType.entityKey == "") { $scope.hasError =
				 * true; $scope.hasError_entityKey = true; }
				 * $scope.Data.newEntityType.entityKey =
				 * $scope.Func.correctUrlValidation($scope.Data.newEntityType.entityKey);
				 * if
				 * (!$scope.Func.checkUrlValidation($scope.Data.newEntityType.entityKey)) {
				 * $scope.hasError = true; $scope.hasError_entityKey = true;
				 * $scope.hasError_valid = true; } return !$scope.hasError;
				 */
				},

				checkPropInput : function() {
					$scope.hasError = false;
					$scope.hasError_pTitle = false;
					$scope.hasError_pName = false;
					$scope.hasError_widget = false;
					if ($scope.Data.newProperty.title == "") {
						$scope.hasError = true;
						$scope.hasError_pTitle = true;
					}
					if ($scope.Data.newProperty.label == "") {
						$scope.hasError = true;
						$scope.hasError_pName = true;
					}
					if ($scope.Data.selectedWidget == "") {
						$scope.hasError = true;
						$scope.hasError_widget = true;
					}
					return !$scope.hasError;
				},

				checkUrlValidation : function(string) {
					if (string.indexOf('!') > -1 || string.indexOf('*') > -1 || string.indexOf('\'') > -1 || string.indexOf('(') > -1 || string.indexOf(')') > -1 || string.indexOf(';') > -1 || string.indexOf(',') > -1 || string.indexOf('@') > -1 || string.indexOf('&') > -1 || string.indexOf('=') > -1 || string.indexOf('+') > -1 || string.indexOf('$') > -1 || string.indexOf('/') > -1
							|| string.indexOf('?') > -1 || string.indexOf('%') > -1 || string.indexOf('#') > -1 || string.indexOf('[') > -1 || string.indexOf(']') > -1) {
						return false;
					}
					return true;
				},
				correctUrlValidation : function(str) {
					return str.replace(/ /g, "_").replace(/!/g, "").replace(/\*/g, "").replace(/\\/g, "").replace(/\(/g, "").replace(/\)/g, "").replace(/;/g, "").replace(/,/g, "").replace(/&/g, "").replace(/=/g, "").replace(/\+/g, "").replace(/\$/g, "").replace(/\//g, "").replace(/\?/g, "").replace(/%/g, "").replace(/#/g, "").replace(/\[/g, "").replace(/\]/g, "").replace(/@/g, "");
				},

				onOpenFormViewPopupClick : function() {
					$modal.open({
						template : function(){
							var strVar="";
							strVar += "<div class=\"modal-header\">";
							strVar += "   <h3 class=\"modal-title\">پیش‌نمایش فرم<\/h3>";
							strVar += "<\/div>";
							strVar += "<div class=\"modal-body  haveFormRows clearfix\">";
							strVar += "   <div class=\"col-md-12 row\">";
							strVar += "      <form name=\"example\" class=\"form-horizontal\" role=\"form\">";
							strVar += "         <schema-form-fields ng-init=\"isEditMode=true\"  is-edit-mode=\"isEditMode\"  api=\"schemaFormViewModalApi\" ";
							strVar += "            schema=\"jsonSchema\" model=\"model\" is-col-7=\"isCol7\" simple-view=\"true\"><\/schema-form-fields>";
							strVar += "      <\/form>";
							strVar += "   <\/div>";
							strVar += "<\/div>";
							strVar += "<div class=\"modal-footer\">";
							strVar += "   <button class=\"btn btn-sm btn-sm btn-success\" ng-show=\"isEditMode\" ng-click=\"isEditMode=false;\">حالت عادی<\/button>";
							strVar += "   <button class=\"btn btn-sm btn-sm btn-success\" ng-hide=\"isEditMode\" ng-click=\"isEditMode='true';\">حالت ویرایش<\/button>";
							strVar += "   <button class=\"btn btn-sm btn-sm btn-warning pull-left\" ng-click=\"onReturnClick()\">بازگشت<\/button>";
							strVar += "<\/div>";
							strVar += "";
							strVar += "";
							strVar += "";
							strVar += "";
							return strVar;
						}(),
						controller : 'formViewCtrl',
						size : 'lg',
						resolve : {
							jsonSchema : function() {
								return $scope.Data.formItem;
							}
						}
					});
				},
				onCancelClick : function() {
					if (!$scope.Data.mainForm.$pristine) {
						var modalInstance = $modal.open({
							templateUrl : 'entity/entityType/partials/discardChangesModal.html',
							controller : 'discardChangesModalCtrl',
							size : 'md'
						});
						modalInstance.result.then(function(answer) {
							if (answer == 'yes') {
								$scope.Data.mainForm.$setPristine();

								if ($scope.Data.mode == 'edit') {
									$scope.Func.editEntityType($scope.Data.selected);
									$scope.Data.mode = 'preview';
								}
								if ($scope.Data.mode == 'add') {
									$scope.Func.reset();
									$scope.Data.mode = 'view';
								}
							} else {
							}
						}, function() {
						});
					} else {

						if ($scope.Data.mode == 'edit') {
							$scope.Func.editEntityType($scope.Data.selected);
							$scope.Data.mode = 'preview';
						}
						if ($scope.Data.mode == 'add') {
							$scope.Func.reset();
							$scope.Data.mode = 'view';
						}
					}
				},
				getBaseSelectorList : function() {
					$scope.Data.baseSelectorList.length = 0;
					baseSelectSrvc.getBaseSelectorList().then(function(response) {
						$scope.Data.baseSelectorList = response.data;
					});
				},

				setHotKeys : function() {
					hotkeys.bindTo($scope).add({
						combo : "ctrl+enter",
						description : "save",
						allowIn : [ 'INPUT', 'SELECT', 'TEXTAREA' ],
						callback : function(event, hotkey) {
							if ($scope.Data.mode == "add") {
								$scope.Func.onSaveEntityTypeClick();
							} else if ($scope.mode == "edit") {
								$scope.Func.onUpdateEntityTypeClick();
							}
							event.preventDefault();
						}
					}).add({
						combo : "alt+c",
						description : "new",
						allowIn : [ 'INPUT', 'SELECT', 'TEXTAREA' ],
						callback : function(event, hotkey) {
							if ($scope.mode != "add") {
								$scope.Func.onAddEntityTypeClick();
							}
						}
					});
				}
			};

			$scope.Func.setHotKeys();
			$scope.Func.getParentsList().then(function(){
				if($scope.Data.parentsList[0]){
					$scope.parent=$scope.Data.parentsList[0];
					$scope.Func.onSelectParent();
				}
			});
			$scope.Func.getBaseSelectorList();
			$scope.Func.getEntityTypeList().then(function(){
				if($scope.Data.entityTypeList[0]){
					
					$scope.Func.editEntityType($scope.Data.entityTypeList[0]);
				}
			});
			$scope.tabActiveIndex = 0;
			$scope.widgets = [];

			// ACE EDITOR BEGIN
			/*langTools = ace.require("ace/ext/language_tools");
			displayStringEditor = ace.edit("displayStringEditor");
			validationCodeEditor = ace.edit("validationCodeEditor");
			displayStringEditor.setTheme("ace/theme/monokai");
			// displayStringEditor.setTheme("ace/theme/twilight");
			displayStringEditor.getSession().setMode("ace/mode/javascript");
			displayStringEditor.setOptions({
				enableBasicAutocompletion : true,
				enableSnippets : true,
				enableLiveAutocompletion : false
			});

			validationCodeEditor.setTheme("ace/theme/twilight");
			validationCodeEditor.getSession().setMode("ace/mode/javascript");
			validationCodeEditor.setOptions({
				enableBasicAutocompletion : true,
				enableSnippets : true,
				enableLiveAutocompletion : false
			});

			validationCodeEditor.setValue(js_beautify(validationCodeEditor.getValue()));
			displayStringEditor.setValue(js_beautify(displayStringEditor.getValue()));*/

			// ACE EDITOR END
		});