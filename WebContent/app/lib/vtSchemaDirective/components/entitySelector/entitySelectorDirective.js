angular.module("schemaForm").directive('entitySelector', function($compile, entitySelectorSrvc) {
	return {
		restrict : 'EAC',
		// replace: true,
		require : 'ngModel',
		templateUrl : 'app/lib/vtSchemaDirective/components/entitySelector/entitySelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			disable : "=",
			api : "="
		},
		// h ['persianDatepicker', '?^ngModel'],
		controller : function($scope, entitySrvc, $modal) {
			// entitySelectorModalTemplate.html
			$scope.entityKey = $scope.schema.type;
			if ($scope.schema.widgetParams)
				$scope.isAddOnly = $scope.schema.widgetParams.addOnly;

			$scope.onEditSelectedClick = function() {
				entitySelectorSrvc.openEntityInfoModal($scope.model, $scope.entityKey).then(function(newModel) {
					$scope.model._displayString = newModel._displayString;
				});
			}

			$scope.openEntityInfoModal = function(entity) {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/entitySelector/partials/entityViewModalTemplate.html',
					controller : 'viewEntityModalCtrl',
					windowClass : 'modal-XLarge',
					backdrop : 'static',
					resolve : {
						entity : function() {
							return entity;
						},
						entityTypeKey : function() {
							return $scope.entityKey;
						}
					}
				});
				modalInstance.result.then(function(newModel) {
					$scope.model = angular.copy(newModel);

				}, function(a, b, c) {
					// console.log(a,b,c)
				}, function() {
					// console.log(2)
				});
			};
			$scope.openEntitySelectorModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/entitySelector/entitySelectorModalTemplate.html',
					controller : 'entitySelectorModalCtrl',
					windowClass : 'modal-XLarge',
					resolve : {
						/*
						 * items : function() { var entityKey =
						 * $scope.schema.widget.split("_")[1]; return
						 * entitySrvc.getEntityList(entityKey); },
						 */
						schema : function() {
							return $scope.schema;
						},
						model : function() {
							return $scope.model;
						}
					}

				});

				modalInstance.result.then(function(selectedItem) {
					$scope.ngModel.$setDirty();
					$scope.selectedItem = selectedItem;
					$scope.model = $scope.selectedItem;

					// $scope.model.display = $scope.model._uid

				}, function() {
				});
			};
			$scope.onRemoveSelectedClick = function() {
				$scope.ngModel.$setDirty();
				$scope.model = $scope.selectedItem = undefined;
			}

			$scope.onOpenAddNewEntityModal = function() {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/entitySelector/partials/addEntityModalTemplate.html',
					controller : 'addEntityModalCtrl',
					windowClass : 'modalLarge',
					backdrop : 'static',
					size : 'lg',
					resolve : {
						entityTypeKey : function() {
							return $scope.schema.type;
						}
					}

				});

				modalInstance.result.then(function(selectedItem) {
					$scope.ngModel.$setDirty();
					$scope.selectedItem = selectedItem;
					$scope.model = $scope.selectedItem;
				}, function() {
				});
			};

		},
		link : function(scope, element, attrs, ctrls) {
			scope.ngModel = ctrls;
			/*
			 * if (attrs.ngRequired) { scope.required = attrs.ngRequired;
			 * element.find("input").attr("ng-required", scope.required); }
			 * return $compile(element.contents())(scope);
			 */
		}
	};
});

