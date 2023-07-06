angular.module("multiRelationSelector", []).factory('multiRelationSelectorSrvc', function() {
	return {
		correctModel : function(schemaOfFiled,globalModel,propNameOnGlobalModel) {
			var isEntityTypeChangeable = function() {
				if (schemaOfFiled.typeParams && schemaOfFiled.typeParams.destType) {
					return false
				} else {
					return true
				}
			}();
			if (angular.isArray(globalModel[propNameOnGlobalModel])) {

				angular.forEach(globalModel[propNameOnGlobalModel], function(_relationObj, _index) {
					if (isEntityTypeChangeable) {
						globalModel[propNameOnGlobalModel][_index].destination = {
							uid : globalModel[propNameOnGlobalModel][_index].destination.uid ? globalModel[propNameOnGlobalModel][_index].destination.uid : (globalModel[propNameOnGlobalModel][_index].destination._uid ? globalModel[propNameOnGlobalModel][_index].destination._uid : globalModel[propNameOnGlobalModel][_index].destination),
							type : globalModel[propNameOnGlobalModel][_index].destination.type
						}
					} else {
						if (globalModel[propNameOnGlobalModel][_index].destination) {
							globalModel[propNameOnGlobalModel][_index].destination = globalModel[propNameOnGlobalModel][_index].destination.uid ? globalModel[propNameOnGlobalModel][_index].destination.uid : (globalModel[propNameOnGlobalModel][_index].destination._uid ? globalModel[propNameOnGlobalModel][_index].destination._uid : globalModel[propNameOnGlobalModel][_index].destination);
						}
					}
				});
			}
		}
	}
}).directive('multiRelationSelector', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/lib/vtSchemaDirective/components/multiRelationSelector/multiRelationSelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			api :"="
		},
		controller : function($scope, entitySrvc, $modal) {

			$scope.entityKey = $scope.schema.type;

			$scope.onOpenAddEditRelationModal = function(relationModel, index) {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/multiRelationSelector/multiRelationSelectorModalTemplate.html',
					// FIXME:this (addEntityModalCtrl) is depend on
					// entitySelectorDirective
					controller : 'multiRelationSelectorModalTemplateCtrl',
					windowClass : 'modalLarge',
					backdrop : 'static',
					size : 'lg',
					resolve : {
						schema : function() {
							return $scope.schema;
						},
						model : function() {
							return angular.copy(relationModel);

							/*
							 * return { "destination" : { "uid" :
							 * "367bdc36-ea44-47ae-80ce-3c1a0cf2d5dc", "type" :
							 * "person" }, "title" : "aaaa", "relationDirection" :
							 * "2", "description" : "ddasd", "startDate" :
							 * "2015-09-15T19:30:00.000Z", "endDate" :
							 * "2015-09-20T19:30:00.000Z" }
							 */
						},
						isEditMode : function() {
							return $scope.isEditMode;
						}
					}

				});

				modalInstance.result.then(function(relationObj) {
					if (relationModel) {
						// isEditMode
						$scope.model[index] = relationObj;
					} else {
						// isAddMode
						if (!$scope.model) {
							$scope.model = [];
						}

						$scope.model.push(relationObj);
					}

				}, function() {
				});
			};

			$scope.onRemoveRelationClick = function(relation) {

				angular.forEach($scope.model, function(key, index) {
					if (_.isEqual(relation, key)) {
						$scope.model.splice(index, 1);
					}
				});

			};
			/*
			 * var correctModel = function() { var isEntityTypeChangeable =
			 * function() { if ($scope.schema.typeParams &&
			 * $scope.schema.typeParams.destType) { return false } else { return
			 * true } }(); if (angular.isArray($scope.model)) {
			 * 
			 * angular.forEach($scope.model, function(_relationObj) { if
			 * (isEntityTypeChangeable) { $scope.model.destination = { uid :
			 * $scope.model.destination.uid ? $scope.model.destination.uid :
			 * $scope.model.destination._uid, type :
			 * $scope.schema.typeParams.destType } } else {
			 * $scope.model.destination = $scope.model.destination.uid ?
			 * $scope.model.destination.uid : $scope.model.destination._uid; }
			 * }); } }
			 */
			var Run = function() {
				/*
				 * $scope.$watch('model',function(){ correctModel(); });
				 * correctModel();
				 */
			}

			Run()
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
