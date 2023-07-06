angular.module('tagModule').controller('tagCtrl', function($scope, $state, tagSrvc, viraTreeSrvc, $modal) {
	$scope.treeData = {
		selectedNode: {},
	}
	$scope.Data = {
		mode : 'view',
		originaltag : {},
		newtag : {},
		validationClicked : false,
		//////////
		// Tree //
		//////////
		tmp : {
			selected : {}
		},
		showSearchResult: false
		//////////////
		// END-Tree //
		//////////////
	}

	$scope.Func = {
		onAddtagClick : function(nodeType) {
			if (nodeType == 'root'){
				$scope.Data.tmp.selected = $scope.Func.correctForAddRoot($scope.Data.selected);
				$scope.Data.newtag.parent = null;
			}
			else if (nodeType == 'child'){
				$scope.Data.tmp.selected = $scope.Func.correctForAdd($scope.Data.selected);
				$scope.Data.newtag.parent = {
					uid : $scope.treeData.selectedNode.uid
				};
			}
			$scope.Data.mode = 'add';
			$scope.Func.reset();
		},
		onEdittagClick : function() {
			$scope.Data.mode = 'edit';
		},
		onSavetagClick : function() {
			if ($scope.tagForm.$valid) {
				var sendingData = angular.copy($scope.Data.newtag);
				return $scope.Controller.viraTree.onSaveNewNodeClick(sendingData, (sendingData.parent && sendingData.parent.uid!= "root-geo")  ? $scope.Data.selectedNode : $scope.Controller.viraTree.getTree(), function() {
					$scope.Data.validationClicked = false;
					$scope.Func.resetForm();
				}).then(function(response) {

				}, function() {
				});
			} else {
				$scope.Data.validationClicked = true;
			}
		},
		onUpdatetagClick : function() {
			if ($scope.tagForm.$valid) {
				var sendingData = angular.copy($scope.treeData.selectedNode);
				if (sendingData.currentUser && sendingData.currentUser.uid == null) {
					sendingData.currentUser = null;
				}
				delete sendingData.originalElement;
				tagSrvc.updatetag(sendingData).then(function(response) {
					$scope.Func.updateSelectedNode(sendingData);
					$scope.Func.select($scope.Data.selectedNode.uid).then(function() {
						$scope.Data.validationClicked = false;
						$scope.Func.resetForm();
					});
				});
			} else {
				$scope.Data.validationClicked = true;
			}
		},
		onDeletetagClick : function() {
			tagSrvc.deletetag($scope.treeData.selectedNode.uid).then(function(response) {
				$scope.treeFunc.afterDeleteNode();
				$scope.Func.resetForm();
				$scope.Func.reset();
			});
		},
        onChangeParentClick : function() {
			var selectedNode = $scope.Data.selectedNode;
			var modalInstance = $modal.open({
				templateUrl : 'app/assets/js/directives/viraTree/partials/treeModal.html',
				controller : 'treeModalCtrl',
				resolve : {
					// TODO:if is multi select mode ?!
					selectedNode : function() {
						return selectedNode;
					},
					selectedNodePath : function() {
						return $scope.Func.findPathOfSelectedNode();
					},
					copyMode : function(){
						return false;
					},
					getTopicTree: function () {
						return tagSrvc.gettagChildren
					},
					getFullTree: function () {
						return tagSrvc.getFullTree
					},
					getChildrenFn: function () {
						return tagSrvc.getChildren
					}
				}
			});

			modalInstance.result.then(function(newParentNode) {
				tagSrvc.changeParent({
					childUid:$scope.Data.selectedNode.uid,
					parentUid:newParentNode.uid,
				}).then(function() {
					viraTreeSrvc.removeNodeFromTree($scope.treeDataForTopicManagement.data, selectedNode);
					selectedNode.indexInParent = newParentNode.noOfChild + 51841;
					viraTreeSrvc.findNodeAndPushChildToIt($scope.treeDataForTopicManagement.data, newParentNode.uid, [ selectedNode ], true);
				});
			}, function() {
			});
        },
		onCancelClick : function() {
			$scope.treeData.selectedNode = $scope.Data.originaltag;
			$scope.Func.resetForm();
		},

		onChangeSearchModeClick : function(mode) {
			$scope.Data.searchMode = mode;
		},
		onSearchClick : function() {
			$scope.Func.onChangeSearchModeClick('quick');
			$scope.Controller.tagListController.searchQuery = $scope.Controller.tagSearchController.searchQuery;
			$scope.Controller.tagListController.searchableFieldInfo = $scope.Controller.tagSearchController.searchableFieldInfo;
		},
		onExitSearchModeClick : function() {
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.tagSearchController.searchQuery = {};
		},

		reset : function() {
			$scope.Data.newtag.name = "";
			$scope.Data.parent = {};
		},
		resetForm : function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		},
		//////////
		// Tree //
		//////////
		getGeoRegionRootTree : function(nodeUid, start, len) {
			return tagSrvc.gettagChildren(nodeUid, start, len).then(function(response) {
				return {
					rootUid: "root",
					data : response.data.originalElement
				}
			});
		},
		getGeoRegionChildrenTree : function(nodeUID) {
			return tagSrvc.getChildren(nodeUID);
		},
		remove : function(uid) {
			return tagSrvc.deletetag(uid);
		},
		select : function(uid) {
			return tagSrvc.gettag(uid).then(function (response) {
				$scope.Data.selected = response.data;
				$scope.treeData.selectedNode = response.data;
				$scope.treeData.selectedNode.typeKey = response.data.typeKey;
				$scope.Data.puaHistory = _.sortBy($scope.treeData.selectedNode.positionUserAssignments, 'startTime');
				$scope.Data.mode = 'view';
			});
		},
		findPathOfSelectedNode: function() {
			var path = [];
			findPathOfSelectedNode($scope.Func.getTree(), $scope.Data.selectedNode.uid, path);
			return path;
		},
		getTree: function() {
			return $scope.treeData;
		},
		updateSelectedNode : function(positionObj) {
			$scope.Data.selectedNode.title = positionObj.name;
		},
		searchActions : {
			onBreadcrumbSearchResultClick : function(nodeArray) {
				$scope.Controller.viraTree.onNodeArrayClick(angular.copy(nodeArray));
				$scope.Data.tmp.selected = $scope.Func.correctForEdit($scope.Data.selected, $scope.Data.geoRegionTypeList);
                $scope.Func.select(nodeArray[nodeArray.length - 1].uid);
			},
			onSearchClick : function() {
				var searchItem = {
					restrictions: [{
						field: 'name',
						value: $scope.Controller.tagSearchController.searchQuery.name,
						type: 'like'
					}]
				};
				return tagSrvc.searchOnTree(searchItem).then(function (response) {
                    $scope.Data.searchResults = [];
                    if (response.data.totalSize > 0) {
                        var searchResultList = response.data;
                        _.each(searchResultList, function (resultTree) {
                            if (resultTree) {
                                var searchResultArray = [];
                                searchResultArray.push(resultTree);
                                while (resultTree.children && resultTree.children.length) {
                                    searchResultArray.push(resultTree.children[0]);
                                    resultTree = resultTree.children[0];
                                }
                                $scope.Data.searchResults.push(angular.copy(searchResultArray));
                            }
                        });
                        $scope.Data.showSearchResult = true;
                    } else {
                        $scope.Data.showSearchResult = false;
                    }
				});
			},
			onExitSearchModeClick : function() {
				$scope.Data.showSearchResult = false;
			}
		},
		correctForEdit : function(_selectedObj, geoRegionTypeList) {
			var selectedObj = angular.copy(_selectedObj);
			if (selectedObj.type) {
				var foundGeoRegionType = _.find(geoRegionTypeList, function(geoRegionType) {
					return geoRegionType.uid == selectedObj.type.uid
				});
				if (foundGeoRegionType) {
					selectedObj.type = foundGeoRegionType;
				}
			}
			return selectedObj
		},
		correctForAddRoot : function(_selectedObj) {
			return {
				features : angular.copy($scope.Data.featureList),
				weight:1
			}
		},
		correctForAdd : function(_selectedObj) {
			return {
				parent : _selectedObj ? {
					uid : _selectedObj.uid,
					title : _selectedObj.title
				} : undefined,
				features : angular.copy($scope.Data.featureList),
				weight:1
			}
		},
		//////////////
		// END-Tree //
		//////////////
	}

	$scope.Controller = {
		tagSearchController : {
			advanced : false,
			searchableFieldInfo : [ {
				key : "name",
				type : "string",
				label : "نام"
			}],
			onSearchClick : $scope.Func.searchActions.onSearchClick,
			onExitSearchModeClick : $scope.Func.searchActions.onExitSearchModeClick
		},
		//////////
		// Tree //
		//////////
		viraTree : {
			getTopicTree : function(nodeUID, start, len) {
				if (!nodeUID) {
					return $scope.Func.getGeoRegionRootTree(null, start, len);
				} else {
					return $scope.Func.getGeoRegionRootTree(nodeUID, start, len);
				}
			},
			addNodeFn : function(sendingObj, parentUid) {
				return tagSrvc.savetag(sendingObj, parentUid);
				// return $scope.Func.addPosition(sendingObj, parentUid)

				// return {
				// then : function(cb) {
				// cb({});
				// }
				// }
			},
			getTopicTreeChildsFn : function(nodeUid) {
				return $scope.Func.getGeoRegionChildrenTree(nodeUid);
			},
			deleteNodeFn : function(uid) {
				return $scope.Func.remove(uid);
			},
			getFullTree : function(isWithStats, uid) {
				// return topicSrvc.getFullTree(isWithStats, uid);
			},
			getChildrenFn : function(nodeUID) {
				return $scope.Func.getGeoRegionChildrenTree(nodeUID);
				// return topicSrvc.getTopicTreeChilds(nodeUID);
			},
			onSelectNodeClick : function(selectedNode) {
				$scope.Func.select(selectedNode.uid);
				// $rootScope.selectedNodeForTopicManagement = selectedNode;
				// $scope.setMode('view');
				// $rootScope.selectedNodeForTopicManagement.parentList = [];
				// this.findPath(this.getTree(), selectedNode.uid,
				// $rootScope.selectedNodeForTopicManagement.parentList);
				// $rootScope.selectedNodeForTopicManagement.parentList.shift();
				// $scope.Data.secretLevel = $scope.secretLevels[0];
				// for (var int = 0; int < $scope.secretLevels.length; int++) {
				// if ($scope.secretLevels[int].id ==
				// $rootScope.selectedNodeForTopicManagement.secretLevel) {
				// $scope.Data.secretLevel = $scope.secretLevels[int];
				// break;
				// }
				// }
			},
			onSelectNode : function(selectedNode) {
				// $rootScope.selectedNodeForTopicManagement = selectedNode;
				// if ($rootScope.selectedNodeForTopicManagement) {
				// $scope.setMode('view');
				// $rootScope.selectedNodeForTopicManagement.parentList = [];
				// this.findPath(this.getTree(), selectedNode.uid,
				// $rootScope.selectedNodeForTopicManagement.parentList);
				// $rootScope.selectedNodeForTopicManagement.parentList.shift()
				// } else {
				// $scope.setMode('none');
				// }

			},
			findPath : function(tree, uid, path) {
				if (tree.name != "UserDefined")
					path.push(tree);
				if (tree.uid == uid)
					return true;
				for (var i = 0; i < tree.children.length; i++) {
					if (this.findPath(tree.children[i], uid, path)) {
						return true;
					}
				}
				path.pop();
				return false;
			},
			onInit : function() {
				var root = this.getTree();
				if (root.isRoot) {
					root.name = "*";
					this.setTree({
						children : [ root ]
					});
					$scope.tree = this.getTree();
				}
				if (root.children && root.children.length) {
					this.selectNode(root.children[0]);
					this.onSelectNodeClick(root.children[0]);
					if ($scope.Data.isMultipleMode && $scope.Data.selectedNodes.length == 0) {
						$scope.Data.selectedNodes.push(root.children[0])
					}
				}

				var tree = this.getTree();
				if (tree.children.length) {
					this.selectNode(tree.children[0]);
					this.onSelectNodeClick(tree.children[0]);
					if ($scope.Data.isMultipleMode && $scope.Data.selectedNodes.length == 0) {
						$scope.Data.selectedNodes.push(tree.children[0])
					}
					// $scope.setMode('view');
				}
			}
		},
		//////////////
		// END-Tree //
		//////////////
	}

	var Run = function() {
		tagSrvc.setOrgUid($state.params.orgUid);
	}

	Run();

	var findPathOfSelectedNode = function(tree, uid, path) {
		if (tree.name != "UserDefined")
			path.push(tree);
		if (tree._uid == uid)
			return true;
		if (tree.children) {
			for ( var i = 0; i < tree.children.length; i++) {
				if (findPathOfSelectedNode(tree.children[i], uid, path)) {
					return true;
				}
			}
		}
		path.pop();
		return false;
	}

});