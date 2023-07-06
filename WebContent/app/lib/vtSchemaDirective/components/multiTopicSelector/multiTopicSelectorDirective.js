angular.module("multiTopicSelector", []).directive('multiTopicSelector', function() {
	return {
		restrict : 'EAC',
		// replace: true,
		require: 'ngModel',
		templateUrl : 'app/lib/vtSchemaDirective2/multiTopicSelector/multiTopicSelectorTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			isTopicRootVisible : '=',
			api :"="
		},
		controller : function($scope, entitySrvc, $modal) {

			$scope.openTopicMultiSelectorModal = function(size) {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/multiTopicSelector/multiTopicSelectorModalTemplate.html',
					controller : 'multiTopicSelectorModalCtrl',
					resolve : {
						model : function() {
							return $scope.model;
						},
						isTopicRootVisible : function() {
							return $scope.isTopicRootVisible;
						}
					},
					size : size
				});

				modalInstance.result.then(function(selectedTopics) {
					$scope.ngModel.$setDirty();
					$scope.selectedTopics = selectedTopics;
					if ($scope.selectedTopics.length) {
						$scope.model = [];
						for ( var i = 0; i < $scope.selectedTopics.length; i++) {
							$scope.selectedTopics[i].display = $scope.selectedTopics[i]._uid;
							$scope.model.push($scope.selectedTopics[i]);
						}
					}
					else{
						$scope.model=[];
					}

				}, function() {
				});
			};

			$scope.openFullTopic = function(topic) {
				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/multiTopicSelector/topicModalTemplate.html',
					controller : 'topicModalCtrl',
					resolve : {
						topic : function() {
							return $scope.orginal;
						}
					},
					size : 'md'
				});
			};
			$scope.onRemoveTopicClick=function(topic){

				$scope.ngModel.$setDirty();
				angular.forEach($scope.model, function(key,index){
					if(topic._uid === key._uid){
						$scope.model.splice(index,1);
					}
				 });	
				
			};
		},
		link : function(scope, element, attrs, ctrls) {
			scope.ngModel = ctrls;
			scope.$watch('model', function(newVal, oldVal) {
				scope.orginal = angular.copy(scope.model);
				if (scope.model) {
					for ( var index = 0; index < scope.model.length; index++) {
						if(angular.isArray(scope.model[index]._displayString) && scope.model[index]._displayString.length > 3){
								scope.model[index]._displayString.splice(0, scope.model[index]._displayString.length - 4);
								scope.model[index]._displayString[0] = '...';
						}
					}
				}
			});
		}
	};
});

