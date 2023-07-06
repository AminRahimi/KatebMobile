angular.module('multiselectReciever').directive('multiselectReciever', [
        /**
         * deligate from multiselect
         */
        function() {
        return {
             scope: {
                 model: "=",
                 isEditMode: "=",
                 searchFn: "&?",
                 onSelectFn: "&",
                 onRemoveFn: "&",
                 hasDescription: "=",
		initOptions:"=",
		notShowModel: "=",
             },
             templateUrl: 'app/assets/js/directives/multiselectReciever/multiselectRecieverTemplate.html?v=2',
             controller: function($scope, multiselectRecieverSrvc) {
                 $scope.model = [];
                 $scope.options = $scope.initOptions || [];
                 $scope.selectedFromModel = null;


            	 var isDuplicateModel = function(model){
            		 for ( var int = 0; int < $scope.model.length; int++) {
        						if($scope.model[int].uid == model.uid)
        							return true;
        					}
            		return false;
            	 };


                 $scope.onModelItemSelect = function (modelItem){
                     $scope.selectedFromModel = modelItem;
                 };

                 $scope.onRefresh = function (query) {
                     if(!$scope.searchFn){return false;}
                 if(query && query.length >= 2){
                     $scope.searchFn({ query: query }).then(function (response) {
                     $scope.options = response.data.originalElement;
                   });
                 }
                 };

            	 $scope.onSelect = function(item, model){
                     if(!$scope.model)
                         $scope.model = [];

                     if(!$scope.notShowModel && !isDuplicateModel(model)) {
                         $scope.model.push(model);
                         if($scope.hasDescription) {
                             model.descEditMode = true;
                         }
                     }
                     $scope.selectedItem = undefined;
                     if($scope.onSelectFn){
                        $scope.onSelectFn({item:item, model:model});
                         if($scope.hasDescription) {
                             model.descEditMode = true;
                         }
                     }
                 }

                 $scope.onOpenClick = function(index, item){
                        multiselectRecieverSrvc.getGroupMember(item.uid).then(function(response){
                            $scope.model.splice(index, 1);
                            angular.forEach(response.data.activePositionUserAssignemts, function(new_item){
                                var notAdd = false;
                                angular.forEach($scope.model, function(old_item){
                                    if(new_item.uid == old_item.uid)
                                        notAdd = true;
                                })
                                if(!notAdd){
                                    new_item.type = "INSIDE";
                                    $scope.model.push(new_item);
                                }
                            });
                        });
                 };

            	 $scope.onRemove = function(item){
            		// $scope.model.splice(index, 1);
                    $scope.model = $scope.model.filter((modelItem)=>item.uid===modelItem.uid);
                    if($scope.onRemoveFn){
                        $scope.onRemoveFn({item: item});
                    }
            	 };

                 $scope.toggleDescEditMode= function (editMode, item) {
                     if($scope.isEditMode) {
                         item.descEditMode = editMode;
                     }
                 };

                 $scope.saveDesc = function (item) {
                     if(item.descEditMode) {
                         delete item.descEditMode
                     }
                 }
             }
        }
}]);
