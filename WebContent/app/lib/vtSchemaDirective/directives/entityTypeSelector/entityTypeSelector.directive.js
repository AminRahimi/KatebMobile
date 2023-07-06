angular.module("schemaForm").directive("entityTypeSelector", function() {
	return {
		restrict : 'AE',
		templateUrl : 'app/lib/vtSchemaDirective/directives/entityTypeSelector/entityTypeSelector.temp.html',
		scope : {
			api : "=",
			model : "="
		},
		controller : function($scope, $modal) {
			$scope.Data = {}

			$scope.Func = {
				onOpenEditModalClick : function() {
					var modalInstance = $modal.open({
						templateUrl : 'app/lib/vtSchemaDirective/directives/entityTypeSelector/entityTypeAddEditModal.temp.html',
						controller : 'entityTypeAddEditModalCtrl',
						resolve : {
							model : function() {
								return $scope.model
							},
							mode : function(){
								return 'edit'
							}
						}
					});
					return modalInstance.result.then(function(edditingEntity) {
						$scope.model = edditingEntity;
					});
				},
				onOpenAddModalClick : function() {
					var modalInstance = $modal.open({
						templateUrl : 'app/lib/vtSchemaDirective/directives/entityTypeSelector/entityTypeAddEditModal.temp.html',
						controller : 'entityTypeAddEditModalCtrl',
						resolve : {
							model : function() {
								return {};
							},
							mode : function(){
								return 'add'
							}
						}
					});
					return modalInstance.result.then(function(addedEntity) {
						$scope.model = addedEntity;
					});
				},
				onOpenSelectorModal : function() {
					var modalInstance = $modal.open({
						templateUrl : 'app/lib/vtSchemaDirective/directives/entityTypeSelector/entityTypeListModal.temp.html',
						controller : 'entityTypeListModalCtrl'
					});
					return modalInstance.result.then(function(selected) {
						$scope.model = selected;
					});
				},
				onRemoveClick : function() {
					$scope.model = undefined;
				}
			}

			var Run = function() {
			}
			Run();

		},
		link : function(scope, element, attrs) {
		}
	};
});