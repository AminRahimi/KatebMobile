angular.module("treeModule").directive('openTree', [
// TODO:topicSrvc must be added as attribute on directive
'treeSrvc', function(treeSrvc) {
	return {
		restrict : 'EA',
		// replace: true,
        templateUrl: function(elem, attr){
			if (!attr.template)
                attr.template = '';
            return 'app/assets/js/directives/openTree/openTree'+attr.template+'Template.html';
        },
		scope : {
			api : "=",
			treeData: "=?",
			letter:"=?",
            template: "@" // Print, ''

		// getFullTree(isWithStats, uid)
		// return promise
		//
		// getTopicTree(uid)
		// return promise
		//
		// addNode(name, parentNode.uid)
		// return promise
		//
		// editNode(nodeId, name)
		// return promise
		//
		// deleteNode(selectedNode.uid)
		// return promise
		//
		// setNewParentForNode(selectedNode.uid, selectedNode.name,
		// newParentNode.uid)
		// return promise
		//
		// changeIndexOfNode(node.uid, node.index_in_parent + 1)
		// return promise

		},
		controller : function($scope, $rootScope, $modal, $q, viraTreeSrvc,cartableKatebSrvc) {
			$scope.treeItemRendererAddress = $scope.template === 'Print' ? 'app/assets/js/directives/openTree/openTreePrintTemplate.html' : 'app/assets/js/directives/openTree/openTreeTemplate.html';
			$scope.tempNode;
			$scope.treeData = $scope.treeData ? new viraTreeSrvc.tree($scope.treeData) : {};
			$scope.Data = {
				selectedNode: null,
				sender:""
			}

			$scope.dynamicPopover = {
			    content: 'Hello, World!',
			    templateUrl: 'myPopoverTemplate.html',
			    title: 'Title'
			};
			$scope.Data.sender = $scope.letter.initiation.sender
			$scope.Func = {
				onNodeClick : function(node) {
					if ($scope.Data.selectedNode) {
						$scope.Data.selectedNode.isSelected = false;
					}
					$scope.Data.selectedNode = node;
					$scope.Data.selectedNode.isSelected = true;

					if(angular.isFunction($scope.api.onNodeClick) && node.uid) {
						$scope.api.onNodeClick(node).then(function (res) {
							node.item.lastReadingDate = res.lastReadingDate;
							node.item.readingDate = res.readingDate;
							node.item.readCounter = res.readCounter;
						})
					}
				},

				onCollapseClick : function(collapsingNode) {
					var isCollapsed = collapsingNode.isCollapsed;
					return viraTreeSrvc.getchildrenAndPushToTree($scope.api.onGetTree, collapsingNode).then(function() {
						collapsingNode.isCollapsed = !isCollapsed;
					});
				}
			}

			var getTopicTree = function(uid) {
				return $scope.api.onGetTree(uid).then(function(response) {
					$scope.treeData = new viraTreeSrvc.tree({
						children : [response.data]
					});
				});

			};

			$scope.api.loadTopicTree = function(uid) {

				return getTopicTree(uid).then(function() {
					if ($scope.api.onLoad) {
						$scope.api.onLoad();
					}
				});
			};

			$scope.api.getTree = function() {
				return $scope.treeData;
			};
			
			$scope.api.refresh=function(){
				$scope.treeData = ($scope.treeData && !$scope.treeData.isGenerated) ? new viraTreeSrvc.tree($scope.treeData) : {};
				//getFirstTree();
			}

			var  getFirstTree=function(){
				
				if (!$scope.treeData || !$scope.treeData.isGenerated) {
					getTopicTree().then(function() {
						if ($scope.api.onInit) {
							$scope.api.onInit();
						}
					});
				}
			}
			
			//getFirstTree();
			
			

		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
} ]);
