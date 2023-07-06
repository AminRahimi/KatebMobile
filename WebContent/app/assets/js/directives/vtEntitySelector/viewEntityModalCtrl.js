angular.module("vtEntitySelector").controller(
		'vtEntitySelector.viewEntityModalCtrl',
		function($rootScope, $scope, $modalInstance, $timeout, vtEntitySelectorSrvc, entity, entityTypeKey) {
			$scope.isCol7 = true;
			$scope.entityTypeKey = entityTypeKey;
			$scope.entityUid = entity._uid;
			vtEntitySelectorSrvc.getEntityType(entityTypeKey).then(function(response) {
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
				return vtEntitySelectorSrvc.getEntity(entityTypeKey, entity._uid).then(function(response) {
					$scope.model = response.data;
					$scope.originalModel = angular.copy($scope.model);
				});
			}
			$scope.onUpdateEntity = function(model) {
				if ($scope.example.$valid) {
					var entityModel = $scope.schemaFormViewModalApi.correctModel($scope.jsonSchema, $scope.model);

					return vtEntitySelectorSrvc.updateEntity($scope.entityTypeKey, $scope.entityUid, entityModel).then(function(response) {
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
					ww.find(".ng-hide").remove();
					Popup(ww.html());
				}, 10);
			}
			getEntity()
			$scope.onReturnClick = function() {
				// TODO: solve manual displayString refresh
				// $scope.originalModel.displayString =
				// $scope.originalModel.firstName +
				// ($scope.originalModel.lastName ?
				// $scope.originalModel.lastName : "");
				$modalInstance.close($scope.originalModel);
			};
			function Popup(data) {
				// var mywindow = window.open('', 'my div',
				// 'height=400,width=600',true);
				var mywindow = window.open("", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=1100, height=700");
				mywindow.document.write(' <!DOCTYPE html><html><head><title>چاپ</title>');
				// mywindow.document.write('<link
				// href="assets/css/tree.css" rel="stylesheet"
				// media="print , screen" />');
				mywindow.document.write('<meta charset="utf-8">');
				mywindow.document.write('<meta http-equiv="cache-control" content="max-age=0" />');
				mywindow.document.write('<meta http-equiv="cache-control" content="no-cache" />');
				mywindow.document.write('<meta http-equiv="expires" content="0" />');
				mywindow.document.write('<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />');
				mywindow.document.write('<meta http-equiv="pragma" content="no-cache" />');
				mywindow.document.write('<style type="text/css">fieldset{width:100%};.col-xs-12,.col-sm-12,.col-md-12,.col-lg-12 {' + '  width: 100%;float:right;' + '   }' + ' 	.col-xs-11,.col-sm-11,.col-md-11,.col-lg-11 {' + ' 		    width: 91.66666667%;float:right;' + ' 	  }' + ' .col-xs-10,.col-sm-10,.col-md-10,.col-lg-10 {' + '     width: 83.33333333%;float:right;' + '   }'
						+ ' 	.col-xs-9,.col-sm-9,.col-md-9,.col-lg-9 {' + '     width: 75%;float:right;' + '   }' + ' .col-xs-8,.col-sm-8,.col-md-8,.col-lg-8 {' + '    width: 66.66666667%;float:right;' + '  }' + ' .col-xs-7,.col-sm-7,.col-md-7,.col-lg-7 {' + '     width: 58.33333333%;float:right;' + '   }' + ' 	.col-xs-6,.col-sm-6,.col-md-6,.col-lg-6 {' + '   width: 50%;float:right;' + '   }'
						+ ' .col-xs-5,.col-sm-5,.col-md-5,.col-lg-5 {' + '    width: 41.66666667%;float:right;' + '   }' + '.col-xs-4,.col-sm-4,.col-md-4,.col-lg-4 {' + ' 	    width: 33.33333333%;float:right;' + '  }' + ' .col-xs-3,.col-sm-3,.col-md-3,.col-lg-3 {' + '     width: 25%;float:right;' + '   }' + ' .col-xs-2,.col-sm-2,.col-md-2,.col-lg-2 {' + '     width: 16.66666667%;float:right;'
						+ '   }' + ' .col-xs-1,.col-sm-1,.col-md-1,.col-lg-1 {' + '   width: 8.33333333%;float:right;'
						+ '  }@charset "UTF-8";[ng\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}.ng-hide-add-active,.ng-hide-remove{display:block!important;}</style>');
				mywindow.document.write('<link href="app/lib/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/lib/bootstrap-rtl/dist/css/bootstrap-rtl.min.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/lib/vtCommon/vtDatePicker/style.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/lib/vtCommon/vtMessageShower/style.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/lib/AngularJS-Toaster/toaster.min.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/lib/vtCommon/vtSearch/style.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/lib/vtSchemaDirective/style.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/lib/ng-tags-input/ng-tags-input.min.css" rel="stylesheet" media="print , screen" />');
				mywindow.document.write('<link href="app/lib/ng-tags-input/ng-tags-input.bootstrap.min.css" rel="stylesheet" media="print , screen" />');

				mywindow.document.write('<link href="app/assets/css/font.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/assets/css/tab.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/assets/css/base.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/assets/css/bootstrap.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/assets/css/myTechplan.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/assets/css/menu.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/assets/css/footer.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/assets/js/directives/vtParagraphList/style.css" rel="stylesheet" media="print , screen">');
				mywindow.document.write('<link href="app/assets/css/vtParagraphList.css" rel="stylesheet" media="print , screen">');

				mywindow.document.write('<link href="app/lib/font-awesome/css/font-awesome.css" rel="stylesheet" media="print , screen">');
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