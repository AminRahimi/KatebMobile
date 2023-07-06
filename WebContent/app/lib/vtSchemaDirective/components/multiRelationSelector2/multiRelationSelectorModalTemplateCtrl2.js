angular.module("multiRelationSelector2").controller('multiRelationSelectorModalTemplateCtrl2', function($scope, $modalInstance, schema, entitySrvc, model, isEditMode, $timeout, relationDirection, multiEntitySelectorForRelationViewSrvc, formModel, schemaOfEntityType,isAddMode,$modal,entitySelectorSrvc,modelByRefrence) {
	$scope.relationDirection = relationDirection;
	$scope.isAddMode=isAddMode;
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
		schemaOFDestination : function() {

			if (model && model.destEntityType) {
				return {
					type : model.destEntityType

				}
			} else {
				return {
					type : null
				}
			}

			/*
			 * if (schema.typeParams && schema.typeParams.destType) { return {
			 * type : schema.typeParams.destType }; } else if (model &&
			 * model.destination) { return { type : model.destination }; } else {
			 * return { type : null } }
			 */
		}(),
		schemaOFSource : function() {
			if (model && model.sourceEntityType) {
				return {
					type : model.sourceEntityType

				}
			} else {
				return {
					type : null
				}
			}

			/*
			 * if (schema.typeParams && schema.typeParams.destType) { return {
			 * type : schema.typeParams.destType }; } else if (model &&
			 * model.destination) { return { type : model.destination }; } else {
			 * return { type : null } }
			 */
		}(),
		isEntityTypeChangeable : function() {
			// check if is Relation In ReltionView

			if (model && model.destEntityFieldName) {
				return !multiEntitySelectorForRelationViewSrvc.isRelationInReltionView(model.destEntityFieldName, formModel, schemaOfEntityType);
			} else {
				return true;
			}

		}(),
		entityTypes : [],
		selectedSourceEntityType : {},
		selectedDestinationEntityType : {},
		relation : function() {
			if (model) {
				model.source = model.source ? model.source : model.sourceEntityData;
				model.destination = model.destination ? model.destination : model.destEntityData;
				return model;
			} else {
				return {};
			}
		}()

	}
	$scope.Func = {
		isSelectedEntityType:function(selectedEntityType){
			return (selectedEntityType &&  !_.isEmpty(selectedEntityType));
		},
		doToggleStyle : function() {
			$('#toggle-one').bootstrapToggle();
			$('#toggle-one').change(function() {
				if ($(this).prop('checked')) {
					$("#reverce-relation").addClass("ng-hide");
				} else {
					$("#reverce-relation").removeClass("ng-hide");
				}
			});
			
			
			
			$timeout(function() {
				if ($scope.Data.relation.relationDirection === 1) {
					$('#toggle-one').bootstrapToggle('on');
				} else {
					$('#toggle-one').bootstrapToggle('off');

				}
				if (!$scope.Data.isEntityTypeChangeable || $scope.mode=='VIEW') {
					$('#toggle-one').bootstrapToggle('disable');
				}
			}, 1000);
			
			

		},
		cancel : function() {
			$modalInstance.dismiss('cancel');
		},
		ok : function() {
			$scope.Data.relation.destEntityUid = ($scope.Data.relation.destination && $scope.Data.relation.destination._uid) ? $scope.Data.relation.destination._uid : $scope.Data.relation.destEntityUid;
			$scope.Data.relation.sourceEntityUid = ($scope.Data.relation.source && $scope.Data.relation.source._uid) ? $scope.Data.relation.source._uid : $scope.Data.relation.sourceEntityUid;
			$scope.Data.relation.destEntityType = $scope.Data.schemaOFDestination.type;
			$scope.Data.relation.sourceEntityType = $scope.Data.schemaOFSource.type;

			if ($('#toggle-one').prop('checked')) {
				$scope.Data.relation.relationDirection = 1;
				delete $scope.Data.relation.backwardRelationLabel;
			} else if (!$('#toggle-one').prop('checked')) {
				$scope.Data.relation.relationDirection = 2;
			}
			// $scope.Data.relation.relationDirection =
			// parseInt($scope.Data.relation.relationDirection);
			if (model && model.relationUid) {
				// is edit mode
				$scope.Data.relation.isEdited = true;
			} else {
				$scope.Data.relation.isAdded = true;
			}
			$modalInstance.close($scope.Data.relation);
		},
		onSelectDestinationEntityType : function() {
			$scope.Data.schemaOFDestination.type = $scope.Data.selectedDestinationEntityType.key;
			$scope.Data.relation ? ($scope.Data.relation.destination = null) : $scope.Data.relation = null;
		},
		onSelectSourceEntityType : function() {
			$scope.Data.schemaOFSource.type = $scope.Data.selectedSourceEntityType.key;
			$scope.Data.relation ? ($scope.Data.relation.source = null) : $scope.Data.relation = null;
		},
		onOpenViewEntityModalClick:function(){
			entitySelectorSrvc.openEntityInfoModal($scope.Data.relation.destEntityData,$scope.Data.selectedDestinationEntityType.key).then(function(newModel){
				$scope.Data.relation.destEntityData= angular.copy(newModel);
				
				
				
				modelByRefrence.destEntityData._displayString= $scope.Data.relation.destEntityData._displayString;
				
				
			});
		}
	}

	var Run = function() {
		entitySrvc.getEntityTypeList(1,-1).then(function(response) {
			$scope.Data.entityTypes = response.data;

			// if ($scope.Data.isEntityTypeChangeable) {
			// Destination
			if ($scope.Data.relation.destEntityType) {
				$scope.Data.schemaOFDestination.type = $scope.Data.relation.destEntityType;
				// entityKey
				angular.forEach($scope.Data.entityTypes, function(_entityType, _index) {
					if (_entityType.key == $scope.Data.schemaOFDestination.type) {
						$scope.Data.selectedDestinationEntityType = $scope.Data.entityTypes[_index];
					}
				});
			} else {
				angular.forEach($scope.Data.entityTypes, function(_entityType, _index) {
					if (_entityType.entityKey == schemaOfEntityType.key) {
						$scope.Data.selectedDestinationEntityType = $scope.Data.entityTypes[_index];
					}
				});
				$scope.Data.schemaOFDestination.type = schemaOfEntityType.key;
			}
			// Source
			if ($scope.Data.relation.sourceEntityType) {
				$scope.Data.schemaOFSource.type = $scope.Data.relation.sourceEntityType;
				// entityKey
				angular.forEach($scope.Data.entityTypes, function(_entityType, _index) {
					if (_entityType.key == $scope.Data.schemaOFSource.type) {
						$scope.Data.selectedSourceEntityType = $scope.Data.entityTypes[_index];
					}
				});
			} else {

				angular.forEach($scope.Data.entityTypes, function(_entityType, _index) {
					if (_entityType.key == schemaOfEntityType.key) {
						$scope.Data.selectedSourceEntityType = $scope.Data.entityTypes[_index];
					}
				});
				$scope.Data.schemaOFSource.type = schemaOfEntityType.key;
			}
			// }
		});
		// $scope.Data.relation.relationDirection =
		// $scope.Data.relation.relationDirection ?
		// $scope.Data.relation.relationDirection : 1;
		

	}
	Run();
});