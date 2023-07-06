angular.module("vtEntitySelector").controller('vtEntitySelector.addEntityModalCtrl', function($scope, vtEntitySelectorSrvc, $modalInstance, entityTypeKey) {

	$scope.newEntityModel = {};

	// TODO:this is bad!!! modal size is lg and is relative
	$scope.isCol7 = true;
	$scope.entityTypeKey = entityTypeKey;
	$scope.Data = {};
	$scope.mode = "add";

	vtEntitySelectorSrvc.getEntityType($scope.entityTypeKey).then(function(response) {
		$scope.entityTypeLabel = response.data.name;
		$scope.jsonSchema = response.data.jsonSchema;
	})

	$scope.schemaFormAddEntityModalApi = {
		onInit : function() {
			// this.setMode("SEARCH");
		}
	}
	var setEntityTypeFieldsAndLabels = function(entityType) {
		$scope.entityType = entityType.originalElement;
		generateNewEntityModel($scope.entityType, $scope.newEntityModel);
	};

	var generateNewEntityModel = function(entityType, newEntityModel) {
		for (entityField in entityType.jsonSchema.properties) {
			var schemaOfFiled = entityType.jsonSchema.properties[entityField];
			if (schemaOfFiled) {
				var widget = schemaOfFiled.widget;
			}
		}

	};

	var isSingleTopicSelector = function(schemaOfFiled) {
		if (schemaOfFiled.widget && schemaOfFiled.type === "topic" && schemaOfFiled.widget === "popupTopicSelector" && !schemaOfFiled.multiple) {
			return true;
		}
		return false;
	};
	var isMultiTopicSelector = function(schemaOfFiled) {
		if (schemaOfFiled.widget && schemaOfFiled.type === "topic" && schemaOfFiled.widget === "popupTopicSelector" && schemaOfFiled.multiple) {
			return true;
		}
		return false;
	};

	vtEntitySelectorSrvc.getEntityType(entityTypeKey).then(function(response) {
		setEntityTypeFieldsAndLabels(response.data);
		// vtEntitySelectorSrvc.cacheEntityType($scope.entityType);
		// getEntityListAndSelectEntity(false, true);

	});

	var addEntity = function(entityTypeKey, formDataModel, callbackFn) {

		var entityModel = $scope.schemaFormAddEntityModalApi.correctModel($scope.jsonSchema, formDataModel);

		vtEntitySelectorSrvc.addEntity(entityTypeKey, entityModel).then(function(response) {
//			$scope.selectedItem = {
//				_uid : response.data._uid,
//				displayString : response.data.displayString
//			};
			$scope.selectedItem = response.data;
			// $scope.selectedItem = response.data;
			callbackFn();
		});
	};

	$scope.onVerifyClick = function() {
		if ($scope.entityType.duplicateCheckEnable == undefined)
			$scope.entityType.duplicateCheckEnable = true;
		if ($scope.entityType.duplicateCheckEnable) {

			$scope.getIntersec();
		} else {
			$scope.onSaveClick();
		}

	};

	$scope.onSaveClick = function() {
		addEntity($scope.entityTypeKey, $scope.newEntityModel, onAfterSave);
	};

	$scope.schemaFormEntityApi = {
		onInit : function() {
		}
	};

	$scope.getIntersec = function() {

		var entityModel = $scope.schemaFormAddEntityModalApi.correctModel($scope.jsonSchema, $scope.newEntityModel);

		vtEntitySelectorSrvc.getIntersectionEntityList(entityModel, $scope.entityTypeKey).then(function(response) {
			$scope.intersecResult = [];
			if (response.data && response.data.length) {
				$scope.intersecResult = response.data[0].items;
				$scope.mode = "intersect";
			} else
				$scope.onSaveClick();
		});
	};

	$scope.onSelectEntity = function(entity) {
		$scope.doSelect = true;
		$scope.selectedEntity = entity;
		$scope.formDataModel = angular.copy(entity);
	};

	$scope.onIntersectClick = function(entity) {
		$scope.selectedItem = {
			_uid : entity._uid,
			displayString : entity.displayString
		};
		onAfterIntersec();
	};

	var onAfterIntersec = function() {
		$modalInstance.close($scope.selectedItem);
	};
	var onAfterSave = function() {
		$modalInstance.close($scope.selectedItem);
	};
	$scope.onBackClick = function() {
		$scope.mode = "add";
	};
	$scope.onCancelClick = function() {
		$modalInstance.dismiss('cancel');
	};

});