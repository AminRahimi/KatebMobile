angular.module('singleSelect').directive('singleSelectList', [

    function () {
        return {
            scope: {
                model: "=",
                isEditMode: "=",
                onRefresh: "&",
                onSelect: "&",
                appEnumKey:"@",
                titlePropKey:"@",
                // FIXME:change options to initialList and place all optional inputs to option
                options: "="
            },
            templateUrl: 'app/assets/js/directives/singleSelect/list/singleSelectList.html',
            controller: function ($scope, $q) {

                $scope.Data = {
                    query:''
                }


                $scope.Func = {
                    onQueryChange: () => {
                        if(!angular.isFunction($scope.onRefresh)) return 
                        $scope.onRefresh({$query:$scope.Data.query}).then((options)=>{
                            $scope.options = options
                        });
                    },
                    onSelect: function (item) {
                        $scope.model = item;
                        if(!angular.isFunction($scope.onSelect)) return;
                        
                        return $scope.onSelect({$item:item, $model:item})
                    }
                }

            }
        }
    }]);
