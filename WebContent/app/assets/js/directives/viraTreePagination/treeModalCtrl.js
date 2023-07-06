angular.module("viraTree").controller('treeModalCtrl', function($scope, $location, $timeout, toaster,
																homeSrvc, $modal, selectedNode, $modalInstance,
																selectedNodePath, copyMode, getTopicTree,
																getFullTree, getChildrenFn) {

	$scope.selectedNode = selectedNode;
	$scope.copyMode = copyMode;
	$scope.newParentNode = {};
	$scope.viraTreeDirective = {
		controller : {
			getTopicTree:function(nodeUID,showDeleted){
				return getTopicTree(nodeUID,showDeleted)
			},
			getFullTree:function(isWithStats, uid){
				return getFullTree(isWithStats, uid);
			},
			getChildrenFn:function(nodeUID){
				return getChildrenFn(nodeUID);
			},
			onSelectNodeClick : function(selectedNode) {
				$scope.newParentNode = selectedNode;
			},
			onInit : function() {// //this.findPathOfSelectedNode()
				var that = this;
				/*
				 * var root = this.getTree(); root.name = "*"; this.setTree({
				 * children : [ root ] });
				 * 
				 * selectedNodePath.pop(); // if have root on treee if
				 * (selectedNodePath[0].name != "*") {
				 * selectedNodePath.unshift(this.getTree().children[0]); } ;
				 */
				// $scope.viraTreeDirective.controller.onNodeArrayClick(angular.copy(selectedNodePath));

				// $scope.viraTreeDirective.controller.getTreeAndSelectNode($scope.selectedNode.uid).then(function() {
				// 	var root = that.getTree();
				// 	root.isCollapsed = false
				// 	that.setTree({
				// 		children : [ root ]
                //
				// 	});
				// });
			}
		}
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.onSaveClick = function() {
		$modalInstance.close($scope.newParentNode);
	};

});