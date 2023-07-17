angular.module('vtTypeahead', []);

angular.module('vtTypeahead').directive('vtTypeahead', [
        function() {
        return {
             scope: {
                 model: "=",
                 isEditMode: "=",
                 selectionMode:"@",
                 api: "="
             },
             templateUrl: 'app/assets/js/directives/typeahead/typeaheadTemplate.html',
             controller: function($scope, Restangular) {
                 $scope.isMulti = false;
                 if(!$scope.selectionMode)
                 {
                     $scope.selectionMode = "multiple";
                     $scope.isMulti = true;
                 }
                 if($scope.selectionMode == "multiple"){
                     $scope.isMulti = true;
                 }


                 if(!$scope.api)
                    return;

            	 var isDuplicateModel = function(model){
                     for ( var int = 0; int < $scope.model.length; int++) {
                        if($scope.model[int].uid == model.uid)
                            return true;
                    }
                    return false;
                 };


            	 $scope.onSelect = function(item, model){
                        $scope.asyncSelected = "";
                     //console.log($scope.selectionMode);
                     if($scope.selectionMode =="multiple"){
                         if(!$scope.model)
                             $scope.model = [];
                         if(!isDuplicateModel(item))
                             $scope.model.push(Restangular.stripRestangular(item));
                         //$scope.selectedItem = undefined;
                         if(_.isFunction($scope.api.onSelect)){
                            $scope.api.onSelect(item);
                         }
                     }
                     else if($scope.selectionMode =="single"){
                         if(!$scope.model)
                         $scope.model = {};
                         $scope.model = Restangular.stripRestangular(item);
                         if(_.isFunction($scope.api.onSelect)){
                             $scope.api.onSelect(item);
                         }
                     }
                     else console.log("Invalid Typeahead selectionmode input");
                 };
            	 
            	 $scope.onRemove = function(index, item){
                     if($scope.selectionMode =="multiple"){
                     $scope.model.splice(index, 1);
                    if(_.isFunction($scope.api.onRemove)){
                        $scope.api.onRemove(item);
                    }}
                     else{
                         $scope.model = {};
                     }
            	 };
                 $scope.onSelectedItemClick = function (item, index) {
                     if($scope.selectionMode =="multiple"){
                     if(_.isFunction($scope.api.onSelectedItemClick)){
                         if (item.type == "GROUP") {
                             $scope.model.splice(index, 1);
                         }
                         $scope.api.onSelectedItemClick(item).then(function (res) {
                         });
                     }}
                     else{
                         if(_.isFunction($scope.api.onSelectedItemClick)){
                             $scope.api.onSelectedItemClick(item).then(function (res) {
                             });
                         }
                     }
                 };
                 $scope.getItemList = function (query) {
                    return $scope.api.getList(query).then(function (res) {
                        return res.data;
                    });
                 };

                 var onInit = function () {
                     $('.vtTypeadheadDropDown').bind('click', function(e) {
                         e.stopPropagation();
                     });
                 };

                 onInit();
             }
        }
}]);