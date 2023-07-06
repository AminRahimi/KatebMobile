angular.module("viraTreePagination").factory('viraTreePaginationSrvc', function() {
	var viraTreePaginationSrvc = {};
	viraTreePaginationSrvc = {

		saveToicTreeOfTopicManagement : function() {

		},
		getTopicTreeOfTopicManagement : function() {

		},
		findNodesExpandAndGetChildsAndSelect : function(node, searchingNodes, selectFn, getTopicTreeChildsFn, isJustFind, goToNodeLocation) {
			var _this = this;
			if (searchingNodes.length) {
				if (node.children.length) {
					node.isCollapsed = true;
					var searchingNode = searchingNodes.shift();
					_.find(node.children, function(_node) {
						if (_node.uid === searchingNode.uid) {
							if (searchingNodes.length == 0) {
							    if (!isJustFind) {
                                    selectFn(_node);
                                } else {
                                    goToNodeLocation();
                                }
							} else {
								_this.findNodesExpandAndGetChildsAndSelect(_node, searchingNodes, selectFn, getTopicTreeChildsFn, isJustFind, goToNodeLocation);
							}
							return true;
						} else {
							return false;
						}
					});
				} else if (node.childCount) {
					getTopicTreeChildsFn(node.uid).then(function(response) {
						var treeData = response.data;
						var treeData = new _this.tree(treeData);
						_this.pushNodeToChildOfNode(node, treeData.children);
						_this.findNodesExpandAndGetChildsAndSelect(node, searchingNodes, selectFn, getTopicTreeChildsFn, isJustFind, goToNodeLocation);
					});
					// topicSrvc.getTopicTreeChilds(node.uid)
				}
			}

		},

		getChildsAndPushToTree : function(collapsingTreeData, getChildrenFn, beforeSelectedNodes, callBackFnIfNoChildNeedToGet) {
			var _this = this;
			if (collapsingTreeData.childCount) {
				if (!collapsingTreeData.children || !collapsingTreeData.children.length) {
					getChildrenFn(collapsingTreeData.uid ? collapsingTreeData.uid : collapsingTreeData._uid, 0, 5).then(function(response) {
						// if (!response.data.hasOwnProperty("children")) {
						// 	response.data.children = response.data;
						// }
						var treeData = {
							uid : collapsingTreeData.uid || collapsingTreeData._uid,
							children : response.data,
							hasMore : response.data.hasMore,
							nextStart : response.data.nextStart,
							childCount : response.data.length
						};
						if(treeData.hasMore){
							treeData.children.push({
								uid: 'more',
								title: 'نمایش موارد بیشتر',
							});
						}
						treeData = new viraTreePaginationSrvc.tree(treeData, beforeSelectedNodes);
						_this.pushNodeToChildOfNode(collapsingTreeData, treeData.children);
					});
				} else {
					if (callBackFnIfNoChildNeedToGet) {
						callBackFnIfNoChildNeedToGet();
					}
				}
			}
		},
		findNodeAndPushChildToIt : function(tree, uid, children, doForHaveChildNodes) {
			// if(tree.childCount == 0)
			// return;
			var _this = this;
			if (tree.uid == uid) {
				_this.pushNodeToChildOfNode(tree, children, doForHaveChildNodes);
				return true;
			}
			for (var i = 0; i < tree.children.length; i++) {
				if (_this.findNodeAndPushChildToIt(tree.children[i], uid, children, doForHaveChildNodes)) {
					return true;
				}
			}
			return false;
		},
		removeNodeFromTree : function(tree, node) {

			for (var i = 0; i < tree.children.length; i++) {
				if (tree.children[i].uid == node.uid) {
					tree.children.splice(i, 1);
					tree.childCount--;
					if (tree.childCount === 0) {
						tree.isCollapsed = false;
					}
					return tree;
				} else {
					var _tree = this.removeNodeFromTree(tree.children[i], node);
					if (_tree) {
						return _tree;
					}
				}
			}

		},
		findNode : function(tree, uid) {
			var _this = this;
			if (tree.uid == uid) {
				return tree;
			}
			for (var i = 0; i < tree.children.length; i++) {
				var _tree = _this.findNode(tree.children[i], uid);
				if (_tree) {
					return _tree;
				}
			}
			return false;
		},
		findParentOfNode : function(tree, uid) {
			var _this = this;
			if (_.find(tree.children, function(childNode) {
				return childNode.uid === uid;
			})) {
				return tree;
			}
			for (var i = 0; i < tree.children.length; i++) {
				var _tree = _this.findParentOfNode(tree.children[i], uid);
				if (_tree) {
					return _tree;
				}
			}
			return false;
		},
		pushNodeToChildOfNode : function(parentNode, childrens, doForHaveChildNodes) {
			if (parentNode.children && parentNode.children.length) {
				for (var i = 0; i < childrens.length; i++) {
					parentNode.childCount++;
					parentNode.children.push(childrens[i]);
				}
				parentNode.isCollapsed = true;
			} else if (!doForHaveChildNodes) {
				parentNode.childCount = childrens.length;
				parentNode.children = childrens;
				parentNode.isCollapsed = true;
			}
			if (parentNode.childCount == 0) {
				parentNode.childCount = childrens.length;
				parentNode.isCollapsed = false;
			}

		},

		generateNewNode : function(data) {
			var newNode = {
				childCount : 0,
				children : []
			};
			angular.extend(newNode, data);
			return newNode;
		},
		tree : function(data, beforeSelectedNodes, isFullOpen) {
			var _this = this;
			angular.extend(this, data);
			// this.name = data.name;
			// this.uid = data.uid;
			// this.isRoot = data.isRoot;
			// this.indexInParent = data.indexInParent;
			// this.keywords = data.keywords;
			// this.stats = data.stats;
			// this.childCount = data.childCount;
			// this.secretLevel = data.secretLevel;
			this.selectedClass = false;
			_.find(beforeSelectedNodes, function(node) {
				if (node.uid === _this.uid) {
					_this.selectedClass = true;
					return true;
				} else {
					return false;
				}
			});

			// this.displayString = data.displayString;

			this.children = [];
			if (data.childCount > 0)
				this.isCollapsed = false;
			else
				this.isCollapsed = true;

			if (data.children && data.children.length) {
				for (var i = 0; i < data.children.length; i++) {
					this.children.push(new viraTreePaginationSrvc.tree(data.children[i], beforeSelectedNodes, isFullOpen));
				}
			}

			if (isFullOpen && this.children && this.children.length) {
				this.isCollapsed = true;
			}
		},
		node : function() {
			this.id = "";
			this.name = "";
			this.keywords = [];
			return this;
		}
	};

	return viraTreePaginationSrvc;

});
