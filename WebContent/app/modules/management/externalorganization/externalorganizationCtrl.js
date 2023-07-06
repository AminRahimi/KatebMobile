angular.module('externalorganizationModule').controller('externalorganizationCtrl', 
		function($scope, $state, $modal, externalorganizationSrvc, viraTreeSrvc, vtShowMessageSrvc) {
	
	$scope.treeData = {
		selectedNode: {},
	}
	$scope.Data = {
		mode : 'view',
		originalexternalorganization : {},
		newexternalorganization : {},
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
		onAddexternalorganizationClick : function(nodeType) {
			if (nodeType == 'root'){
				$scope.Data.tmp.selected = $scope.Func.correctForAddRoot($scope.Data.selected);
				$scope.Data.newexternalorganization.parent = null;
			}
			else if (nodeType == 'child'){
				$scope.Data.tmp.selected = $scope.Func.correctForAdd($scope.Data.selected);
				$scope.Data.newexternalorganization.parent = {
					uid : $scope.treeData.selectedNode.uid
				};
			}
			$scope.Data.mode = 'add';
			$scope.Func.reset();
		},
		onEditexternalorganizationClick : function() {
			$scope.Data.mode = 'edit';
		},
		onSaveexternalorganizationClick : function() {
			if ($scope.externalorganizationForm.$valid) {
				var sendingData = angular.copy($scope.Data.newexternalorganization);
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
		onUpdateexternalorganizationClick : function() {
			if ($scope.externalorganizationForm.$valid) {
				var sendingData = angular.copy($scope.treeData.selectedNode);
				if (sendingData.currentUser && sendingData.currentUser.uid == null) {
					sendingData.currentUser = null;
				}
				delete sendingData.originalElement;
				externalorganizationSrvc.updateexternalorganization(sendingData).then(function(response) {
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
		onDeleteexternalorganizationClick : function() {
			externalorganizationSrvc.deleteexternalorganization($scope.treeData.selectedNode.uid).then(function(response) {
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
						return externalorganizationSrvc.getexternalorganizationChildren
					},
					getFullTree: function () {
						return externalorganizationSrvc.getFullTree
					},
					getChildrenFn: function () {
						return externalorganizationSrvc.getChildren
					}
				}
			});

			modalInstance.result.then(function(newParentNode) {
				externalorganizationSrvc.changeParent({
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
			$scope.treeData.selectedNode = $scope.Data.originalexternalorganization;
			$scope.Func.resetForm();
		},


		onAddMemberClick:function(){
			var modalInstance= $scope.Func.openMemberModal(null, 'add');
			modalInstance.result.then(function(memberList) {
				if($scope.Data.mode == 'add'){
					if(!$scope.Data.newexternalorganization.externalOrganizationMembers)
						$scope.Data.newexternalorganization.externalOrganizationMembers = [];
					$scope.Data.newexternalorganization.externalOrganizationMembers = 
						$scope.Data.newexternalorganization.externalOrganizationMembers.concat(memberList);
				}else if($scope.Data.mode == 'edit'){
					if(!$scope.treeData.selectedNode.externalOrganizationMembers)
						$scope.treeData.selectedNode.externalOrganizationMembers = [];
					$scope.treeData.selectedNode.externalOrganizationMembers = 
						$scope.treeData.selectedNode.externalOrganizationMembers.concat(memberList);
				}
			});
		},
		onEditMemberClick:function(index, member){
			var modalInstance= $scope.Func.openMemberModal(member, 'edit');
			modalInstance.result.then(function(editedMember) {
				if($scope.Data.mode == 'add'){
					$scope.Data.newexternalorganization.externalOrganizationMembers[index] = editedMember;
				}else if($scope.Data.mode == 'edit'){
					$scope.treeData.selectedNode.externalOrganizationMembers[index] = editedMember;
				}
				
			});
		},
		onRemoveMemberClick:function(index){
			if($scope.Data.mode == 'add'){
				$scope.Data.newexternalorganization.externalOrganizationMembers.splice(index,1);
			}else if($scope.Data.mode == 'edit'){
				$scope.treeData.selectedNode.externalOrganizationMembers.splice(index,1);
			}
		},
		openMemberModal:function(member, mode){
			var modalInstance = $modal.open({
				templateUrl : 'app/modules/management/externalorganization/memberModal.html',
				controller : 'memberModalCtrl',
				size : 'md',
				resolve : {
					member: function(){
						return member;
					},
					mode: function(){
						return mode;
					}
				}
			});
			return modalInstance;
		},
		
		
		onChangeSearchModeClick : function(mode) {
			$scope.Data.searchMode = mode;
		},
		onSearchClick : function() {
			$scope.Func.onChangeSearchModeClick('quick');
			$scope.Controller.externalorganizationListController.searchQuery = $scope.Controller.externalorganizationSearchController.searchQuery;
			$scope.Controller.externalorganizationListController.searchableFieldInfo = $scope.Controller.externalorganizationSearchController.searchableFieldInfo;
		},
		onExitSearchModeClick : function() {
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.externalorganizationSearchController.searchQuery = {};
		},

		reset : function() {
			$scope.Data.newexternalorganization.title = "";
			$scope.Data.newexternalorganization.externalOrganizationMembers = [];
			$scope.Data.parent = {};
		},
		resetForm : function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		},
		onCopyToClipboardSuccess: function () {
            vtShowMessageSrvc.showMassage('success', '', 'شناسه در کلیپ بورد ذخیره شد',2000);
        },
		//////////
		// Tree //
		//////////
		getGeoRegionRootTree : function() {
			return externalorganizationSrvc.getexternalorganizationChildren().then(function(response) {
				return {
					rootUid: "root-geo",
					data : response.data
				}
			});
		},
		getGeoRegionChildrenTree : function(nodeUID) {
			return externalorganizationSrvc.getChildren(nodeUID);
		},
		remove : function(uid) {
			return externalorganizationSrvc.deleteexternalorganization(uid);
		},
		select : function(uid) {
			return externalorganizationSrvc.getexternalorganization(uid).then(function (response) {
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
			$scope.Data.selectedNode.title = positionObj.title;
		},
		displayNameEnabled: function (query) {
			if (query) {
				if (query.title) return false;
				if (query.externalOrganizationMember) return true;
			} else {
				return false;
			}
		},
		searchActions : {
			onBreadcrumbSearchResultClick: function (nodeArray) {
				if (nodeArray[0].externalOrganization) { $scope.Func.select(nodeArray[0].externalOrganization.uid); }
				else {
					$scope.Func.select(nodeArray[nodeArray.length - 1].uid);
					$scope.Controller.viraTree.onNodeArrayClick(angular.copy(nodeArray));
					$scope.Data.tmp.selected = $scope.Func.correctForEdit($scope.Data.selected, $scope.Data.geoRegionTypeList);
				}
                
			},
			onSearchClick: function () {
				if ($scope.Controller.externalorganizationSearchController.searchQuery.title) {
						var searchItem = {
						restrictions: [
							{
							field: 'title',
							value: $scope.Controller.externalorganizationSearchController.searchQuery.title,
							type: 'like'
							},
						]
					};
					return externalorganizationSrvc.searchOnTree(searchItem).then(function (response) {
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
				}
				if ($scope.Controller.externalorganizationSearchController.searchQuery.externalOrganizationMember) {
					$scope.Data.EnableTitle = false
					var searchItem = {
						restrictions: [
							{
							field: 'displayName',
							value: $scope.Controller.externalorganizationSearchController.searchQuery.externalOrganizationMember,
							type: 'like'
							},
						]
					};
					return externalorganizationSrvc.searchOnTable(searchItem).then(function (response) {
						$scope.Data.searchResults = [];
						if (response.data.originalElement.totalCount > 0) {
							var searchResultList = response.data.originalElement;
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
					})
				}
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
		externalorganizationSearchController : {
			advanced : false,
			searchableFieldInfo: [
				{
				key : "title",
				type : "string",
				label: "نام",
				dispalyName:false
				},
				{
				key : "externalOrganizationMember",
				type : "dispalyName",
				label: "نام نمایشی",
				},
			],
			onSearchClick : $scope.Func.searchActions.onSearchClick,
			onExitSearchModeClick: $scope.Func.searchActions.onExitSearchModeClick,
			displayName: true,
		},
		//////////
		// Tree //
		//////////
		viraTree : {
			getTopicTree : function(nodeUID, showDeleted) {
				if (!nodeUID) {
					return $scope.Func.getGeoRegionRootTree();
				} else {
					return $scope.Func.getGeoRegionChildrenTree(nodeUID);
				}
			},
			addNodeFn : function(sendingObj, parentUid) {
				return externalorganizationSrvc.saveexternalorganization(sendingObj, parentUid);
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
				if (tree.title != "UserDefined")
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
					root.title = "*";
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
		externalorganizationSrvc.setOrgUid($state.params.orgUid);
	}

	Run();

	var findPathOfSelectedNode = function(tree, uid, path) {
		if (tree.title != "UserDefined")
			path.push(tree);
		if (tree._uid == uid)
			return true;
		if (tree.children) {
			for (var i = 0; i < tree.children.length; i++) {
				if (findPathOfSelectedNode(tree.children[i], uid, path)) {
					return true;
				}
			}
		}
		path.pop();
		return false;
	}

});