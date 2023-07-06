angular.module('vtDropdownTaginputDirective', []);

angular.module('vtDropdownTaginputDirective').directive('vtDropdownTaginput', [
        /**
         * @memberOf vtDropdownTaginput
         * @ngdoc directive
         * @description multiple selection of a list with client search
         * @name vtDropdownTaginput
         * @attr {array} model
         * @attr {array} options
         * @attr {boolean} is-edit-mode
         * @example
         *  <vt-dropdown-taginput model=[] options=[] is-edit-mode="" api=""></vt-dropdown-taginput>
         */
        function() {
        return {
             scope: {
                 model: "=",
                 isEditMode: "=",
                 api: "="
             },
             templateUrl: 'app/assets/js/directives/vtCartableSearch/vtDropdownTaginput/vtDropdownTaginputTemplate.html',
             controller: function($scope) {
                 if(!$scope.api)
                    return;

                 $scope.model = $scope.model || [];
                 $scope.Data = {
                     selectedModel: $scope.model
                 };

                 $scope.onSelect = function (x, y) {
                     $scope.model = $scope.Data.selectedModel;
                 };

                 var onInit = function () {
                     $('.vtDropDownTagInput').bind('click', function(e) {
                         e.stopPropagation();
                     });
                 };
                 onInit();
             }
        }
}]);