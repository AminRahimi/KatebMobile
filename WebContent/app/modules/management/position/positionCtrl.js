angular.module('positionModule').controller('positionCtrl',function($scope, $state, positionSrvc, $modal, viraTreeSrvc, vtShowMessageSrvc, appConst, $filter) {
	$scope.treeData = {
		selectedNode: {}
	}
	
	$scope.Data = {
		mode : 'view',
		searchMode : 'none',
		positionList : [],
		originalposition : {},
		newposition: {},
		validationClicked : false,
		userList : [],
		puaHistory: [],
		typeKeyList: [],
		//typeKeyList: [
		//	{uid: "SECRETARIAT_HEAD", title: "مسئول دبیرخانه"},
		//	{uid: "SECRETARIAT_POSITION", title: "دبیر دبیرخانه"},
		//	{uid: "SECURITY_HEAD", title: "حراست"},
		//	{uid: "ASSISTANT", title: "معاون"},
		//	{uid: "MANAGEMENT", title: "مدیر عامل"},
		//	{uid: "EXPERT", title: "کارشناس"},
		//	{uid: "NONE", title: "هیچکدام"}
		//]
		tmp : {
			selected : {}
		},
		showSearchResult: false
	}

	$scope.Func = {
		onSelectposition : function(position) {
			$scope.Data.currentUser = position.currentUser;
			positionSrvc.getposition(position.uid).then(function (res) {
				$scope.treeData.selectedNode.typeKey = res.data.typeKey;
				$scope.Data.puaHistory = _.sortBy($scope.treeData.selectedNode.positionUserAssignments, 'startTime');
			});
			$scope.Data.originalposition = angular.copy(position);
			$scope.Data.mode = 'view';
		},
		onAddpositionClick : function(nodeType) {
			if (nodeType == 'root'){
				$scope.Data.tmp.selected = $scope.Func.correctForAddRoot($scope.Data.selected);
				$scope.Data.newposition.parent = null;
				// $scope.treeFunc.beforAddRoot();
			}
			else if (nodeType == 'child'){
				$scope.Data.tmp.selected = $scope.Func.correctForAdd($scope.Data.selected);
				$scope.Data.newposition.parent = {
						uid : $scope.treeData.selectedNode.uid
				};
				// $scope.treeFunc.beforAddNode();
			}
			$scope.Data.mode = 'add';
			$scope.Func.reset();
		},
		onEditpositionClick : function() {
			$scope.Data.mode = 'edit';
			var typeKey = {};
			typeKey.value = $filter('appEnum')($scope.treeData.selectedNode.typeKey);
			typeKey.key = $scope.treeData.selectedNode.typeKey;
			$scope.treeData.selectedNode.typeKey = typeKey;
		},
		onSavepositionClick : function() {
			if ($scope.positionForm.$valid) {
				var sendingData = angular.copy($scope.Data.newposition);
				return $scope.Controller.viraTree.onSaveNewNodeClick(sendingData, (sendingData.parent && sendingData.parent.uid!= "root-geo")  ? $scope.Data.selectedNode : $scope.Controller.viraTree.getTree(), function() {
					$scope.Data.validationClicked = false;
					$scope.Func.resetForm();
				}).then(function(response) {

				}, function() {
				});
				// positionSrvc.saveposition($scope.Data.newposition).then(function(response) {
				// 	$scope.treeFunc.afterSaveNode(response.data);
				// 	$scope.Func.resetForm();
				// });
			} else {
				$scope.Data.validationClicked = true;
			}
		},
		onUpdatepositionClick : function() {
			if ($scope.positionForm.$valid) {
				// var updatedData = $scope.treeFunc.prepareUpdateNode($scope.treeData.selectedNode);
				var sendingData = angular.copy($scope.treeData.selectedNode);
				sendingData.typeKey = sendingData.typeKey.key;
				if (sendingData.currentUser && sendingData.currentUser.uid == null) {
					sendingData.currentUser = null;
				}
				// if ($scope.treeData.selectedNode.typeKey != "NONE") {
				// 	updatedData.typeKey = $scope.treeData.selectedNode.typeKey;
				// }
				delete sendingData.originalElement;
				positionSrvc.updateposition(sendingData).then(function(response) {
					$scope.Func.updateSelectedNode(sendingData);
					$scope.Func.select($scope.Data.selectedNode.uid).then(function() {
						$scope.Data.validationClicked = false;
						$scope.Data.currentUserRemoved = false;
						$scope.Func.resetForm();
					});
					// $scope.treeFunc.afterUpdateNode();
				});
			} else {
				$scope.Data.validationClicked = true;
			}
		},
		onDeletepositionClick : function() {
			positionSrvc.deleteposition($scope.treeData.selectedNode.uid).then(function(response) {
				$scope.Controller.viraTree.onDeleteNodeClick().then(function(response) {
					// $scope.treeFunc.afterDeleteNode();
					$scope.Func.resetForm();
					$scope.Func.reset();
				});
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
						return positionSrvc.getpositionChildren
					},
					getFullTree: function () {
						return positionSrvc.getFullTree
					},
					getChildrenFn: function () {
						return positionSrvc.getChildren
					}
				}
				// size : size

			});

			modalInstance.result.then(function(newParentNode) {
				positionSrvc.changeParent({
					// name:name,
					childUid:$scope.Data.selectedNode.uid,
					parentUid:newParentNode.uid,
				}).then(function() {
					viraTreeSrvc.removeNodeFromTree($scope.treeDataForTopicManagement.data, selectedNode);
					selectedNode.indexInParent = newParentNode.noOfChild + 51841;
					viraTreeSrvc.findNodeAndPushChildToIt($scope.treeDataForTopicManagement.data, newParentNode.uid, [ selectedNode ], true);
				});
			}, function() {
			});
            // $scope.Controller.positionTreeController.onChangeParentClick($scope.treeData.selectedNode);
        },
		onCancelClick : function() {
			$scope.treeData.selectedNode = angular.copy($scope.Data.originalposition);
			$scope.Data.currentUser = $scope.treeData.selectedNode.currentUser;
			$scope.Func.resetForm();
		},

		onChangeSearchModeClick : function(mode) {
			$scope.Data.searchMode = mode;
		},
		onSearchClick : function(advancedMode) {
			$scope.Func.onChangeSearchModeClick('quick');
			$scope.Controller.positionListController.searchQuery = $scope.Controller.positionSearchController.searchQuery;
			$scope.Controller.positionListController.searchableFieldInfo = $scope.Controller.positionSearchController.searchableFieldInfo;
		},
		onExitSearchModeClick : function() {
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.positionAdvancedSearchController.searchQuery = {};
		},
		
		onSelectcurrentUser : function(currentUser) {
			$scope.Data.currentUser = currentUser;
			if($scope.Data.mode == 'add'){
				$scope.Data.newposition.currentUser = {
					uid : $scope.Data.currentUser.uid
				}				
			}else if($scope.Data.mode == 'edit'){
				$scope.treeData.selectedNode.currentUser = {
					uid : $scope.Data.currentUser.uid,
					title : $scope.Data.currentUser.title
				}								
			}
		},
		onRemovecurrentUser: function(){
			$scope.Data.currentUserRemoved = true;
			$scope.Data.currentUser = null;
			if($scope.Data.mode == 'add')
				$scope.Data.newposition.currentUser = null;	
			if($scope.Data.mode == 'edit')
				$scope.treeData.selectedNode.currentUser = {};
		},

		reset : function() {
			$scope.Data.currentUser = null;
			$scope.Data.newposition.name = "";
			$scope.Data.newposition.currentUser = {};
			$scope.Data.puaHistory = [];
		},
		resetForm : function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		},
		refreshCurrentUser: function (query) {
			if (query.length > 2) {
				positionSrvc.getCurrentUser(query).then(function (response) {
					$scope.Data.userList.length = 0;
					response.data.forEach(function (item) {
						$scope.Data.userList.push(item);
					})
				})
			}
		},
		getGeoRegionRootTree : function() {
			return positionSrvc.getpositionChildren().then(function(response) {
				geoChild = _.find(response.data, function(item) {
					return item.uid == "root-geo"
				});

				return {
					rootUid: "root-geo",
					// data : geoChild.children
					data : response.data
				}
			});
		},
		select : function(uid) {
			// $scope.Data.currentUser = position.currentUser;
			// positionSrvc.getposition(position.uid).then(function (res) {
			// 	$scope.treeData.selectedNode.typeKey = res.data.typeKey;
			// 	$scope.Data.puaHistory = _.sortBy($scope.treeData.selectedNode.positionUserAssignments, 'startTime');
			// });
			// $scope.Data.originalposition = angular.copy(position);
			// $scope.Data.mode = 'view';

			return positionSrvc.getposition(uid).then(function(response) {
				$scope.Data.selected = response.data;
				$scope.treeData.selectedNode = response.data;
				$scope.Data.currentUser = response.data.currentUser;

				if($scope.Data.currentUserRemoved) {
					$scope.treeData.selectedNode.currentUser = {};
					$scope.Data.currentUser = {};
				}

				$scope.treeData.selectedNode.typeKey = response.data.typeKey;
				$scope.Data.puaHistory = _.sortBy($scope.treeData.selectedNode.positionUserAssignments, 'startTime');
				$scope.Data.mode = 'view';
			});
		},
		searchActions : {

			onBreadcrumbSearchResultClick : function(nodeArray) {
				$scope.Controller.viraTree.onNodeArrayClick(angular.copy(nodeArray));
				$scope.Data.tmp.selected = $scope.Func.correctForEdit($scope.Data.selected, $scope.Data.geoRegionTypeList);
				$scope.Func.select(nodeArray[nodeArray.length - 1].uid);
			},

			onSearchClick : function() {
				var searchItem = {
					restrictions: []
				};
				// 		{
				// 		field: 'name',
				// 		value: $scope.Controller.search.searchQuery.name,
				// 		type: 'like'
				// 	}]
				// };
				if (!_.isEmpty($scope.Controller.search.searchQuery.name)) {
					searchItem.restrictions.push({
						field: 'name',
						value: $scope.Controller.search.searchQuery.name,
						type: 'like'
					})
				}
				if (!_.isEmpty($scope.Controller.search.searchQuery.assignee)) {
					searchItem.restrictions.push({
						field: 'assignee',
						value: $scope.Controller.search.searchQuery.assignee,
						type: 'assignee'
					})
				}
				return positionSrvc.searchOnTree(searchItem).then(function (response) {
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
		getGeoRegionChildrenTree : function(nodeUID) {
			return positionSrvc.getChildren(nodeUID);
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
		events : {
			crud : {
				crud : {
					onGotoEditClick : function() {
						$scope.Data.tmp.selected = $scope.Func.correctForEdit($scope.Data.selected);
						$scope.Func.setMode("edit");
					},
					onGotoAddClick : function() {
						$scope.Data.tmp.selected = $scope.Func.correctForAdd($scope.Data.selected);
						//$scope.Data.tmp.selected.weight = 1;
						$scope.Func.setMode("add");
					},
					onGotoAddRootClick : function() {
						$scope.Data.tmp.selected = $scope.Func.correctForAddRoot($scope.Data.selected);
						//$scope.Data.tmp.selected.weight = 1;
						$scope.Func.setMode("add");
					},
					onSaveAddingClick : function() {
						if ($scope.form.$valid) {
							var sendingData = angular.copy($scope.Data.tmp.selected);

							if ($scope.Data.isGridMode) {
								$scope.Func.addPosition(sendingData).then(function(response) {
									$scope.Apis.grid.refreshList();
									$scope.Data.validationClicked = false;
									$scope.Func.setMode("none");
								});
							} else {
								return $scope.Apis.viraTree.onSaveNewNodeClick(sendingData, sendingData.parent ? $scope.Data.selectedNode : $scope.Apis.viraTree.getTree(), function() {
									$scope.Data.validationClicked = false;
									$scope.Func.setMode("none");
								}).then(function(response) {

								}, function() {
								});
							}

						} else {
							$scope.Data.validationClicked = true;
						}
					},
					onUpdateClick : function() {
						if ($scope.form.$valid) {

							var sendingData = angular.copy($scope.Data.tmp.selected);
							if (sendingData.currentUser && sendingData.currentUser.uid == null) {
								sendingData.currentUser = null;
							}
							return positionSrvc.updatePosition(sendingData, sendingData.uid).then(function(response) {

								if ($scope.Data.isGridMode) {
									$scope.Apis.grid.refreshList();
									$scope.Func.setMode("none");
								} else {
									$scope.Func.updateSelectedNode(sendingData);
									$scope.Func.select($scope.Data.selectedNode.uid).then(function() {
										$scope.Func.setMode("none");
										$scope.Data.validationClicked = false;
									});

								}

							});
						} else {
							$scope.Data.validationClicked = true;
						}

					},
					onCancelClick : function() {
						$scope.Func.reset();
						$scope.Func.setMode("none");
					},
					onDeleteClick : function() {
						pollManagementSrvc.openConfirmModal().then(function() {
							if ($scope.Data.isGridMode) {
								$scope.Func.remove($scope.Data.selectedNode.uid).then(function() {
									$scope.Apis.grid.refreshList();
									$scope.Func.setMode("none");
								});
							} else {
								$scope.Apis.viraTree.onDeleteNodeClick().then(function(response) {
									$scope.Func.setMode("none");
								});

							}
							$scope.Func.setMode("none");
						});

					}
				},
			}
		},
		updateSelectedNode : function(positionObj) {
			$scope.Data.selectedNode.title = positionObj.name;
		},
		findPathOfSelectedNode: function() {
			var path = [];
			findPathOfSelectedNode($scope.Func.getTree(), $scope.Data.selectedNode.uid, path);
			return path;
		},
		getTree: function() {
			return $scope.treeData;
		},
        onCopyToClipboardSuccess: function () {
            vtShowMessageSrvc.showMassage('success', '', 'شناسه در کلیپ بورد ذخیره شد',2000);
        }
	}

	$scope.Controller = {
		viraTree : {
			getTopicTree : function(nodeUID, showDeleted) {
				if (!nodeUID) {
					return $scope.Func.getGeoRegionRootTree();
				} else {
					return $scope.Func.getGeoRegionChildrenTree(nodeUID);
				}
			},
			addNodeFn : function(sendingObj, parentUid) {
				return positionSrvc.saveposition(sendingObj, parentUid);
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
		search : {
			advanced : false,
			searchableFieldInfo : [ {
				key : "name",
				type : "string",
				label : "نام سمت"
			}, {
				key : "assignee",
				type : "string",
				label : "کاربر"
			} ],
			onSearchClick : $scope.Func.searchActions.onSearchClick,
			onExitSearchModeClick : $scope.Func.searchActions.onExitSearchModeClick
		},
		positionTreeController: {
			inTreeAction: false,
			actionList: [],
			childrenKey: 'children',
			fieldsKey: [{
				key: 'uid',
				type: 'string',
				original: true
			},{
				key: 'currentUser',
				type: 'comp',
				original: true
			},{
				key: 'positionUserAssignments',
				type: 'comp',
				original: false
			},{
				key: 'name',
				type: 'string',
				original: true
			},{
				key: 'title',
				type: 'string',
				original: false
			}],
			getRoot: function(){
				return positionSrvc.getpositionChildren('root');
			},
            moveNode:function(selectedNodeUid,name,parentUid){
                return positionSrvc.changeParent({
                    // name:name,
                    childUid:selectedNodeUid,
                    parentUid:parentUid,
                }).then(function(response){
                    $scope.treeFunc.afterUpdateNode();
                    $scope.Func.resetForm();
                });
            },
			getNode: positionSrvc.getposition,
			getChildren: positionSrvc.getpositionChildren,
			onSelectNode: $scope.Func.onSelectposition,
			
		},
		positionSearchController : {
			advanced : false,
			searchableFieldInfo : [ {
				key : "name",
				type : "string",
				label : "نام"
			}, {
				key : "currentUser",
				type : "enum",
				label : "کاربر",
				itemsList: $scope.Data.userList
			} ],
			onSearchClick : $scope.Func.onSearchClick,
			onExitSearchModeClick : $scope.Func.onExitSearchModeClick
		}
	}

	var Run = function() {
		positionSrvc.setOrgUid($state.params.orgUid);
		$scope.appConst = appConst;
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