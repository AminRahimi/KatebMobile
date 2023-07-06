/*تمپلیت این دایرکتیو به دلیل تغییرات خاصی که نسبت به cm داشت از داخل lib
خارج شده و به هنگام آپدیت vtSchemaDirective باید متوجه این موضوع بود.
    فایل اصلی با نام  tableEntitySelectorTemplate.orig.html در همین پوشه موجود است.*/
angular.module("schemaForm").directive('tableEntitySelector', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		require: 'ngModel',
		templateUrl : 'app/assets/js/directives/tableEntitySelector/tableEntitySelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api:"="
		},
		controller : function($scope, entitySrvc, $modal) {
			$scope.entityKey = $scope.schema.type;

			entitySrvc.getEntityType($scope.entityKey).then(function(response){
				$scope.jsonSchema = response.data.jsonSchema;
				console.log(response.data.originalElement);
			});
			
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
					for (var int = 0; int < $scope.model.length; int++) {
						if ($scope.model[int]._uid == newModel._uid) {
							$scope.model[int] = newModel;
						}
					}
				});
			};

			$scope.openEntityMultiSelectorModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/multiEntitySelector/multiEntitySelectorModalTemplate.html',
					controller : 'entityMultiSelectorModalCtrl',
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
							return entitySrvc.getEntityType(entityKey);
						}
					}
				});

				modalInstance.result.then(function(selectedItems) {
					$scope.ngModel.$setDirty();
					$scope.selectedItems = selectedItems;
					if ($scope.selectedItems.length) {
						$scope.model = [];
						for (var i = 0; i < $scope.selectedItems.length; i++) {
							$scope.model.push($scope.selectedItems[i]);
						}
					}
				});
			};

			$scope.onRemoveEntityClick = function(entity) {
				$scope.ngModel.$setDirty();
				angular.forEach($scope.model, function(key, index) {
					if (entity._uid === key._uid) {
						$scope.model.splice(index, 1);
					}
				});

			};

			$scope.onOpenAddNewEntityModal = function() {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/entitySelector/partials/addEntityModalTemplate.html',
					// FIXME:this (addEntityModalCtrl) is depend on
					// entitySelectorDirective
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
					if (!$scope.model) {
						$scope.model = [];
					}
					$scope.model.push(selectedItem);
				}, function() {
				});
			};
		},
		link : function(scope, element, attrs, ctrls) {
			scope.ngModel = ctrls;
		}
	};
});