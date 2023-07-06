angular.module("treeModule").controller('treeModalCtrl', function($scope, $modalInstance,treeControllerObj) {

	//$scope.selectedNode = selectedNode;
	$scope.treeData2 = {
			selectedNode: {},
		}
	$scope.newParentNode = {};
	// $scope.viraTreeDirective = {
	// controller : {
	// onSelectNodeClick : function(selectedNode) {
	// $scope.newParentNode = selectedNode;
	// },
	// onInit : function() {// //this.findPathOfSelectedNode()
	// var that = this;
	//
	// $scope.viraTreeDirective.controller.getTreeAndSelectNode($scope.selectedNode._uid).then(function()
	// {
	// var root = that.getTree();
	// root.isCollapsed = false
	// that.setTree({
	// children : [ root ]
	//
	// });
	// });
	// }
	// }
	// };
	treeControllerObj.onSelectNode = function(node) {
		$scope.newParentNode = node;
	}
	$scope.Controller = {
		treeController : treeControllerObj
	}

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.onSaveClick = function() {
		$modalInstance.close($scope.newParentNode);
	};

});