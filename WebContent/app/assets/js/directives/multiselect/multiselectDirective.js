angular.module('multiselect', []);

angular.module('multiselect').directive('multiselect', [
        /**
         * @memberOf multiselect
         * @ngdoc directive
         * @description multiple selection of a list with client search 
         * @name multiselect
         * @attr {array} model
         * @attr {array} options
         * @attr {boolean} is-edit-mode
         * @attr {object} api methods: onSelect, onRemove
         * @example
         *  <multiselect model=[] options=[] is-edit-mode="" api=""></multiselect>
         */
        function() {
        return {
             scope: {
                 model: "=",
                 options: "=",
                 isEditMode: "=",
                 api: "=",
                 placeholder:"=?"
             },
             templateUrl: 'app/assets/js/directives/multiselect/multiselectTemplate.html?v=2',
             controller: function($scope) {
                 
            	 var isDuplicateModel = function(model){
            		 for ( var int = 0; int < $scope.model.length; int++) {
						if($scope.model[int].uid == model.uid)
							return true;
					}
            		return false;
            	 }
            	 
            	 $scope.onSelect = function(item, model){
                     if(!$scope.model)
                         $scope.model = [];
                     
                     if(!isDuplicateModel(model))
                         $scope.model.push(model);
                     $scope.selectedItem = undefined;
                     if($scope.api && _.isFunction($scope.api.onSelect)){
                        $scope.api.onSelect(item);
                     }
            	 }

                 $scope.onRemove = function(index, item){
            		$scope.model.splice(index, 1);
                    if($scope.api && _.isFunction($scope.api.onRemove)){
                        $scope.api.onRemove(item);
                    }
            	 }
            	 
             }
        }
}]);