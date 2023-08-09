angular.module('singleSelect').directive('singleSelectList', [

    function () {
        return {
            scope: {
                model: "=",
                isEditMode: "=",
                onRefresh: "&",
                onSelect: "&",
                onRemove: "&",
                appEnumKey:"@",
                titlePropKey:"@",
                filterFn:"&",
                isTagging:"=",
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
                        $scope.onRefresh({$query:$scope.Data.query}).then((response)=>{
                            $scope.options = response.data.originalElement;
                            return response;
                        });
                    },
                    selectModel:function(item){
                        $scope.model = item;
                        if(!angular.isFunction($scope.onSelect)) return;
                        return $scope.onSelect({$item:item, $model:item})
                    },
                    onSelect: function (item) {
                        return $scope.Func.selectModel(item);
                    },
                    onRemove: function (item) {
                        $scope.model = null;
                        if(!angular.isFunction($scope.onRemove)) return;
                        
                        return $scope.onRemove()
                    },
                    onAddCustomClick: function () {
                        return $scope.Func.selectModel($scope.Data.query);
                    }
                }

            }
        }
    }]);