angular.module("multiTopicSelector").controller('multiTopicSelectorModalCtrl', function($scope, $modalInstance, topicSrvc, model, hotkeys,isTopicRootVisible, $q,viraTreeSrvc) {
	
	$scope.viraTreeDirective = {
		isMultiSelectMode : true,
		controller : {
			getTopicTree:function(nodeUID,showDeleted){
				return topicSrvc.getTopicTree(nodeUID,showDeleted)
			},
			getFullTree:function(isWithStats, uid){
				return topicSrvc.getFullTree(isWithStats, uid);
			},
			getChildrenFn:function(nodeUID){
				return topicSrvc.getTopicTreeChilds(nodeUID);
			},
			onSelectNodeClick : function(selectedNode) {
			},
			onInit : function() {
				

				/*
				 * if ($scope.tree.children.length) {
				 * this.selectNode($scope.tree.children[0]);
				 * this.onSelectNodeClick($scope.tree.children[0]); }
				 */
				getGoodTreeAndSelecGoodTopic().then(function(){
					if(isTopicRootVisible){
						var root = $scope.viraTreeDirective.controller.getTree();
						if (root.isRoot) {
							root.name = "*";
							$scope.viraTreeDirective.controller.setTree({
								children : [ root ]
							});
							$scope.tree = $scope.viraTreeDirective.controller.getTree();
						}
					}
				});
				
				

			}
		},
		selectedNode : {},
		selectedNodes : angular.copy(model) || []
	};

	$scope.searchingFor = {
		query : ""
	};
	/*
	 * $scope.recentlyUsedTopics = [];
	 * 
	 * topicSrvc.getRecentlyUsedTopics().then(function(response) {
	 * $scope.recentlyUsedTopics = response.data; });
	 */
	var getGoodTreeAndSelecGoodTopic = function() {
		var deferred = $q.defer();
		if (model && model.length) {
			 $scope.viraTreeDirective.controller.getTreeAndSelectNode(null, model, true).then(function(){
				  deferred.resolve();
			 });

		} else {
//			topicSrvc.getCurrentTopicId().then(function(response) {
//				var currentTopic = response.data;
//				if (currentTopic._uid) {
					$scope.viraTreeDirective.controller.getTreeAndSelectNode(null, [  ],true).then(function(){
						  deferred.resolve();
					 });
//				}
//			});
		}
		return deferred.promise;
	};
	$scope.viraTreeDirective.controller.onSelectNode = function(selectedNode) {
		$scope.selectedNode = selectedNode;
		if ($scope.selectedNode) {
			$scope.setMode('view');
			$scope.selectedNode.parentList = [];
			this.findPath(this.getTree(), selectedNode._uid, $scope.selectedNode.parentList);
			$scope.selectedNode.parentList.shift()
		} else {
			$scope.setMode('none');
		}

	};
	$scope.setMode = function(mode) {
		if (mode.toLowerCase() == "view") {
			$scope.viewNodeMode = true;
			$scope.editNodeMode = $scope.addNodeMode = $scope.noneMode = false;
		} else if (mode.toLowerCase() == "edit") {
			$scope.editNodeMode = true;
			$scope.viewNodeMode = $scope.addNodeMode = $scope.noneMode = false;
		} else if (mode.toLowerCase() == "add") {

			$scope.addNodeMode = true;
			$scope.viewNodeMode = $scope.editNodeMode = $scope.noneMode = false;
		} else if (mode === "none") {
			$scope.noneMode = true;
		}
	};
	$scope.viraTreeDirective.controller.findPath = function(tree, uid, path) {
		if (tree.name != "UserDefined")
			path.push(tree);
		if (tree._uid == uid)
			return true;
		for (var i = 0; i < tree.children.length; i++) {
			if (this.findPath(tree.children[i], uid, path)) {
				return true;
			}
		}
		path.pop();
		return false;
	};
	$scope.onBreadcrumbSearchResultClick = function(nodeArray) {
		$scope.viraTreeDirective.controller.onNodeArrayClick(angular.copy(nodeArray));
	var duplicate=false;
		angular.forEach($scope.viraTreeDirective.selectedNodes,function(node,index){
			if(node['_uid'] == nodeArray[nodeArray.length-1]._uid){
				duplicate=true;
			}
				
		});
		if(!duplicate)$scope.viraTreeDirective.selectedNodes.push(nodeArray[nodeArray.length-1]);
		//var tempTree=nodeArray[nodeArray.length-1];
		//$scope.viraTreeDirective.controller.onSelectNode(tempTree);
		/*
		 * topicSrvc.findNodesExpandAndGetChildsAndSelect($scope.treeData,
		 * angular.copy(nodeArray), $scope.selectNode);
		 */
	};
	$scope.onResetSearchClick=function(){
		$scope.searchMode=false;
		$scope.searchingFor.query=null;
		$scope.searchResults=null;
	};
	$scope.onSearchClick = function() {
		$scope.searchMode=true;
		topicSrvc.search($scope.searchingFor.query).then(function(response) {
			$scope.searchResults = [];
			var searchResultList = response.data;
			_.each(searchResultList, function(resultTree) {
				var searchResultArray = [];
				while (resultTree.children.length) {
					searchResultArray.push(resultTree.children[0]);
					resultTree = resultTree.children[0];
				}
				$scope.searchResults.push(angular.copy(searchResultArray));
				
			});

		});
	};

	$scope.ok = function() {
		$modalInstance.close(angular.copy($scope.viraTreeDirective.selectedNodes));
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
});
angular.module("multiTopicSelector").controller('topicModalCtrl', function($scope, $modalInstance, topicSrvc, topic) {
	$scope.topics = topic;
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});