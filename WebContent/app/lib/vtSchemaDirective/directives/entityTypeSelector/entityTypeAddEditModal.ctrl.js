angular.module('schemaForm').controller('entityTypeAddEditModalCtrl', function($scope, model, questionnaireSrvc, mode, $modalInstance) {

	$scope.Data = {
		model : model || {},
		form : {},
		mode : "none",
		validationClicked : false,
		mode : mode
	}

	$scope.Func = {
		setMode : function(mode) {
			$scope.Data.mode = mode;
			if ($scope.Data.mode == "edit") {
				$scope.Apis.entityTypeCRUD.gotoEditMode();
			} else if ($scope.Data.mode == "add") {
				$scope.Apis.entityTypeCRUD.gotoAddMode();
			}
		},
		events : {
			onUpdateClick : function() {
				if ($scope.Data.form.$valid) {
					var sendingData = angular.copy($scope.Apis.entityTypeCRUD.getFilledModel());
					// var sendingData = angular.copy($scope.Data.tmp.selected);
					return questionnaireSrvc.update(sendingData, sendingData.key).then(function(response) {
						$scope.Data.validationClicked = false;
						$modalInstance.close(sendingData);
					});
				} else {
					$scope.Data.validationClicked = true;
				}

			},
			onSaveAddingClick : function() {
				if ($scope.Data.form.$valid) {
					var sendingData = angular.copy($scope.Apis.entityTypeCRUD.getFilledModel());
					return questionnaireSrvc.add(sendingData).then(function(response) {
						$scope.Data.validationClicked = false;
						$modalInstance.close(sendingData);
					});
				} else {
					$scope.Data.validationClicked = true;
				}

			},
			onCancelClick : function() {
				$scope.Data.validationClicked = false;
				$modalInstance.close();
			}
		}
	}

	$scope.Apis = {
		entityTypeCRUD : {
			onInit : function() {
				$scope.Func.setMode($scope.Data.mode);
			}
		}
	}

	var Run = function() {
	}

	Run();

});
