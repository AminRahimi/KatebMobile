angular.module("topicSelector", ['restangular']).config(function(RestangularProvider){
	RestangularProvider.setBaseUrl("api");
	RestangularProvider.setFullResponse(true);
}).factory('topicSelector.topicSrvc', [ 'Restangular', '$q', function( Restangular, $q) {
	var topicSrvc = {};
	var currentTopicDefer;
	topicSrvc = {
		getCurrentTopicId : function() {
			if (currentTopicDefer && !currentTopicDefer.isResolved) {
				return currentTopicDefer.promise;
			} else {
				currentTopicDefer = $q.defer();
				currentTopicDefer.isResolved = false;
				Restangular.one('user/current_topic').get().then(function(response) {
					currentTopicDefer.isResolved = true;
					currentTopicDefer.resolve(response);
				});
				return currentTopicDefer.promise;
			}
		}

	};
	return topicSrvc;

} ])

.directive('topicSelector', function() {
	return {
		restrict : 'EAC',
		// replace : true,
		require: 'ngModel',
		templateUrl : 'app/lib/vtSchemaDirective2/topicSelector/topicSelectorTemplate.html',
		// require : [ '?^ngModel' ],
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			api :"="
		},
		controller : function($scope, entitySrvc, $modal) {
			$scope.openTopicSelectorModal = function(size) {

				var modalInstance = $modal.open({
					templateUrl : 'app/lib/vtSchemaDirective2/topicSelector/topicSelectorModalTemplate.html',
					controller : 'topicSelectorModalCtrl',
					size : size,
					resolve : {
						model : function() {
							return $scope.model;
						}
					}
				});

				modalInstance.result.then(function(selectedTopic) {
					$scope.ngModel.$setDirty();
					$scope.selectedTopic = selectedTopic;
					$scope.model = $scope.selectedTopic;
				}, function() {
				});
			};

		},
		link : function(scope, element, attrs, ctrls) {
			scope.ngModel = ctrls;
		}
	};
});

angular.module("topicSelector").controller("topicSelectorModalCtrl", function($scope, $modalInstance, topicSrvc, model, hotkeys, $modal) {
	$scope.viraTreeDirective = {
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
			onSelectNode : function(selectedNode) {

			},
			onInit : function() {
				getGoodTreeAndSelecGoodTopic();
			}
		},
		selectedNode : {},
		selectedNodes : []
	};

	hotkeys.bindTo($scope).add({
		combo : "esc",
		description : "cancel",
		allowIn : [ 'INPUT', 'SELECT', 'TEXTAREA' ],
		callback : function(event, hotkey) {
			event.preventDefault();
		}
	});
	/*
	 * $scope.recentlyUsedTopics = [];
	 * 
	 * topicSrvc.getRecentlyUsedTopics().then(function(response) {
	 * $scope.recentlyUsedTopics = response.data; });
	 */
	$scope.searchingFor = {
		query : ""
	};

	var getGoodTreeAndSelecGoodTopic = function() {
		if (model && model._uid) {
			$scope.viraTreeDirective.controller.getTreeAndSelectNode(model._uid, [ model ]);
			// getTreeAndSelectNode(model._uid);
		} else {
			topicSrvc.getCurrentTopicId().then(function(response) {
				if (response.data && response.data._uid) {
					var currentTopicUid = response.data._uid;
					$scope.viraTreeDirective.controller.getTreeAndSelectNode(currentTopicUid);
					// getTreeAndSelectNode(response.data);
				} else {
					$scope.viraTreeDirective.controller.getTreeAndSelectNode();
				}
			});
		}
	};

	$scope.onBreadcrumbSearchResultClick = function(nodeArray) {
		$scope.viraTreeDirective.controller.onNodeArrayClick(angular.copy(nodeArray));
		if ($scope.viraTreeDirective.selectedNode['_uid'] != nodeArray[nodeArray.length - 1]._uid) {
			$scope.viraTreeDirective.selectedNode = nodeArray[nodeArray.length - 1];
			// $scope.viraTreeDirective.selectedNode =
			// nodeArray[nodeArray.length - 1];
		}
	};

	$scope.onSearchClick = function() {
		topicSrvc.search($scope.searchingFor.query).then(function(response) {
			/*
			 * if (response.data.length) { var treeData = { children :
			 * response.data }; $scope.treeData = new
			 * viraTreeSrvc.tree(treeData); }
			 */

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

	$scope.onRecentlyUsedClick = function(node) {
		$scope.viraTreeDirective.controller.selectNode(node);
	};

	$scope.ok = function() {
		$modalInstance.close($scope.viraTreeDirective.selectedNode);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});