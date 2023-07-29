angular.module('singleSelect').directive('singleSelectDropdown', [
        
        function() {
        return {
            scope: {
                model: "=",
                isEditMode: "=",
                onRefresh:"&",
                onSelect:"&",
                appEnumKey:"@",
                options:"="
            },
             templateUrl: 'app/assets/js/directives/singleSelect/dropDown/singleSelectDropdown.html',
             controller: function() {


             }
        }
}]);
