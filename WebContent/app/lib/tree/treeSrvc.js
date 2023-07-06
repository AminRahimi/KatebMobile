angular.module('treeModule').factory('treeSrvc', function(treeConfigSrvc) {

	var getEmptyValue = function(fieldType) {
		var emptyValue;
		switch (fieldType) {
		case 'string':
			emptyValue = "";
			break;
		case 'integer':
			emptyValue = 0;
			break;
		case 'comp':
			emptyValue = {};
			break;
		case 'arr':
			emptyValue = [];
			break;
		case 'bool':
		case 'boolean':
			emptyValue = false;
			break;
		default:
			emptyValue = null;
			break;
		}
		return emptyValue;
	}

	var treeSrvc = {
		removeNodeFromTree : function(tree, node) {
			var childrenKey = treeConfigSrvc.getChildrenKey();
			for (var i = 0; i < tree[childrenKey].length; i++) {
				if (tree[childrenKey][i].uid == node.uid) {
					tree[childrenKey].splice(i, 1);
					tree.childCount--;
					if (tree.childCount === 0) {
						tree.isCollapsed = true;
					}
					return tree;
				} else {
					var _tree = this.removeNodeFromTree(tree[childrenKey][i], node);
					if (_tree) {
						return _tree;
					}
				}
			}
		},
		findNodeAndPushChildToIt : function(nodeList, tree, uid, children) {
			this.pushNodeToChildOfNode(this.getNodeFromNodeList(nodeList, uid), children);
		},
		pushNodeToChildOfNode : function(parentNode, child_nodes, doForHaveChildNodes) {
			var childrenKey = treeConfigSrvc.getChildrenKey();
			if (parentNode[childrenKey] && parentNode[childrenKey].length) {
				for (var i = 0; i < child_nodes.length; i++) {
					parentNode.childCount++;
					parentNode[childrenKey].push(child_nodes[i]);
				}
			} else if (!doForHaveChildNodes) {
				parentNode.childCount = child_nodes.length;
				parentNode[childrenKey] = child_nodes;
			}
			if (parentNode.childCount == 0) {
				parentNode.childCount = child_nodes.length;
			}

		},
		getNodeFromNodeList : function(nodeList, nodeUID) {
			return nodeList[nodeUID];
		},
		setNodeList : function(nodeList, nodeUID, node) {
			nodeList[nodeUID] = node;
		},
		tree : function(nodeList, data, isFullOpen) {
			var fieldsKey = treeConfigSrvc.getFieldsKey();
			var childrenKey = treeConfigSrvc.getChildrenKey();
			
			if (angular.isArray(data)) {
				this[childrenKey]=[];
				for (var i = 0; i < data.length; i++) {
					this[childrenKey].push(new treeSrvc.tree(nodeList, data[i], isFullOpen));
				}
			} else {
				this.uid = data.uid;
				for (var i = 0; i < fieldsKey.length; i++) {
					if (fieldsKey[i].type == 'comp' || fieldsKey[i].type == 'arr')
						this[fieldsKey[i].key] = angular.copy(data[fieldsKey[i].key]);
					else
						this[fieldsKey[i].key] = data[fieldsKey[i].key];
				}
				this.childCount = function() {
					if (data.childCount) {
						return data.childCount;
					} else if (data[childrenKey]) {
						return data[childrenKey].length;
					} else {
						return 0;
					}
				}()
				this.selectedClass = false;

				this[childrenKey] = [];
				if (treeSrvc.getNodeFromNodeList(nodeList, data.uid) == undefined) {
					if (this.childCount > 0)
						this.isCollapsed = true;
					else
						this.isCollapsed = false;
					treeSrvc.setNodeList(nodeList, data.uid, this);

				} else {
					this.isCollapsed = treeSrvc.getNodeFromNodeList(nodeList, data.uid).isCollapsed;
					if (!data[childrenKey] || !data[childrenKey].length) {
						this[childrenKey] = treeSrvc.getNodeFromNodeList(nodeList, data.uid)[childrenKey];
					} else {
						this[childrenKey] = treeSrvc.getNodeFromNodeList(nodeList, data.uid)[childrenKey];
						this[childrenKey].splice(0, this[childrenKey].length);
					}
				}
				if (data[childrenKey]) {
					for (var i = 0; i < data[childrenKey].length; i++) {
						this[childrenKey].push(new treeSrvc.tree(nodeList, data[childrenKey][i], isFullOpen));
					}
				}
				if (isFullOpen && this[childrenKey] && this[childrenKey].length) {
					this.isCollapsed = false;
				}
				return this;
			}

		},
		node : function() {
			var fieldsKey = treeConfigSrvc.getFieldsKey();
			for (var i = 0; i < fieldsKey.length; i++) {
				this[fieldsKey[i].key] = getEmptyValue(fieldsKey[i].type);
			}
			return this;
		}
	}
	return treeSrvc;
});