angular.module("schemaForm").controller('entitySelectorModalCtrl', function($scope, $modalInstance, entitySrvc, schema, model) {

	$scope.itemsPagination = {
			totalItems : -1,
			currentPage : 1,
			perPage : 10,
			maxSize : 5,
			pageChanged : function() {
				getEntityPagedList(schema.type, parseInt($scope.itemsPagination.currentPage), 10);
			}
		};
		$scope.isSearchMode = false;
		var getEntityPagedList = function(entityKey, pageNum, pageSize) {
			return entitySrvc.getEntityPagedList(entityKey, pageNum, pageSize).then(function(response) {
				$scope.items = response.data;
				$scope.itemsPagination.totalItems = response.data.totalCount;
			});
		};
		getEntityPagedList(schema.type, 1, 10);

		$scope.jsonSchema = schema;
		$scope.selectedItem = model;
		$scope.ok = function() {
			$modalInstance.close($scope.selectedItem);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

		$scope.onSelectItem = function(item) {
			$scope.selectedItem = item;
		};

		$scope.onRemove = function(i){
			$scope.selectedItem = null;
		}
});

angular.module("schemaForm").controller('addEntityModalCtrl', function($scope, entitySrvc, $modalInstance, entityTypeKey, toaster) {

	$scope.newEntityModel = {};

	// TODO:this is bad!!! modal size is lg and is relative
	$scope.isCol7 = true;
	$scope.entityTypeKey = entityTypeKey;
	$scope.Data = {};
	$scope.mode = "add";

	entitySrvc.getEntityType($scope.entityTypeKey).then(function(response) {
		$scope.entityTypeLabel = response.data.name;
		$scope.jsonSchema = response.data.jsonSchema;
	})

	$scope.schemaFormAddEntityModalApi = {
		onInit : function() {
			// this.setMode("SEARCH");
		}
	}
	var setEntityTypeFieldsAndLabels = function(entityType) {
		$scope.entityType = entityType.originalElement;
		$scope.schemaFormAddEntityModalApi.generateNewEntityModel($scope.entityType.jsonSchema, $scope.newEntityModel);
		//generateNewEntityModel($scope.entityType, $scope.newEntityModel);
	};

//	var generateNewEntityModel = function(entityType, newEntityModel) {
//		for (entityField in entityType.jsonSchema.properties) {
//			var schemaOfFiled = entityType.jsonSchema.properties[entityField];
//			if (schemaOfFiled) {
//				var widget = schemaOfFiled.widget;
//				if (widget && widget === "date") {
//					// newEntityModel[entityField] = new Date();
//				} else if (isSingleTopicSelector(schemaOfFiled)) {
//					getCurrentTopicAndPushToNewModelByFiledName(newEntityModel, entityField);
//				} else if (isMultiTopicSelector(schemaOfFiled)) {
//					getCurrentTopicAndPushToNewModelByFiledName(newEntityModel, entityField, true);
//				}
//			}
//		}
//
//	};

	var isSingleTopicSelector = function(schemaOfFiled) {
		if (schemaOfFiled.widget && schemaOfFiled.type === "topic" && schemaOfFiled.widget === "popupTopicSelector" && !schemaOfFiled.multiple) {
			return true;
		}
		return false;
	};
	var isMultiTopicSelector = function(schemaOfFiled) {
		if (schemaOfFiled.widget && schemaOfFiled.type === "topic" && schemaOfFiled.widget === "popupTopicSelector" && schemaOfFiled.multiple) {
			return true;
		}
		return false;
	};
	var getCurrentTopicAndPushToNewModelByFiledName = function(newEntityModel, entityField, isMulti) {
		topicSrvc.getCurrentTopicId().then(function(response) {
			var currentTopic = response.data;
			if (isMulti) {
				newEntityModel[entityField] = [ {
					_displayString : currentTopic._displayString,
					_uid : currentTopic._uid
				} ];
			} else {
				newEntityModel[entityField] = {
					_displayString : currentTopic._displayString,
					_uid : currentTopic._uid
				};
			}

		});
	};

	entitySrvc.getEntityType(entityTypeKey).then(function(response) {
		setEntityTypeFieldsAndLabels(response.data);
		// entitySrvc.cacheEntityType($scope.entityType);
		// getEntityListAndSelectEntity(false, true);

	});

	var addEntity = function(entityTypeKey, formDataModel, callbackFn) {

		var entityModel = $scope.schemaFormAddEntityModalApi.correctModel($scope.jsonSchema, formDataModel);

		entitySrvc.addEntity(entityTypeKey, entityModel).then(function(response) {
                // $scope.selectedItem = {
			// 	_uid : response.data._uid,
			// 	_displayString : response.data._displayString
			// };
			$scope.selectedItem = response.data.originalElement;
			callbackFn();
		});
	};

	$scope.onVerifyClick = function() {
		if ($scope.entityType.duplicateCheckEnable == undefined)
			$scope.entityType.duplicateCheckEnable = true;
		if ($scope.entityType.duplicateCheckEnable) {

			$scope.getIntersec();
		} else {
			$scope.onSaveClick();
		}

	};

	$scope.onSaveClick = function() {
		addEntity($scope.entityTypeKey, $scope.newEntityModel, onAfterSave);
	};

	$scope.schemaFormEntityApi = {
		onInit : function() {
		}
	};

	$scope.getIntersec = function() {

		var entityModel = $scope.schemaFormAddEntityModalApi.correctModel($scope.jsonSchema, $scope.newEntityModel);

		entitySrvc.getIntersectionEntityList(entityModel, $scope.entityTypeKey).then(function(response) {
			$scope.intersecResult = [];
			if (response.data && (response.data.accessList.length || response.data.notAccessList.length)) {
				$scope.intersecResult = response.data;
				$scope.mode = "intersect";
			} else
				$scope.onSaveClick();
		});
	};

	$scope.onSelectEntity = function(entity) {
		$scope.doSelect = true;
		$scope.selectedEntity = entity;
		$scope.formDataModel = angular.copy(entity);
		$scope.formDataModel = $scope.schemaFormEntityApi.correctDataModelForForm($scope.jsonSchema, $scope.formDataModel);
	};

	$scope.onIntersectClick = function(entity) {
		$scope.selectedItem = {
			_uid : entity._uid,
			_displayString : entity._displayString
		};
		onAfterIntersec();
	};

	var onAfterIntersec = function() {
		$modalInstance.close($scope.selectedItem);
	};
	var onAfterSave = function() {
		toaster.pop('success', 'اطلاعات با موفقیت ثبت گردید');
		$modalInstance.close($scope.selectedItem);
	};
	$scope.onBackClick = function() {
		$scope.mode = "add";
	};
	$scope.onCancelClick = function() {
		$modalInstance.dismiss('cancel');
	};

});

angular.module("schemaForm").controller(
		'viewEntityModalCtrl',
		function($rootScope, $scope, $modalInstance, $timeout, entitySrvc, entity, entityTypeKey) {
			$scope.isCol7 = true;
			$scope.entityTypeKey = entityTypeKey;
			$scope.entityUid = entity._uid;
			entitySrvc.getEntityType(entityTypeKey).then(function(response) {
				$scope.jsonSchema = response.data.jsonSchema;
			});

			$scope.schemaFormViewModalApi = {
				onInit : function() {
				}
			}
			$scope.onEditEntity = function() {
				$scope.recoverEntity = angular.copy($scope.model);
				$scope.isEditMode = true;
			}
			var getEntity = function() {
				return entitySrvc.getEntity(entityTypeKey, entity._uid).then(function(response) {
					$scope.model = response.data;
					$scope.model = $scope.schemaFormViewModalApi.correctDataModelForForm($scope.jsonSchema, $scope.model);

					$scope.originalModel = angular.copy($scope.model);
				});
			}
			$scope.onUpdateEntity = function(model) {
				if ($scope.example.$valid) {
					var entityModel = $scope.schemaFormViewModalApi.correctModel($scope.jsonSchema, $scope.model);

					return entitySrvc.updateEntity($scope.entityTypeKey, $scope.entityUid, entityModel).then(function(response) {
						getEntity();
						$scope.example.$setPristine();
						$scope.isEditMode = false;
					});
				}
			}
			$scope.onCancel = function() {
				$scope.model = angular.copy($scope.recoverEntity);
				$scope.isEditMode = false;
			}

			$scope.onPrintClick = function() {
				$scope.isStatePrint = true;
				$timeout(function() {
					var ww = $("#printableArea");
					ww.find(".hidden").remove();
					Popup(ww.html());
				}, 10);
			}
			getEntity()
			$scope.onReturnClick = function() {
				// TODO: solve manual _displayString refresh
				// $scope.originalModel._displayString =
				// $scope.originalModel.firstName +
				// ($scope.originalModel.lastName ?
				// $scope.originalModel.lastName : "");
				$modalInstance.close($scope.originalModel);
			};
			function Popup(data) {
				// var mywindow = window.open('', 'my div',
				// 'height=400,width=600',true);
				var mywindow = window.open("", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=1100, height=700");
				mywindow.document.write(' <!DOCTYPE html><html><head><title>چاپ درخت</title>');
				// mywindow.document.write('<link
				// href="assets/css/tree.css" rel="stylesheet"
				// media="print , screen" />');
				mywindow.document.write('<meta charset="utf-8">');
				mywindow.document.write('<meta http-equiv="cache-control" content="max-age=0" />');
				mywindow.document.write('<meta http-equiv="cache-control" content="no-cache" />');
				mywindow.document.write('<meta http-equiv="expires" content="0" />');
				mywindow.document.write('<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />');
				mywindow.document.write('<meta http-equiv="pragma" content="no-cache" />');
				mywindow.document.write('<style type="text/css">fieldset{width:100%};.col-xs-12,.col-sm-12,.col-md-12,.col-lg-12 {' + '  width: 100%;float:right;' + '   }' + ' 	.col-xs-11,.col-sm-11,.col-md-11,.col-lg-11 {' + ' 		    width: 91.66666667%;float:right;' + ' 	  }' + ' .col-xs-10,.col-sm-10,.col-md-10,.col-lg-10 {' + '     width: 83.33333333%;float:right;' + '   }' + ' 	.col-xs-9,.col-sm-9,.col-md-9,.col-lg-9 {' + '     width: 75%;float:right;' + '   }' + ' .col-xs-8,.col-sm-8,.col-md-8,.col-lg-8 {' + '    width: 66.66666667%;float:right;' + '  }' + ' .col-xs-7,.col-sm-7,.col-md-7,.col-lg-7 {' + '     width: 58.33333333%;float:right;' + '   }' + ' 	.col-xs-6,.col-sm-6,.col-md-6,.col-lg-6 {' + '   width: 50%;float:right;' + '   }' + ' .col-xs-5,.col-sm-5,.col-md-5,.col-lg-5 {'
						+ '    width: 41.66666667%;float:right;' + '   }' + '.col-xs-4,.col-sm-4,.col-md-4,.col-lg-4 {' + ' 	    width: 33.33333333%;float:right;' + '  }' + ' .col-xs-3,.col-sm-3,.col-md-3,.col-lg-3 {' + '     width: 25%;float:right;' + '   }' + ' .col-xs-2,.col-sm-2,.col-md-2,.col-lg-2 {' + '     width: 16.66666667%;float:right;' + '   }' + ' .col-xs-1,.col-sm-1,.col-md-1,.col-lg-1 {' + '   width: 8.33333333%;float:right;' + '  }@charset "UTF-8";[ng\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}.ng-hide-add-active,.ng-hide-remove{display:block!important;}</style>');
				mywindow.document.write('<link href="assets/theme/css/bootstrap-yeti.css" rel="stylesheet" media="print , screen" />');
				mywindow.document.write('<link rel="shortcut icon" href="assets/ico/bolgrafo-152-82303.png" media="print , screen" />');
				mywindow.document.write('						<link rel="stylesheet" href="assets/theme/css/bootstrap-yeti.css"  media="print , screen" />');
				mywindow.document.write('<link rel="stylesheet" href="bower_components/AngularJS-Toaster/toaster.css"  media="print , screen" />');
				mywindow.document.write('<link rel="stylesheet" href="bower_components/bootstrap-rtl/dist/css/bootstrap-rtl.min.css"  media="print , screen" />');
				mywindow.document.write('<link rel="stylesheet" href="bower_components/angular-hotkeys/build/hotkeys.min.css"  media="print , screen" />');
				mywindow.document.write('<link rel="stylesheet" href="bower_components/angular-material/angular-material.css" media="print , screen" />');
				mywindow.document.write('	<link rel="stylesheet" href="bower_components/jquery-ui/themes/smoothness/jquery-ui.css" media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/base.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/offcanvas.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/loadingDialog.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/navs.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/tree.css" rel="stylesheet" media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/breadcrumb.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/table.css" rel="stylesheet" media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/table-fixedHeader.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/dynamicHeight.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('	<link href="assets/css/recentlyUsedTopic.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="assets/css/gridRow.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="assets/css/topicStatistics.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="assets/css/bootstrap-filestyle.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="assets/css/popover.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="assets/css/animations.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="assets/css/animate.css" rel="stylesheet" media="print , screen" />');
				mywindow.document.write('<link href="assets/css/datepicker.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="assets/css/schemaForm.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="assets/css/animationForEntityPage.css" rel="stylesheet"  media="print , screen" />');
				mywindow.document.write('<link href="bower_components/bootstrap-rtl/dist/css/bootstrap-rtl.css" rel="stylesheet" media="print , screen" />');
				mywindow.document.write('	<link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.min.css" media="print , screen" />');
				mywindow.document.write('	<link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css" media="print , screen" />');
				mywindow.document.write('	<link rel="stylesheet" href="assets/css/tagInput.css" media="print , screen" />');
				mywindow.document.write('<link href="assets/css/base.css" rel="stylesheet" media="print , screen" />');
				mywindow.document.write('<script src="bower_components/jquery/dist/jquery.js"></script>');
				mywindow.document.write('<script src="bower_components/jquery-ui/jquery-ui.js"></script>');
				mywindow.document.write('<script src="bower_components/angular/angular.js"></script>');
				mywindow.document.write('<script src="bower_components/angular-animate/angular-animate.js"></script>');
				mywindow.document.write('<script src="bower_components/AngularJS-Toaster/toaster.js"></script>');
				mywindow.document.write('<script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>');
				mywindow.document.write('<script src="bower_components/lodash/dist/lodash.compat.js"></script>');
				mywindow.document.write('<script src="bower_components/restangular/dist/restangular.js"></script>');
				mywindow.document.write('<script src="bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js"></script>');
				mywindow.document.write('<script src="bower_components/angular-hotkeys/build/hotkeys.min.js"></script>');
				mywindow.document.write('<script src="bower_components/angular-ui-utils/ui-utils.js"></script>');
				mywindow.document.write('<script src="bower_components/bootstrap-filestyle/src/bootstrap-filestyle.js"></script>');
				mywindow.document.write('<script src="bower_components/ng-file-upload/angular-file-upload.js"></script>');
				mywindow.document.write('<script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>');
				mywindow.document.write('<script src="bower_components/angular-ui-sortable/sortable.js"></script>');
				mywindow.document.write('<script src="bower_components/ng-tags-input/ng-tags-input.min.js"></script>');
				mywindow.document.write('<script src="static/lib/moment/moment.js"></script>');
				mywindow.document.write('<script src="static/lib/moment/moment-jalaali/moment-jalaali-min.js"></script>');
				mywindow.document.write('<script src="config/stateConfig.js"></script>');
				mywindow.document.write('<script src="common/filters/IPFilter.js"></script>');
				mywindow.document.write('<script src="common/filters/emptyValueLabelFilter.js"></script>');
				mywindow.document.write('<script src="config/menuConfig.js"></script>');
				mywindow.document.write('<script src="config/routeConfig.js"></script>');
				mywindow.document.write('<script src="config/baseRequestConfig.js"></script>');
				mywindow.document.write('<script src="config/ConfigConst.js"></script>');
				mywindow.document.write('<script src="config/config.js"></script>');
				mywindow.document.write('<script src="common/test/vtMockRestangular.js"></script>');
				mywindow.document.write('<script src="common/filters/EnToFaNumberFilter.js"></script>');
				mywindow.document.write('<script src="common/filters/stringFilter.js"></script>');
				mywindow.document.write('<script src="common/filters/sliceFilter.js"></script>');
				mywindow.document.write('<script src="app/lib/vtSchemaDirective2/angular-ui-bootstrap-datepicker/persiandate.js"></script>');
				mywindow.document.write('<script src="assets/js/angular-ui-bootstrap-datepicker/persian-datepicker-tpls.js"></script>');
				mywindow.document.write('<script src="app.js"></script>');
				mywindow.document.write('<script src="management/user/services/UserResource.js"></script>');
				mywindow.document.write('<script src="management/log/services/logResource.js"></script>');
				mywindow.document.write('<script src="management/role/services/roleResource.js"></script>');
				mywindow.document.write('<script src="management/service/softwareSrvc.js"></script>');
				mywindow.document.write('<script src="management/role/services/featureResource.js"></script>');
				mywindow.document.write('<script src="management/baseSelector/services/baseSelectSrvc.js"></script>');
				mywindow.document.write('<script src="home/services/homeSrvc.js"></script>');
				mywindow.document.write('<script src="entity/entityType/services/entitySrvc.js"></script>');
				mywindow.document.write('<script src="topic/services/topicSrvc.js"></script>');
				mywindow.document.write('<script src="navBar/navBrowserSrvc.js"></script>');
				mywindow.document.write('<script src="search/services/searchSrvc.js"></script>');
				mywindow.document.write('<script src="assets/js/topicSelector/topicSelectorDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/entitySelector/entitySelectorDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/multiEntitySelector/multiEntitySelectorDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/multiTopicSelector/multiTopicSelectorDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/optionSelector/optionSelectorDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/multiText/multiTextDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/multiTextarea/multiTextareaDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/fileSelector/fileSelectorDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/imageSelector/imageSelectorDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/imageSelector/imageModalCtrl.js"></script>');
				mywindow.document.write('<script src="assets/js/multiFileSelector/multiFileSelectorDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/bigText/bigTextDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/bigText/bigTextModalCtrl.js"></script>');
				mywindow.document.write('<script src="assets/js/integer/integerDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/attachFile/attachFileDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/autoCompleteTagInput/autoCompleteTagInputDirective.js"></script>');
				mywindow.document.write('<script src="assets/js/tree/viraTreeModule.js"></script>');
				mywindow.document.write('<script src="assets/js/tree/treeModalCtrl.js"></script>');
				mywindow.document.write('<script src="assets/js/tree/treeNodeModalCtrl.js"></script>');
				mywindow.document.write('<script src="assets/js/tree/viraTreeSrvc.js"></script>');
				mywindow.document.write('<script src="assets/js/tree/viraTreeDirective.js"></script>');
				mywindow.document.write('<script src="home/controllers/homeCtrl.js"></script>');
				mywindow.document.write('<script src="management/user/controllers/UserManagementCtrl.js"></script>');
				mywindow.document.write('<script src="management/role/controllers/roleManagementCtrl.js"></script>');
				mywindow.document.write('<script src="management/baseSelector/controllers/baseSelectorCtrl.js"></script>');
				mywindow.document.write('<script src="management/baseSelector/controllers/optionViewCtrl.js"></script>');
				mywindow.document.write('<script src="management/entityType/controllers/entityTypeManagementCtrl.js"></script>');
				mywindow.document.write('<script src="management/entityType/controllers/formViewCtrl.js"></script>');
				mywindow.document.write('<script src="management/log/controllers/logManagementCtrl.js"></script>');
				mywindow.document.write('<script src="entity/entityType/controllers/entityTypeInfoCtrl.js"></script>');
				mywindow.document.write('<script src="entity/entityType/controllers/entityTypeCtrl.js"></script>');
				mywindow.document.write('<script src="entity/entityType/controllers/advancedSearchEntityCtrl.js"></script>');
				mywindow.document.write('<script src="entity/entityType/controllers/intersectionCtrl.js"></script>');
				mywindow.document.write('<script src="management/controllers/managementCtrl.js"></script>');
				mywindow.document.write('<script src="topic/controllers/topicManagementCtrl.js"></script>');
				mywindow.document.write('<script src="search/controllers/searchCtrl.js"></script>');
				mywindow.document.write('<script src="hotKeys/controllers/hotKeysCtrl.js"></script>');
				mywindow.document.write('<script src="search/controllers/schemaPopup.js"></script>');
				mywindow.document.write('<script src="entity/controllers/entityCtrl.js"></script>');
				mywindow.document.write('<script src="navBar/navBrowserCtrl.js"></script>');
				mywindow.document.write('<script src="report/controllers/reportCtrl.js"></script>');
				mywindow.document.write('<script src="report/controllers/reportListModalCtrl.js"></script>');
				mywindow.document.write('<script src="home/HomeModule.js"></script>');
				mywindow.document.write('<script src="navBar/navBarModule.js"></script>');
				mywindow.document.write('<script src="report/ReportModule.js"></script>');
				mywindow.document.write('<script src="search/SearchModule.js"></script>');
				mywindow.document.write('<script src="hotKeys/hotKeysModule.js"></script>');
				mywindow.document.write('<script src="assets/js/ocLazyLoad.min.js"></script>');
				mywindow.document.write('<script src="assets/js/schema-form/schema-form.js"></script>');

				mywindow.document.write('</head><body >');
				mywindow.document.write('<div><span class="col-sm-5"></span><button type="button" style="width:120px" class="btn btn-primary no-print" onclick="window.print();">چاپ</button></div>' + '<fieldset style="height: 0px; display: block; z-index: 100;"></fieldset>');

				// var data=$(data).find(".hidden").remove();
				/*
				 * data = $("<div></div>").append(data);
				 * data.find(".hidden").remove()
				 */

				mywindow.document.write(data); //
				mywindow.document.write('<div><div style="color:grey;float:right;font-family:DroidNaskh-Regular.ttf;">' + $rootScope.username + '</div>' + '<div style="color:grey;text-align:right">' + ' &nbsp &nbsp &nbsp &nbsp &nbsp ' + moment(Date.now()).format(' HH:mm jYYYY/jM/jD ') + '</div></div>');
				mywindow.document.write('</body></html>');

				mywindow.document.close();
				// mywindow.print();
				/*
				 * $timeout(function() { mywindow.print(); }, 1000);
				 */

				// mywindow.close();
				$scope.isStatePrint = false;
				return true;
			}
		});