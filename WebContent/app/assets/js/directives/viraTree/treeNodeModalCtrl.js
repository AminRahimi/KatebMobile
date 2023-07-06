angular.module("viraTree").controller('treeNodeModalCtrl',
		function($scope, $location, topicSrvc, $timeout, toaster, homeSrvc, $modal, selectedNode, mode, $modalInstance, viraTreeSrvc, hotkeys,onSaveNewNodeClick) {
		$scope.secretLevels = [
							{
		              	    	 id : 1,
		              	    	 name : "عادی"
		              	     },{
		              	    	 id : 2,
		              	    	 name : "محرمانه"
		              	     },{
		              	    	 id : 3,
		              	    	 name : "خیلی محرمانه"
		              	     },{
		              	    	 id : 4,
		              	    	 name : "سری"
		              	     },{
		              	    	 id : 5,
		              	    	 name : "به کلی سری"
		              	     }                  
		        ];
			$scope.selectedNode = selectedNode;
			$scope.mode = mode;
			$scope.isFocus = true;

			var setHotKeys = function() {
				hotkeys.bindTo($scope).add({
					combo : "ctrl+enter",
					description : "save",
					allowIn : [ 'INPUT', 'SELECT', 'TEXTAREA' ],
					callback : function(event, hotkey) {
						if ($scope.mode == "ADD") {
							$scope.saveNewNode();
						} else if ($scope.mode == "EDIT_NAME") {
							$scope.saveEditedNode();
						}
						event.preventDefault();
					}
				}).add({
					combo : "esc",
					description : "cancel",
					allowIn : [ 'INPUT', 'SELECT', 'TEXTAREA' ],
					callback : function(event, hotkey) {
						$scope.cancel();
						event.preventDefault();
					}
				});
			};

			setHotKeys();

			var gotoGoodMode = function(_mode) {

				if (_mode === "ADD") {
					$scope.tempNode = new viraTreeSrvc.node();
					$scope.tempNode.secretLevel = $scope.secretLevels[0];
					$scope.tempNode.parentId = $scope.selectedNode.uid;
				} else if (_mode === "EDIT_NAME") {
					$scope.tempNode = angular.copy($scope.selectedNode);
//					$scope.tempNode.secretLevel = $scope.secretLevels[0];
					for (var int = 0; int < $scope.secretLevels.length; int++) {
						if ($scope.secretLevels[int].id==$scope.tempNode.secretLevel) {
							$scope.tempNode.secretLevel=$scope.secretLevels[int];
							break;
						}
					}
				}
			};
			gotoGoodMode(mode);
			$scope.cancel = function() {
				$modalInstance.dismiss('cancel');
			};
			$scope.onYesClick=function(){
				$modalInstance.close($scope.selectedNode);	
			};
			$scope.saveNewNode = function() {

				// TODO
				// topicSrvc.addNewNodeToTree(name,parentId);
				onSaveNewNodeClick($scope.tempNode.name, $scope.selectedNode, function(){}, $scope.tempNode.secretLevel ? $scope.tempNode.secretLevel.id : "").then(function() {
					$modalInstance.close();});
			};
			$scope.saveEditedNode = function() {
				var tempNode = $scope.tempNode;
				topicSrvc.editNode($scope.tempNode.uid, $scope.tempNode.name, $scope.tempNode.secretLevel.id,$scope.tempNode.parentList[$scope.tempNode.parentList.length-2].uid).then(function() {
					$scope.selectedNode.name = tempNode.name;
					$scope.selectedNode.secretLevel = tempNode.secretLevel.id;
					$modalInstance.close(tempNode);
				});
			};
			$scope.enterClick = function(){
				if($scope.mode == "ADD")
					$scope.saveNewNode();
				if($scope.mode == "EDIT_NAME")
					$scope.saveEditedNode();
			}

		});