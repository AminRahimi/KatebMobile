angular.module("multiRelationSelector2", [ 'multiEntitySelectorForRelationView' ]).factory('multiRelationSelector2Srvc', function() {
	return {
		correctModel : function(schemaOfFiled, entityModel, fieldName) {
			if (entityModel[fieldName]) {
				var relationable = {
					edited : [],
					added : [],
					deleted : []
				};
				angular.forEach(entityModel[fieldName]["forward"], function(_relation) {

					delete _relation.sourceEntityData;
					delete _relation.destEntityData;
					if (_relation.destination) {
						_relation.destEntityUid = _relation.destination._uid;
						_relation.destEntityType = _relation.destination.type ? _relation.destination.type : _relation.destEntityType;
						delete _relation.destination;
					}
					_relation.forwardRelationLabel = _relation.title ? _relation.title : _relation.forwardRelationLabel;
					_relation.fromDate = (_relation.fromDate && angular.isDate(_relation.fromDate)) ? _relation.fromDate.getTime() : _relation.fromDate;
					_relation.toDate = (_relation.toDate && angular.isDate(_relation.toDate)) ? _relation.toDate.getTime() : _relation.toDate;

					delete _relation.title;
					if (_relation.isEdited) {
						delete _relation.isEdited;
						relationable.edited.push(_relation);

					}
					if (_relation.isAdded) {
						delete _relation.isAdded;
						relationable.added.push(_relation);
					}
					if (_relation.isDeleted) {
						delete _relation.isDeleted;
						relationable.deleted.push(_relation);
					}
				});
				angular.forEach(entityModel[fieldName]["backward"], function(_relation) {

					if (_relation.source) {
						_relation.sourceEntityUid = _relation.source._uid;
						_relation.sourceEntityType = _relation.source.type ? _relation.source.type : _relation.sourceEntityType;
						delete _relation.source;
					}
					_relation.backwardRelationLabel = _relation.title ? _relation.title : _relation.backwardRelationLabel;
					_relation.fromDate = (_relation.fromDate && angular.isDate(_relation.fromDate)) ? _relation.fromDate.getTime() : _relation.fromDate;
					_relation.toDate = (_relation.toDate && angular.isDate(_relation.toDate)) ? _relation.toDate.getTime() : _relation.toDate;
					delete _relation.title;
					if (_relation.isEdited) {
						delete _relation.isEdited;
						relationable.edited.push(_relation);

					}
					if (_relation.isAdded) {
						delete _relation.isAdded;
						relationable.added.push(_relation);
					}
					if (_relation.isDeleted) {
						delete _relation.isDeleted;
						relationable.deleted.push(_relation);
					}
				});

				entityModel[fieldName] = relationable;
			}
		},
		editRelationViewOfRelation : function(relationViewSchema, relationViewModel, globModel, field) {
			if (globModel['@relationable'] && globModel['@relationable']['forward']) {

				angular.forEach(globModel['@relationable']['forward'], function(_relation) {
					if (_relation.sourceEntityFieldName == field) {
						_relation.destEntityUid = relationViewModel._uid;
						if (_relation.isEdited || (!_relation.isEdited && !_relation.isAdded && !_relation.isDeleted)) {
							_relation.isEdited = true;
						}
					}
				});
			}
		},
		removeRelationViewFromRelation : function(relationViewSchema, relationViewModel, globModel, field) {
			if (globModel['@relationable'] && globModel['@relationable']['forward']) {
				angular.forEach(globModel['@relationable']['forward'], function(_relation, index) {
					if (_relation.sourceEntityFieldName == field && _relation.destEntityUid == relationViewModel._uid) {
						if (_relation.isAdded) {
							globModel['@relationable']['forward'].splice(index, 1);
						} else {
							_relation.isEdited = false;
							_relation.isAdded = false;
							_relation.isDeleted = true;
						}
					}
				});
			}
			if (globModel['@relationable'] && globModel['@relationable']['backward']) {
				angular.forEach(globModel['@relationable']['backward'], function(_relation, index) {
					if (_relation.destEntityFieldName == field && _relation.sourceEntityUid == relationViewModel._uid) {
						if (_relation.isAdded) {
							_relation.relationDirection = 1;
							_relation.isBackwardOneWay = true;
							// globModel['@relationable']['backward'].splice(index,
							// 1);
						} else {
							_relation.isEdited = true;
							_relation.isAdded = false;
							_relation.relationDirection = 1;
							// _relation.isDeleted = true;
						}
					}
				});
			}

		},
		addOrUpdateEditedOrUpdatedRelationByRelationViewWidget : function(relationViewSchema, relationViewModel, globModel, globSchema, field, mode) {
			if (mode == "EDIT") {
				this.editRelationViewOfRelation(relationViewSchema, relationViewModel, globModel, field);
			} else if (mode == "ADD") {
				var tempRelation = angular.extend({
					destEntityUid : relationViewModel._uid,
					sourceEntityType : globSchema.key,
					sourceEntityFieldName : field,
					destEntityData : {
						_displayString : relationViewModel._displayString
					}
				}, relationViewSchema.typeParams);
				// relationViewSchema.destEntityUid = entityModel[fieldName];
				tempRelation.isAdded = true;
				if (globModel['@relationable'] && globModel['@relationable']['forward']) {
					globModel['@relationable']['forward'].push(tempRelation);
				} else if (globModel['@relationable'] && !globModel['@relationable']['forward']) {
					globModel['@relationable']['forward'] = [ tempRelation ];
				} else {
					globModel['@relationable'] = {
						'forward' : [ tempRelation ]
					};
				}
			} else if (mode == "REMOVE") {
				this.removeRelationViewFromRelation(relationViewSchema, relationViewModel, globModel, field);
			}

		}
	}
}).directive('multiRelationSelector2', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		require: 'ngModel',
		templateUrl : 'app/lib/vtSchemaDirective/components/multiRelationSelector2/multiRelationSelectorTemplate2.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			formModel : "=",
			schemaOfEntityType : "=",
			relationDirection : "@",
			api : "="
		},
		controller : function($scope, entitySrvc, $modal, multiEntitySelectorForRelationViewSrvc, entitySelectorForRelationViewSrvc) {

			// $scope.entityKey = $scope.schema.type;

			$scope.onOpenAddEditRelationModal = function(relationModel, index) {
				var isAddMode = false;
				if (angular.isDefined(relationModel)) {
					isAddMode = true;
				}
				var relationnModelBeforeChange = angular.copy(relationModel);
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective/components/multiRelationSelector2/multiRelationSelectorModalTemplate2.html',
					// FIXME:this (addEntityModalCtrl) is depend on
					// entitySelectorDirective
					controller : 'multiRelationSelectorModalTemplateCtrl2',
					windowClass : 'modalLarge',
					backdrop : 'static',
					size : 'lg',
					resolve : {
						schema : function() {
							return {
								"type" : "relation",
								"label" : "موجودیت های مرتبط",
								"multiple" : true
							}
						},
						modelByRefrence : function() {
							return relationModel;
						},
						model : function() {
							return angular.copy(relationModel);
						},
						relationDirection : function() {
							return $scope.relationDirection;
						},
						isEditMode : function() {
							if ($scope.relationDirection == 'backward') {
								return false
							} else {
								return $scope.isEditMode;
							}
						},
						schemaOfEntityType : function() {
							return $scope.schemaOfEntityType
						},
						formModel : function() {
							return $scope.formModel;
						},
						isAddMode : function() {
							return isAddMode;
						}
					}

				});

				modalInstance.result.then(function(relationObj) {

					$scope.ngModel.$setDirty();
					angular.forEach($scope.formModel, function(_formModel, propName) {

						if ($scope.relationDirection == "forward") {
							if ($scope.schemaOfEntityType.properties[propName] && $scope.schemaOfEntityType.properties[propName].typeParams && $scope.schemaOfEntityType.properties[propName].typeParams && propName == relationObj.sourceEntityFieldName) {
								// is relation in relation view widget
								// if is multipe or single correct uids on
								// relation
								// view widget
								if ($scope.schemaOfEntityType.properties[propName].multiple) {
									// is multiple
									multiEntitySelectorForRelationViewSrvc.findEntityByUIDAndUpdateUID(relationnModelBeforeChange, $scope.formModel, propName, relationObj, true);
								} else {
									// is single
									entitySelectorForRelationViewSrvc.findEntityByUIDAndUpdateUID(relationnModelBeforeChange, $scope.formModel, propName, relationObj, true);
								}
							}
						}
						if ($scope.relationDirection == "backward") {
							if ($scope.schemaOfEntityType.properties[propName] && $scope.schemaOfEntityType.properties[propName].typeParams && $scope.schemaOfEntityType.properties[propName].typeParams && propName == relationObj.destEntityFieldName) {
								// is relation in relation view widget
								// if is multipe or single correct uids on
								// relation
								// view widget
								if ($scope.schemaOfEntityType.properties[propName].multiple) {
									// is multiple
									multiEntitySelectorForRelationViewSrvc.findEntityByUIDAndUpdateUID(relationnModelBeforeChange, $scope.formModel, propName, relationObj, false);
								} else {
									// is single
									entitySelectorForRelationViewSrvc.findEntityByUIDAndUpdateUID(relationnModelBeforeChange, $scope.formModel, propName, relationObj, false);

								}
							}
						}

					});

					if ($scope.relationDirection == "forward") {
						relationObj.destEntityData = {
							_displayString : relationObj.destination._displayString
						}
					} else if ($scope.relationDirection == "backward") {
						relationObj.sourceEntityData = {
							_displayString : relationObj.source._displayString
						}
					}

					if (relationnModelBeforeChange) {
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

				if (relation.relationUid) {
					relation.isDeleted = true;
				} else {
					angular.forEach($scope.model, function(key, index) {
						if (_.isEqual(relation, key)) {
							$scope.model.splice(index, 1);
							$scope.model[index]
						}
					});
				}

				if ($scope.relationDirection == "forward") {

					delete $scope.formModel[relation.sourceEntityFieldName]
				} else {
					delete $scope.formModel[relation.destEntityFieldName]
				}

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
			scope.ngModel = ctrls;
		}
	};
});
