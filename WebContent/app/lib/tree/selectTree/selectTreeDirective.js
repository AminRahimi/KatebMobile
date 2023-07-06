angular.module("treeModule").directive('selectTree', function() {
	return {
		restrict : 'EA',
		templateUrl : 'app/lib/tree/selectTree/selectTreeTemplate.html',
		scope : {
			model: "=",
			controlFn: "=",
			multiple: "=" //TODO
		},
		controller : function($scope, $modal) {
			$scope.openTreeModalClick = function() {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/tree/selectTree/selectTreeModalTemplate.html',
					controller : 'selectTreeModalCtrl',
					resolve : {
						list: function() {
							var list = [];
							if ($scope.model) {
								for (var int = 0; int < $scope.model.length; int++)
									list.push({
										uid : $scope.model[int].uid,
										name : $scope.model[int].name
									});
							}
							return list;
						},
						controlFn: function(){
							return $scope.controlFn;
						}
					}
				});
				modalInstance.result.then(function(newModel) {
					$scope.model = newModel;
				});
			}
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});

angular.module("treeModule").controller('selectTreeModalCtrl', function($scope, $modalInstance, list, controlFn, treeSrvc, treeConfigSrvc) {
	controlFn.actionList = [{
		name: 'افزودن به انتخاب‌شده‌ها',
		action: function(node) {
			$scope.selectedNodeList.push({
				uid : node.uid,
				name : node.name
			});
		},
		icon: ''
	}];
	$scope.selectedNodeList = list;
	$scope.selectedNode={};
	$scope.privateData = {
		treeItemRendererAddress: treeConfigSrvc.getRendererAddress()
	}
	$scope.privateFunc = {
		getRoot: function() {
			controlFn.getRoot().then(function(response) {
				$scope.treeData = new treeSrvc.tree(response.data);
			});
		},
		onCollapseClick: function(collapsingTreeData) {
			collapsingTreeData.isCollapsed = !collapsingTreeData.isCollapsed;
			treeSrvc.setNodeList(collapsingTreeData.uid, collapsingTreeData);
		},
		onSelectNode: function(node) {
			if ($scope.selectedNode.uid)
				$scope.selectedNode.prevSelected.selectedClass = false;
			controlFn.getNode(node.uid).then(function(response) {
				var childTree = treeSrvc.tree(response.data.originalElement);
				$scope.selectedNode = childTree;
				$scope.selectedNode.prevSelected = node;
				node[$scope.privateData.childrenKey] = childTree[$scope.privateData.childrenKey];
				node.selectedClass = true;
				node.childCount = $scope.selectedNode[$scope.privateData.childrenKey].length;
			});
		}
	}

	$scope.remove = function(index){
		$scope.selectedNodeList.splice(index,1);
	}

	$scope.ok = function() {
		$modalInstance.close($scope.selectedNodeList);
	}
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	}

	var Run = function(){ 
		treeConfigSrvc.setChildrenKey(controlFn.childrenKey);
		treeConfigSrvc.setFieldsKey(controlFn.fieldsKey);
		$scope.privateData.childrenKey = treeConfigSrvc.getChildrenKey();
		$scope.privateData.fieldsKey = treeConfigSrvc.getFieldsKey();
		$scope.privateData.inTreeAction = controlFn.inTreeAction;
		$scope.privateData.actionList = controlFn.actionList?controlFn.actionList:[];
		$scope.privateFunc.getRoot();
	}

	Run();
});