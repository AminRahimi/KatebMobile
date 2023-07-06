angular.module("vtFormManagement").directive("editViewGroup", function() {
	return {
		restrict : 'AE',
		templateUrl : 'app/lib/vtSchemaDirective/form-management/editViewGroup/editViewGroup.template.html',
		scope : {
			api : "=",
			viewGroup : "=",
			viewGroupList : "="
		},
		controller : function($scope) {

			$scope.secretLevels = [ {
				id : 0,
				name : "عادی"
			}, {
				id : 1,
				name : "محرمانه"
			}, {
				id : 2,
				name : "خیلی محرمانه"
			}, {
				id : 3,
				name : "سری"
			}, {
				id : 4,
				name : "به کلی سری"
			} ];

			$scope.Data = {
				mainForm : {},
				tmp : {
					viewGroup : null
				},
				validationClicked : false
			};

			$scope.Func = {
				isDuplicateKey : function(viewGroupKey) {
					if($scope.viewGroup.key==viewGroupKey){
						return false
					}
					if (_.find($scope.viewGroupList, function(_viewGroup) {
						return _viewGroup.key == viewGroupKey
					})) {
						return true;
					} else {
						return false;
					}
				},
				correctForEdit : function(viewGroup) {
					$scope.Data.tmp.viewGroup = {
						key : viewGroup.key,
						name : viewGroup.name,
						secretLevel : function() {
							return _.find($scope.secretLevels, function(secretLevel) {
								return secretLevel.id == viewGroup.secretLevel
							});
						}()
					}

				},
				regenerate : function() {
					// $scope.viewGroup = viewGroup;
					$scope.Func.correctForEdit($scope.viewGroup);
					if ($scope.viewGroup.key != '') {
						$scope.editFlag = true;
					}
					// if ($scope.viewGroup.secretLevel != '')
					// $scope.viewGroup.secretLevel =
					// _.find($scope.secretLevels, function(v) {
					// return v.id == $scope.viewGroup.secretLevel;
					// });

				}
			}
			$scope.create = function() {
				if ($scope.Data.mainForm.$valid) {
					if (!$scope.Func.isDuplicateKey($scope.Data.tmp.viewGroup.key)) {
						$scope.api.onSaveClick($scope.Data.tmp.viewGroup);
					}else{
						$scope.Data.validationClicked = true;
						$scope.Data.duplicateKey = true;
					}
				} else {
					$scope.Data.validationClicked = true;
				}
			}
			$scope.onReturnClick = function() {
				if (angular.isFunction($scope.api.onCancelClick)) {
					$scope.api.onCancelClick();
				}
			};

			var Run = function() {
				// $scope.Func.regenerate();
				$scope.api.regenerate = $scope.Func.regenerate;
			}

			Run();

		},
		link : function(scope, element, attrs) {
		}
	};
});