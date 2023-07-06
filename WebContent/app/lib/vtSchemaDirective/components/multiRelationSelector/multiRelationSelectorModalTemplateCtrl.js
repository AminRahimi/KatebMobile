angular.module("multiRelationSelector").controller('multiRelationSelectorModalTemplateCtrl', function($scope, $modalInstance, schema, entitySrvc, model, isEditMode, $timeout) {

	
	
	
	
	
	
	if (isEditMode) {
		$scope.mode = "EDIT";
	} else {
		$scope.mode = "VIEW";
	}
	$scope.date = {
		dateOptions : {
			formatYear : 'yy'
		},
		isOpen : {
			from : false,
			to : false
		},
		model : {
			from : new Date(),
			to : new Date()
		},
		open : function($event, type) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.date.isOpen[type] = true;

		},
		onChange : function(type) {
			/*
			 * if ($scope.date.model.from && $scope.date.model.to &&
			 * $scope.time.from && $scope.time.to) { $scope.getDiff(entity._uid,
			 * $scope.date.model.from, $scope.date.model.to, $scope.time.from,
			 * $scope.time.to, parseInt($scope.itemsPagination.currentPage),
			 * 10); }
			 */
		}
	};

	$scope.Data = {
		schema : function() {
			if (schema.typeParams && schema.typeParams.destType) {
				return {
					type : schema.typeParams.destType
				};
			} else if (model && model.destination) {
				return {
					type : model.destination
				};
			} else {
				return {
					type : null
				}
			}
		}(),
		isEntityTypeChangeable : function() {
			if (schema.typeParams && schema.typeParams.destType) {
				return false
			} else {
				return true
			}
		}(),
		entityTypes : [],
		selectedEntityType : {},
		relation : model || {}
	}
	$scope.Func = {
		cancel : function() {
			$modalInstance.dismiss('cancel');
		},
		ok : function() {
			if (!angular.isString($scope.Data.relation.destination)) {
				if ($scope.Data.isEntityTypeChangeable) {
					// console.log()
					// {"uid":"UID" , "type":"person"}
					if ($scope.Data.relation.destination) {
						// $scope.Data.relation.destination = {
						// uid : $scope.Data.relation.destination.uid ?
						// $scope.Data.relation.destination.uid :
						// $scope.Data.relation.destination._uid,
						// type : $scope.Data.schema.type
						// }
						$scope.Data.relation.destination.type = $scope.Data.schema.type;

					}
				} else {
					// if ($scope.Data.relation.destination) {
					// $scope.Data.relation.destination =
					// $scope.Data.relation.destination.uid ?
					// $scope.Data.relation.destination.uid :
					// $scope.Data.relation.destination._uid;
					// }
				}
			}
			if ($('#toggle-one').prop('checked')) {
				$scope.Data.relation.relationDirection = 1;
			} else if (!$('#toggle-one').prop('checked')) {
				$scope.Data.relation.relationDirection = 2;
			}
			// $scope.Data.relation.relationDirection =
			// parseInt($scope.Data.relation.relationDirection);
			$modalInstance.close($scope.Data.relation);
		},
		onSelectEntityType : function() {
			$scope.Data.schema.type = $scope.Data.selectedEntityType.entityKey;
			$scope.Data.relation ? ($scope.Data.relation.destination = null) : $scope.Data.relation = null;
		}
	}

	var Run = function() {
		entitySrvc.getEntityTypeList(1,-1).then(function(response) {
			$scope.Data.entityTypes = response.data;

			if ($scope.Data.isEntityTypeChangeable) {
				if ($scope.Data.relation.destination && $scope.Data.relation.destination.type) {
					$scope.Data.schema.type = $scope.Data.relation.destination.type;
					// entityKey
					angular.forEach($scope.Data.entityTypes, function(_entityType, _index) {
						if (_entityType.key == $scope.Data.schema.type) {
							$scope.Data.selectedEntityType = $scope.Data.entityTypes[_index];
						}
					});
				} else {
					$scope.Data.selectedEntityType = $scope.Data.entityTypes[0];
					$scope.Data.schema.type = $scope.Data.entityTypes[0].key;
				}
			}
		});
		// $scope.Data.relation.relationDirection =
		// $scope.Data.relation.relationDirection ?
		// $scope.Data.relation.relationDirection : 1;
		$timeout(function() {
			if ($scope.Data.relation.relationDirection === 1) {
				$('#toggle-one').bootstrapToggle('on');
			} else {
				$('#toggle-one').bootstrapToggle('off');
			}
		}, 1);

	}
	Run();
});