angular.module("vtEntitySelector").directive('vtMultiEntitySelector', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/assets/js/directives/vtEntitySelector/vtMultiEntitySelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api : "="
		},
		controller : function($scope, vtEntitySelectorSrvc, $modal, vtEntitySelectorSrvc) {

			$scope.entityKey = $scope.schema.type;
			if ($scope.schema.widgetParams)
				$scope.isAddOnly = $scope.schema.widgetParams.addOnly;

			$scope.openEntityInfoModal = function(entity) {
				vtEntitySelectorSrvc.openEntityInfoModal(entity, $scope.entityKey).then(function(newModel) {
					for (var int = 0; int < $scope.model.length; int++) {
						if ($scope.model[int]._uid == newModel._uid) {
							$scope.model[int] = newModel;
						}
					}
				});
			};

			$scope.openEntityMultiSelectorModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/assets/js/directives/vtEntitySelector/multiEntitySelectorModalTemplate.html',
					controller : 'vtMultiEntitySelector.multiEntitySelectorModalCtrl',
					windowClass : 'modalLarge',
					resolve : {
						entityKey : function() {
							return $scope.entityKey;
						},
						model : function() {
							return $scope.model;
						},
						entityType : function() {
							var entityKey = $scope.schema.type;
							return vtEntitySelectorSrvc.getEntityType(entityKey);
						}
					}
				});

				modalInstance.result.then(function(selectedItems) {
					$scope.selectedItems = selectedItems;
					if ($scope.selectedItems.length) {
						$scope.model = [];
						for (var i = 0; i < $scope.selectedItems.length; i++) {
							$scope.model.push($scope.selectedItems[i]);
						}
					}

				}, function() {
				});
			};

			$scope.onRemoveEntityClick = function(entity) {

				angular.forEach($scope.model, function(key, index) {
					if (entity._uid === key._uid) {
						$scope.model.splice(index, 1);
					}
				});

			};

			$scope.onOpenAddNewEntityModal = function() {
				vtEntitySelectorSrvc.openAddNewEntityModal($scope.schema.type).then(function(selectedEntity) {
					if (!$scope.model) {
						$scope.model = [];
					}
					$scope.model.push(selectedEntity);
				});
			};

			vtEntitySelectorSrvc.getEntityType($scope.entityKey).then(function(response) {
				$scope.schemaOfEntityType = response.data;
			});

		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
