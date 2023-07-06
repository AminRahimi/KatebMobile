angular.module('vtFormManagement').controller(
		'BaseSelectorCtrl',
		function($scope, $rootScope, $state, $modal, toaster, baseSelectSrvc, $location) {
			$rootScope.absUrl = $location.absUrl();
			// $scope.items = [1,2,3,4,5];
			$scope.isEditMode = false;
			$scope.Data = {
				mainForm : {},
				mode : 'view',
				baseSelectorList : [],
				newBaseSelector : {
					key : '',
					label : '',
					members : []
				},
				newOption : {
					key : '',
					label : ''
				},
				validationClicked: false,
				mainValidationClicked: false,
				choiseForm: {}
			};
			$scope.Func = {
				onAddBaseSelectorClick : function() {
					$scope.Data.mode = 'add';
					$scope.Func.resetBaseSelector();
				},
				onSaveBaseSelectorClick : function() {
					if ($scope.Data.baseSelectorForm.$valid && $scope.Data.newBaseSelector.members.length>0) {
						if ($scope.Func.checkUrlValidation($scope.Data.newBaseSelector.key)) {
							$scope.Func.saveBaseSelector();
							$scope.Data.mode = 'view';
						} else {
							$scope.hasError_Key = true;
							$scope.hasError_valid = true;
						}
						$scope.Func.reset();
					}
					else{
						$scope.Data.mainValidationClicked = true;
					}
				},
				reset: function(){
					$scope.Data.mainValidationClicked = false;
					$scope.Data.validationClicked = false;
				},
				saveBaseSelector : function() {
					var sendData = angular.copy($scope.Data.newBaseSelector);
					$scope.Data.baseSelectorList.push(sendData);
					baseSelectSrvc.addBaseSelector(sendData).then(function() {
						$scope.Func.getBaseSelectorList();
					});
					$scope.Func.resetBaseSelector();
				},
				onUpdateBaseSelectorClick : function() {
					if ($scope.Data.baseSelectorForm.$valid && $scope.Data.newBaseSelector.members.length>0) {
						var sendData = angular.copy($scope.Data.newBaseSelector);
						baseSelectSrvc.updateBaseSelector(sendData).then(function() {
							$scope.Func.getBaseSelectorList();
							$scope.Func.resetBaseSelector();
							$scope.Func.resetOption();
							$scope.Data.mode = "view";
						});
						$scope.Func.reset();
					}
					else{
						$scope.Data.mainValidationClicked = true;
					}
				},
				getBaseSelectorList : function() {
					$scope.Data.baseSelectorList.length = 0;
					baseSelectSrvc.getBaseSelectorList().then(function(response) {
						$scope.Data.baseSelectorList = response.data;
					});
				},
				editBaseSelector : function(baseSelector) {
					for (var int = 0; int < $scope.Data.baseSelectorList.length; int++) {
						$scope.Data.baseSelectorList[int].class = '';
					}
					baseSelector.class = 'info';
					$scope.Data.mode = "view";
					$scope.Data.selected = angular.copy(baseSelector);
					$scope.Data.newBaseSelector.key = baseSelector.key;
					$scope.Data.newBaseSelector.label = baseSelector.label;
					$scope.Data.newBaseSelector.members = baseSelector.members;
					$scope.Func.checkBaseSelectorInput();
				},
				onAddOptionClick : function() {
					if ($scope.Data.choiseForm.$valid) {
						if (!$scope.Data.newBaseSelector.members)
							$scope.Data.newBaseSelector.members = [];
						var isFind = false;
						for (var int = 0; int < $scope.Data.newBaseSelector.members.length; int++) {
							if ($scope.Data.newBaseSelector.members[int].key == $scope.Data.newOption.key || $scope.Data.newBaseSelector.members[int].label == $scope.Data.newOption.label) {
								isFind = true;
								toaster.pop("error", "", "مقادیر موردنظر تکراری میباشد.");
							}
						}
						if (!isFind) {
							$scope.Data.newBaseSelector.members.push(angular.copy($scope.Data.newOption));
							$scope.Data.baseSelectorForm.$setPristine();
							$scope.Data.choiseForm.$setPristine();
							$scope.Func.resetOption();
						}
					}
					else{
						$scope.Data.validationClicked = true;
					}
				},
				deleteOption : function(opt) {
					$scope.Data.newBaseSelector.members.splice($scope.Data.newBaseSelector.members.indexOf(opt), 1);
				},
				resetBaseSelector : function() {
					if ($scope.Data.newBaseSelector.uid)
						delete $scope.Data.newBaseSelector.uid;
					$scope.Data.newBaseSelector.key = '';
					$scope.Data.newBaseSelector.label = '';
					$scope.Data.newBaseSelector.members = [];
				},
				resetOption : function() {
					$scope.Data.newOption.key = '';
					$scope.Data.newOption.label = '';
					$scope.Data.validationClicked = false;
				},
				checkBaseSelectorInput : function() {
					$scope.hasError = false;
					$scope.hasError_Key = false;
					$scope.hasError_title = false;
					if ($scope.Data.newBaseSelector.key == "") {
						$scope.hasError = true;
						$scope.hasError_Key = true;
					}
					if ($scope.Data.newBaseSelector.label == "") {
						$scope.hasError = true;
						$scope.hasError_title = true;
					}
					return !$scope.hasError;
				},
				checkOptInput : function() {
					$scope.hasError = false;
					$scope.hasError_optKey = false;
					$scope.hasError_optString = false;
					if ($scope.Data.newOption.key == "") {
						$scope.hasError = true;
						$scope.hasError_optKey = true;
					}
					if ($scope.Data.newOption.label == "") {
						$scope.hasError = true;
						$scope.hasError_optString = true;
					}
					return !$scope.hasError;
				},

				checkUrlValidation : function(string) {
					if (string.indexOf('!') > -1 || string.indexOf('*') > -1 || string.indexOf('\'') > -1 || string.indexOf('(') > -1 || string.indexOf(')') > -1 || string.indexOf(';') > -1
							|| string.indexOf(',') > -1 || string.indexOf('@') > -1 || string.indexOf('&') > -1 || string.indexOf('=') > -1 || string.indexOf('+') > -1 || string.indexOf('$') > -1
							|| string.indexOf('/') > -1 || string.indexOf('?') > -1 || string.indexOf('%') > -1 || string.indexOf('#') > -1 || string.indexOf('[') > -1 || string.indexOf(']') > -1
							|| string.indexOf(' ') > -1) {
						return false;
					}
					return true;
				},
				onCancelClick : function() {
					if (!$scope.Data.baseSelectorForm.$pristine || !$scope.Data.choiseForm.$pristine) {
//						var modalInstance = $modal.open({
//							templateUrl : 'entity/entityType/partials/discardChangesModal.html',
//							controller : 'discardChangesModalCtrl',
//							size : 'md'
//						});
//						modalInstance.result.then(function(answer) {
//							if (answer == 'yes') {
								$scope.Data.baseSelectorForm.$setPristine();
								$scope.Data.choiseForm.$setPristine();
								$scope.Func.reset();
								if ($scope.Data.mode == 'edit') {
									$scope.Func.getBaseSelectorList();
									$scope.Func.editBaseSelector($scope.Data.selected);
									$scope.Data.mode = 'view';
								}
								if ($scope.Data.mode == "add") {
									$scope.Func.resetBaseSelector();
									$scope.Func.resetOption();
									$scope.Data.newBaseSelector = {};
									$scope.Data.mode = 'view';
								}
//							} else {
//							}
//						}, function() {
//						});
					} else {
						$scope.Func.reset();
						if ($scope.Data.mode == 'edit') {
							$scope.Func.getBaseSelectorList();
							$scope.Func.editBaseSelector($scope.Data.selected);
							$scope.Data.mode = 'view';
						}
						if ($scope.Data.mode == "add") {
							$scope.Func.resetBaseSelector();
							$scope.Func.resetOption();
							$scope.Data.newBaseSelector = {};
							$scope.Data.mode = 'view';
						}
					}

				},
				onOpenOptionsViewPopupClick : function() {
					$modal.open({
						templateUrl : 'app/lib/vtSchemaDirective/form-management/optionViewModalTemplate.html',
						controller : 'optionViewCtrl',
						size : 'sm',
						resolve : {
							baseSelector : function() {
								return $scope.Data.newBaseSelector;
							}
						}
					});
				}
//				setHotKeys : function() {
//					hotkeys.bindTo($scope).add({
//						combo : "ctrl+enter",
//						description : "save",
//						allowIn : [ 'INPUT', 'SELECT', 'TEXTAREA' ],
//						callback : function(event, hotkey) {
//							if ($scope.Data.mode == "add") {
//								$scope.Func.onSaveBaseSelectorClick();
//							} else if ($scope.mode == "edit") {
//								$scope.Func.onUpdateBaseSelectorClick();
//							}
//							event.preventDefault();
//						}
//					}).add({
//						combo : "alt+c",
//						description : "new",
//						allowIn : [ 'INPUT', 'SELECT', 'TEXTAREA' ],
//						callback : function(event, hotkey) {
//							if ($scope.mode != "add") {
//								$scope.Func.onAddBaseSelectorClick();
//							}
//						}
//					});
//				}
			};

//			$scope.Func.setHotKeys();
			$scope.Func.getBaseSelectorList();
		});
