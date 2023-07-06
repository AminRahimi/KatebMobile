angular.module("viraTreePagination", []).directive('viraTreePagination', function(viraTreePaginationSrvc) {
	return {
		restrict : 'EA',
		// replace: true,
		templateUrl : 'app/assets/js/directives/viraTreePagination/viraTreePaginationTemplate.html',
		scope : {
			isEditable : "=",
			selectedNode : "=",
			selectedNodes : "=",
			controller : "=",
			isMultiSelectMode : "=",
			isFullTree : "=",
			options:"=?",
			treeData : "=",
			uploadFile : "="
		},
		controller : function($scope, $rootScope, $modal, $q, $timeout) {
			$scope.treeItemRendererAddress = 'app/assets/js/directives/viraTreePagination/tree_item_renderer.html';
			$scope.tempNode;

			$scope.treeData = $scope.treeData || {};

			$scope.setNodeIcon = function(isCollapsed, data) {
				if (data.childCount > 0) {
					if (isCollapsed) {
						return "flaticon-signs";
					} else {
						if (!data.children || data.children.length == 0) {
							return "flaticon-signs";
						} else
							return "flaticon-minus";
					}
				} else {
					return "glyphicon-leaf";
				}
			};

			$scope.controller.loadTree = function(uid) {
				return $scope.controller.getTopicTree(uid).then(function(response) {
					$scope.treeData = response.data;
					$scope.treeData = new viraTreePaginationSrvc.tree($scope.treeData);
					if ($scope.controller.onInit) {
						$scope.controller.onInit();
					}
				});
			}

			// TODO: some times possible we do not want this request send on
			// initial
			var getTopicTree = function(isFullTree, isWithStats, uid) {
				$scope.isWithStats = isWithStats;
				if (isFullTree) {
					return $scope.controller.getFullTree(isWithStats, uid).then(function(response) {
						var treeData = {
							"stats" : null,
							"name" : "UserDefined",
							"children" : [ response.data ]
						};
						$scope.treeData = new viraTreePaginationSrvc.tree(treeData, [], true);
						if ($scope.controller.onInit) {
							$scope.controller.onInit();
						}
					});
				} else {
					return $scope.controller.getTopicTree(uid, 0, 5).then(function(response) {
						$scope.treeData = {
							uid : response.rootUid ||  "root",
							children : response.data,
							hasMore : response.data.hasMore,
							nextStart : response.data.nextStart,
							childCount : response.data.length
						};
						if($scope.treeData.hasMore){
							$scope.treeData.children.push({
								uid: 'more',
								title: 'نمایش موارد بیشتر',
							});
						}
						$scope.treeData = new viraTreePaginationSrvc.tree($scope.treeData);
						if ($scope.controller.onInit) {
							$scope.controller.onInit();
						}
					});

				}
			};

			$scope.controller.loadTopicTree = function(isFullTree, isWithStats, uid) {

				return getTopicTree(isFullTree, isWithStats, uid).then(function() {
					if ($scope.controller.onLoad) {
						$scope.controller.onLoad();
					}
				});
			};

			$scope.onResetSearchClick = function() {
				getTopicTree();
				// $scope.searchingText = "";
			};
			$scope.onSelectNodeClick = function(node, parentNode) {
				if(node.uid === 'more' || node._uid === 'more'){
					$scope.controller.getTopicTree(parentNode.uid || parentNode._uid, parentNode.nextStart, 5).then(function(res) {
						parentNode.children.pop();
						parentNode.children = parentNode.children.concat(res.data);
						parentNode.hasMore = res.data.hasMore;
						parentNode.nextStart = res.data.nextStart;
						parentNode.childCount = parentNode.children.length;
						if(parentNode.hasMore){
							parentNode.children.push({
								uid: 'more',
								title: 'نمایش موارد بیشتر'
							});
						}
						parentNode = new viraTreePaginationSrvc.tree(parentNode);
					});
				} else {
					if (node.hasOwnProperty("hasAccess")) {
						if (node.hasAccess) {
							selectNode(node, $scope.isMultiSelectMode, true);
						}
					} else {
						selectNode(node, $scope.isMultiSelectMode, true);
					}
				}
			};

			var selectNode = function(node, isMulti, isClicked) {
				if (isMulti) {
					addRemoveFromSelectedNodes(node);
					$scope.selectedNode = node;
				} else {
					if ($scope.selectedNode) {
						$scope.selectedNode.selectedClass = false;
					}
					$timeout(function () {
                        $scope.selectedNode = node;
						if ($scope.selectedNode) {
							$scope.selectedNode.selectedClass = true;
						}
					}, 1);

				}
				$timeout(function () {
					if (isClicked) {
						$scope.controller.onSelectNodeClick($scope.selectedNode);
					} else {
						$scope.controller.onSelectNode($scope.selectedNode);
					}
				}, 1);
			};

			var goToNodeLocation = function () {
				$scope.controller.goToNodeLocation();
			};

			var addRemoveFromSelectedNodes = function(node) {
				if (!isInSelectedNodes(node, true)) {
					node.selectedClass = true;
					saveToSelectedNodes(node);
				} else {
					node.selectedClass = false;
				}
			};
			var saveToSelectedNodes = function(node) {
				$scope.selectedNodes.push(node);
			};
			var isInSelectedNodes = function(node, doRemove) {
				if ($scope.selectedNodes.length) {
					for (var i = 0; i < $scope.selectedNodes.length; i++) {
						if (angular.equals(node.uid, $scope.selectedNodes[i].uid)) {
							if (doRemove) {
								$scope.selectedNodes[i].selectedClass = false;
								$scope.selectedNodes.splice(i, 1);
							}
							return true;
						}
					}
				}
				return false;

			};

			$scope.controller.selectNode = function(node, isMulti) {
				selectNode(node, isMulti);
			};

			$scope.onCollapseClick = function(collapsingTreeData) {
				var beforeSelectedNodes;
				if ($scope.isMultiSelectMode) {
					beforeSelectedNodes = $scope.selectedNodes;
				} else {
					beforeSelectedNodes = [];
					if ($scope.selectedNode) {
						beforeSelectedNodes.push($scope.selectedNode);
					}
				}

				return viraTreePaginationSrvc.getChildsAndPushToTree(collapsingTreeData, $scope.controller.getTopicTree, beforeSelectedNodes, (function (_collapsingTreeData) {
					return function () {
						_collapsingTreeData.isCollapsed = !_collapsingTreeData.isCollapsed;
					};
				})(collapsingTreeData));

			};
			$scope.controller.getTree = function() {
				return $scope.treeData;
			};
			$scope.controller.setTree = function(treeData) {
				$scope.treeData = treeData;
			};
			$scope.controller.onSaveNewNodeClick = function(sendingObj, parentNode, callBackFn, secretLevel) {
				var deferred = $q.defer();
				var addingNode = viraTreePaginationSrvc.generateNewNode(sendingObj);

				// var addingNode = {
				// id : "",
				// name : sendingObj.name,
				// childCount : 0,
				// children : []
				// };

				$scope.controller.addNodeFn(sendingObj, parentNode.uid).then(function(response) {
					angular.extend(addingNode, response.data);
					addingNode.uid = response.data.uid;
					addingNode.indexInParent = parentNode.childCount + 1;
					var treeData = new viraTreePaginationSrvc.tree(addingNode);
					treeData = [ treeData ];
					parentNode.childCount++;
					var beforeSelectedNodes;
					if ($scope.isMultiSelectMode) {
						beforeSelectedNodes = $scope.selectedNodes;
					} else {
						beforeSelectedNodes = [];
						if ($scope.selectedNode) {
							beforeSelectedNodes.push($scope.selectedNode);
						}
					}

					viraTreePaginationSrvc.getChildsAndPushToTree(parentNode, $scope.controller.getTopicTree, beforeSelectedNodes, (function(_viraTreePaginationSrvc, _parentNode, _treeData) {
						return function() {
							_viraTreePaginationSrvc.pushNodeToChildOfNode(_parentNode, _treeData);
						};
					})(viraTreePaginationSrvc, parentNode, treeData));

					deferred.resolve();

					callBackFn();
				}, function() {
					deferred.reject()
				});

				// topicSrvc.addNode(name, parentNode.uid, secretLevel).then();

				return deferred.promise;

			};
			$scope.controller.onSaveEditedNodeClick = function(selected, nodeId, name, callBackFn, secretLevel, parentTopic) {
				var deferred = $q.defer();
				topicSrvc.editNode(nodeId, name, secretLevel, parentTopic).then(function() {
					selected.name = name;
					selected.secretLevel = secretLevel;
					deferred.resolve();
					callBackFn();
				}, function(a) {
					deferred.reject(a);
				});
				return deferred.promise;
			};

			$scope.controller.onNodeArrayClick = function(searchingNodes, isJustFind) {
				if (!angular.isString($scope.treeData.uid) && $scope.treeData.children.length == 1) {
					viraTreePaginationSrvc.findNodesExpandAndGetChildsAndSelect($scope.treeData.children[0], searchingNodes, selectNode, $scope.controller.getTopicTreeChildsFn);
				} else {
					viraTreePaginationSrvc.findNodesExpandAndGetChildsAndSelect($scope.treeData, searchingNodes, selectNode, $scope.controller.getTopicTreeChildsFn, isJustFind, goToNodeLocation);
				}

				// findNodesExpandAndGetChildsAndSelect($scope.treeData,
				// searchingNodes, selectNode);
			};
			$scope.controller.onDeleteNodeClick = function() {
				// TODO:if is multi select mode must delete all selecteNodes
				var selectedNode = $scope.selectedNode;
				var deferred = $q.defer();

				return $scope.controller.deleteNodeFn(selectedNode.uid).then(function() {
				//return topicSrvc.deleteNode(selectedNode.uid).then(function() {
					var node = viraTreePaginationSrvc.removeNodeFromTree($scope.treeData, selectedNode);
					if (node.name == "UserDefined") {
						node = node.children[0];
					}

					$scope.controller.selectNode(node);
					deferred.resolve();

				});
				return deferred.promise;
			};
			/*
			 * $scope.saveEditedNode = function() {
			 *
			 * topicSrvc.editNode($scope.tempNode.uid,
			 * $scope.tempNode.name).then(function() { getTopicTree(); });
			 * $scope.setMode('view'); };
			 */

			$scope.onNewChildClick = function(node) {
				var modalInstance = $modal.open({
					templateUrl : 'app/assets/js/tree/partials/treeNodeModal.html',
					controller : 'treeNodeModalCtrl',
					resolve : {
						// TODO:if is multi select mode ?!
						selectedNode : function() {
							return $scope.selectedNode;
						},
						mode : function() {
							return "ADD";
						},
						onSaveNewNodeClick : function() {
							return $scope.controller.onSaveNewNodeClick;
						}
					}
				// size : size
				});
				modalInstance.result.then(function(selectedItem) {
				}, function() {
				});
			};

			$scope.onChangeChildNameClick = function(node) {
				var modalInstance = $modal.open({
					templateUrl : 'app/modules/pollManagement/directives/tree/partials/treeNodeModal.html',
					controller : 'treeNodeModalCtrl',
					resolve : {
						// TODO:if is multi select mode ?!
						selectedNode : function() {
							return $scope.selectedNode;
						},
						mode : function() {
							return "EDIT_NAME";
						},
						onSaveNewNodeClick : function() {
							return undefined;
						}
					}
				// size : size

				});

				modalInstance.result.then(function(selectedItem) {
				}, function() {
				});
			};

			$scope.onDeleteChildClick = function(node) {
				var modalInstance = $modal.open({
					templateUrl : 'app/modules/pollManagement/directives/tree/partials/treeNodeModal.html',
					controller : 'treeNodeModalCtrl',
					resolve : {
						// TODO:if is multi select mode ?!
						selectedNode : function() {
							return $scope.selectedNode;
						},
						mode : function() {
							return "Delete";
						},
						onSaveNewNodeClick : function() {
							return undefined;
						}
					}
				// size : size

				});

				modalInstance.result.then(function(DeleteNode) {
					$scope.controller.onDeleteNodeClick();
				}, function() {

				});
			};
			$scope.onChangeParentClick = function(node) {
				var selectedNode = $scope.selectedNode;
				var modalInstance = $modal.open({
					templateUrl : 'app/modules/pollManagement/directives/tree/partials/treeModal.html',
					controller : 'treeModalCtrl',
					resolve : {
						// TODO:if is multi select mode ?!
						selectedNode : function() {
							return selectedNode;
						},
						selectedNodePath : function() {
							return $scope.controller.findPathOfSelectedNode();
						},
						copyMode : function() {
							return false;
						}
					}
				// size : size

				});

				modalInstance.result.then(function(newParentNode) {
					topicSrvc.setNewParentForNode(selectedNode.uid, selectedNode.name, newParentNode.uid).then(function() {
						viraTreePaginationSrvc.removeNodeFromTree($scope.treeData, selectedNode);
						selectedNode.indexInParent = newParentNode.childCount + 51841;
						viraTreePaginationSrvc.findNodeAndPushChildToIt($scope.treeData, newParentNode.uid, [ selectedNode ], true);
					});
				}, function() {
				});
			};

			$scope.onCopyClick = function(node) {
				var selectedNode = $scope.selectedNode;
				var modalInstance = $modal.open({
					templateUrl : 'app/modules/pollManagement/directives/tree/partials/treeModal.html',
					controller : 'treeModalCtrl',
					resolve : {
						// TODO:if is multi select mode ?!
						selectedNode : function() {
							return selectedNode;
						},
						selectedNodePath : function() {
							return $scope.controller.findPathOfSelectedNode();
						},
						copyMode : function() {
							return true;
						}
					}
				});

				modalInstance.result.then(function(newParentNode) {
					topicSrvc.copyNode(selectedNode.uid, newParentNode.uid).then(function() {
						getTopicTree();
					});
				}, function() {
				});
			};

			$scope.onChangeIndexClick = function(node, factor) {
				// topicSrvc.changeIndexOfNode

				var parentNode = viraTreePaginationSrvc.findParentOfNode($scope.treeData, node.uid);
				if (factor === 1) {
					if (node.indexInParent != _.max(parentNode.children, function(node) {
						return node.indexInParent;
					}).indexInParent) {

						var indexOfNextNode = {
							inparent : _.max(parentNode.children, function(node) {
								return node.indexInParent;
							}).indexInParent,
							self : 0
						}
						_.find(parentNode.children, function(node, index) {
							if (node.indexInParent == indexOfNextNode.inparent) {
								indexOfNextNode.self = index;
								return true;
							} else {
								return false;
							}
						});

						angular.forEach(parentNode.children, function(parentChildNode, index) {

							if (parentChildNode.indexInParent > node.indexInParent && parentChildNode.indexInParent < indexOfNextNode.inparent) {
								indexOfNextNode.inparent = parentChildNode.indexInParent;
								indexOfNextNode.self = index;
							}
						});
						topicSrvc.changeIndexOfNode(node.uid, indexOfNextNode.inparent).then(function() {
							/*
							 * _.find(parentNode.children,
							 * function(parentChildNode) { if
							 * (parentChildNode.indexInParent ===
							 * (node.indexInParent + 1)) {
							 * parentChildNode.indexInParent--; return
							 * parentChildNode; } });
							 *
							 * node.indexInParent++;
							 */

							node.indexInParent = indexOfNextNode.inparent;
							parentNode.children[indexOfNextNode.self].indexInParent--;

						});

					}
				} else if (factor === -1) {
					if (node.indexInParent != 1) {
						var indexOfPrevNode = {
							inparent : 0,
							self : 0
						}
						angular.forEach(parentNode.children, function(parentChildNode, index) {
							if (parentChildNode.indexInParent < node.indexInParent && parentChildNode.indexInParent > indexOfPrevNode.inparent) {
								indexOfPrevNode.inparent = parentChildNode.indexInParent;
								indexOfPrevNode.self = index;
							}
						});
						topicSrvc.changeIndexOfNode(node.uid, indexOfPrevNode.inparent).then(function() {
							// _.find(parentNode.children,
							// function(parentChildNode) {
							// if (parentChildNode.indexInParent ===
							// (node.indexInParent - 1)) {
							// parentChildNode.indexInParent++;
							// return parentChildNode;
							// }
							// });
							// node.indexInParent--;

							node.indexInParent = indexOfPrevNode.inparent;
							parentNode.children[indexOfPrevNode.self].indexInParent++;

						});
					}
				}
			};

			$scope.controller.getTreeAndSelectNode = function(nodeUid, nodes, isMulti) {
				var deferred = $q.defer();
				$scope.controller.getTopicTree(nodeUid).then(function(response) {
					var treeData = response.data;
					$scope.treeData = new viraTreePaginationSrvc.tree(treeData, nodes);
					if (isMulti && nodes.length) {
						for (var i = 0; i < nodes.length; i++) {
							$scope.controller.findeNodeAndSelectThat($scope.treeData, nodes[i]);
						}
					} else {
						$scope.controller.findeNodeAndSelectThat($scope.treeData, nodeUid);
					}
					deferred.resolve();
				});
				return deferred.promise;
			};

			var findPathOfSelectedNode = function(tree, uid, path) {
				if (tree.name != "UserDefined")
					path.push(tree);
				if (tree.uid == uid)
					return true;
				for (var i = 0; i < tree.children.length; i++) {
					if (findPathOfSelectedNode(tree.children[i], uid, path)) {
						return true;
					}
				}
				path.pop();
				return false;
			}
			$scope.controller.findPathOfSelectedNode = function() {
				var path = [];
				findPathOfSelectedNode($scope.controller.getTree(), $scope.selectedNode.uid, path);
				return path;
			}

			// FIXME:fix this for multi select mode
			$scope.controller.findeNodeAndSelectThat = function(node, serachingNodeId) {
				return _.find(node.children, function(_node) {
					if (_node.uid == serachingNodeId) {
						$scope.selectedNode = _node;
						$scope.selectedNode.selectedClass = true;
					} else {
						$scope.controller.findeNodeAndSelectThat(_node, serachingNodeId);
					}
				});
			};

			if (!$scope.treeData || !Object.keys($scope.treeData).length) {
				getTopicTree($scope.isFullTree);
			}
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});
