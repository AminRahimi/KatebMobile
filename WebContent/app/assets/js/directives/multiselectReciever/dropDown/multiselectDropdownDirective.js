angular.module('multiselectReciever').directive('multiselectDropdown', [
        
        function() {
        return {
            scope: {
                model: "=",
                isEditMode: "=",
                onRefresh:"&",
                onSelect:"&",
                onModelItemSelect:"&",
                onRemove:"&",
                options:"="
            },
             templateUrl: 'app/assets/js/directives/multiselectReciever/dropDown/multiselectDropdown.html',
             controller: function() {


             }
        }
}]);
