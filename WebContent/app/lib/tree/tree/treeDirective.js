angular.module("treeModule").directive('tree', function($compile, $http, toaster,$modal) {
	return {
		restrict : 'EA',
		templateUrl : 'app/lib/tree/tree/treeTemplate.html',
		scope : {
			controlFn: "=",
			func: "=",
			data: "=",
			//for dependency injection such as button names, user this object
			//notice that default value for each dependency needed
			api: "="
		},
		controller : function($scope, $q, treeSrvc, treeConfigSrvc) {
			//api could be null so with this line we prevent from null pointer exception
			if(!$scope.api)$scope.api={};
			if(!$scope.data)$scope.data={};
			
			
			var nodeList = {};

			$scope.privateData = {
				treeItemRendererAddress: treeConfigSrvc.getRendererAddress()
			}
			
			$scope.controlFn.onChangeParentClick = function(selectedNode) {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/tree/treeModal.html',
					controller : 'treeModalCtrl',
					resolve : {
						treeControllerObj:function(){
//							return $scope.controlFn.modalTreeControllerObj
							return {
								inTreeAction : false,
								actionList : [],
								childrenKey : $scope.controlFn.childrenKey,
								fieldsKey : $scope.controlFn.fieldsKey,
								getRoot : $scope.controlFn.getRoot,
								getNode :  $scope.controlFn.getNode,
								getChildren :  $scope.controlFn.getChildren
							}
							
						}
					}

				});

				modalInstance.result.then(function(newParentNode) {
					$scope.controlFn.moveNode(selectedNode.uid, selectedNode.name, newParentNode.uid).then(function() {
						treeSrvc.removeNodeFromTree($scope.treeData, selectedNode);
						//selectedNode.indexInParent = newParentNode.noOfChild + 51841;
						treeSrvc.findNodeAndPushChildToIt(nodeList,$scope.treeData, newParentNode.uid, [ $scope.data.selectedNode.prevSelected ]);
					} );
				}, function() {
				});
			}
			

			$scope.privateFunc = {
				getRoot : function() {
					$scope.controlFn.getRoot().then(function(response) {
						var root = {uid: 'root'};
						root[$scope.controlFn.childrenKey] = response.data
						$scope.treeData = new treeSrvc.tree(nodeList,root);
					});
				},
				onCollapseClick : function(collapsingTreeData) {
					$scope.controlFn.getChildren(collapsingTreeData.uid).then(function(response){
						collapsingTreeData.isCollapsed = !collapsingTreeData.isCollapsed;
						
						
						collapsingTreeData[$scope.privateData.childrenKey] = (new treeSrvc.tree(nodeList,response.data))[$scope.privateData.childrenKey];
						treeSrvc.setNodeList(nodeList,collapsingTreeData.uid, collapsingTreeData);
					});
				},
				onSelectNode : function(node) {
					if ($scope.data.selectedNode.uid)
						$scope.data.selectedNode.prevSelected.selectedClass = false;
					$scope.controlFn.getNode(node.uid).then(function(response) {
						var childTree = new treeSrvc.tree(nodeList,response.data.originalElement);
						$scope.data.selectedNode = childTree;
						$scope.data.selectedNode.prevSelected = node;
//						node[$scope.privateData.childrenKey] = childTree[$scope.privateData.childrenKey];
						node.selectedClass = true;
//						node.childCount = $scope.data.selectedNode[$scope.privateData.childrenKey].length;

						$scope.controlFn.onSelectNode($scope.data.selectedNode);
					});
				}
			}

			$scope.func = {
				beforAddRoot : function() {
					$scope.addType = 'root';
				},
				beforAddNode : function() {
					$scope.addType = 'child';
				},
				afterSaveNode : function(node) {
					var treeData = new treeSrvc.tree(nodeList,node);
					treeData = [ treeData ];
					if ($scope.addType == 'child') {
						$scope.data.selectedNode.prevSelected.childCount++;
						//$scope.data.selectedNode.childCount++;
						treeSrvc.pushNodeToChildOfNode($scope.data.selectedNode.prevSelected, treeData);
						//treeSrvc.pushNodeToChildOfNode($scope.data.selectedNode, treeData);
					} else if ($scope.addType == 'root') {
						$scope.treeData.childCount++;
						treeSrvc.pushNodeToChildOfNode($scope.treeData, treeData);
					}
				},
				prepareUpdateNode : function(originalData) {
					var temp = {};
					for (var i = 0; i < $scope.privateData.fieldsKey.length; i++) {
						if($scope.privateData.fieldsKey[i].original){
							temp[$scope.privateData.fieldsKey[i].key] = originalData[$scope.privateData.fieldsKey[i].key];
						}
					}
					return temp;
				},
				afterUpdateNode : function() {
					$scope.data.selectedNode.prevSelected.name = $scope.data.selectedNode.name;
					$scope.data.selectedNode.prevSelected.title = $scope.data.selectedNode.name;
					//TODO check calling onSelectNode() is correct and then remove if
					if($scope.data.selectedNode && $scope.data.selectedNode.uid)
						$scope.privateFunc.onSelectNode($scope.data.selectedNode);
				},
				afterDeleteNode : function() {
					treeSrvc.removeNodeFromTree($scope.treeData, $scope.data.selectedNode.prevSelected);
				}
			}

			// init dependency injection
			var Run = function(){ 
				treeConfigSrvc.setChildrenKey($scope.controlFn.childrenKey);
				treeConfigSrvc.setFieldsKey($scope.controlFn.fieldsKey);
				$scope.privateData.childrenKey = treeConfigSrvc.getChildrenKey();
				$scope.privateData.fieldsKey = treeConfigSrvc.getFieldsKey();
				$scope.privateData.inTreeAction = $scope.controlFn.inTreeAction;
				$scope.privateData.actionList = $scope.controlFn.actionList?$scope.controlFn.actionList:[];
				$scope.privateFunc.getRoot();
			}

			Run();
			
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});