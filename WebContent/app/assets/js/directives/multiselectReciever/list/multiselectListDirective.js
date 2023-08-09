angular.module('multiselectReciever').directive('multiselectList', [

    function () {
        return {
            scope: {
                model: "=",
                isEditMode: "=",
                onRefresh: "&",
                onSelect: "&",
                onRemove: "&",
                options: "=",
                isTagging:"="

            },
            templateUrl: 'app/assets/js/directives/multiselectReciever/list/multiselectList.html',
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
                    }
                }

            }
        }
    }]);
