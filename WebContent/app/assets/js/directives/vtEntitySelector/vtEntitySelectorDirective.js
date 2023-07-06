angular.module("vtEntitySelector", []).directive('vtEntitySelector', function($compile, vtEntitySelectorSrvc) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/assets/js/directives/vtEntitySelector/vtEntitySelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			disable : "=",
			api : "="
		},
		// h ['persianDatepicker', '?^ngModel'],
		controller : function($scope, vtEntitySelectorSrvc, $modal) {
			// entitySelectorModalTemplate.html
			$scope.entityKey = $scope.schema.type;
			if ($scope.schema.widgetParams)
				$scope.isAddOnly = $scope.schema.widgetParams.addOnly;

			$scope.onEditSelectedClick = function() {
				vtEntitySelectorSrvc.openEntityInfoModal($scope.model, $scope.entityKey).then(function(newModel) {
//					$scope.model.displayString = newModel.displayString;
					$scope.model = angular.copy(newModel);
				});
			}

			$scope.openEntityInfoModal = function(entity) {
				vtEntitySelectorSrvc.openEntityInfoModal(entity, $scope.entityKey).then(function(newModel) {
					$scope.model = angular.copy(newModel);
				});
			};
			$scope.openEntitySelectorModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/assets/js/directives/vtEntitySelector/entitySelectorModalTemplate.html',
					controller : 'vtEntitySelector.entitySelectorModalCtrl',
					windowClass : 'modal-XLarge',
					resolve : {
						/*
						 * items : function() { var entityKey =
						 * $scope.schema.widget.split("_")[1]; return
						 * vtEntitySelectorSrvc.getEntityList(entityKey); },
						 */
						entityKey : function() {
							return $scope.schema.type;
						},
						model : function() {
							return $scope.model;
						}
					}

				});

				modalInstance.result.then(function(selectedItem) {
					$scope.selectedItem = selectedItem;
					$scope.model = $scope.selectedItem;

					// $scope.model.display = $scope.model._uid

				}, function() {
				});
			};
			$scope.onRemoveSelectedClick = function() {
				$scope.model = $scope.selectedItem = undefined;
			}

			$scope.onOpenAddNewEntityModal = function() {
				vtEntitySelectorSrvc.openAddNewEntityModal($scope.entityKey).then(function(selectedEntity) {
					$scope.selectedItem = selectedEntity;
					$scope.model = $scope.selectedItem;
				});
			};
			vtEntitySelectorSrvc.getEntityType($scope.entityKey).then(function(response) {
				$scope.schemaOfEntityType = response.data;
			});

		},
		link : function(scope, element, attrs, ctrls) {
			/*
			 * if (attrs.ngRequired) { scope.required = attrs.ngRequired;
			 * element.find("input").attr("ng-required", scope.required); }
			 * return $compile(element.contents())(scope);
			 */
		}
	};
}).run(function($injector,$http) {
	if ($injector.has('formManagementSrvc')) {
		var formManagementSrvc = $injector.get('formManagementSrvc');

		$http.get('api/entity_type/items?len=-1').success(function(response, status, headers, config) {
			angular.forEach(response.items, function(entityType, index) {
				formManagementSrvc.setComponent({
					type : entityType.key,
					typePersianName : entityType.name,
					widgets : [ {
						widget : "popupSelector",
						picName : "x",
						persianName : "انتخابگر موجودیت",
						multiple : true,
						isHidden : (index == 0) ? false : true,
						picPath : "app/assets/js/directives/vtEntitySelector/entitySelector.png",
						htmlPath : "app/assets/js/directives/vtEntitySelector/entitySelectorSchemaFormTemplate.html"
					} ]
				});
				
			});
		});

	}
});
