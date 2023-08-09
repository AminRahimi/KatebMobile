// FIXME:change this directive to general type
angular.module('singleSelect', []).directive('singleSelect', [

    function () {
        return {
            scope: {
                model: "=",
                widget: "@",
                searchFn: "&?",
                onSelect: "&",
                onRemove: "&",
                isEditMode: "=",
                titlePropKey:"@",
                isTagging:"=",
                // FIXME:change options to initialList and place all optional inputs to option
                options: "=?",
                appEnumKey:"@"
            },
            templateUrl: 'app/assets/js/directives/singleSelect/singleSelectTemplate.html',
            controller: function ($scope,$debounce,$q,appConst) {


                let $debouncedSearchFn;
                if (angular.isFunction($scope.searchFn)) {
                    $debouncedSearchFn = $debounce((query) => $scope.searchFn(query), 300);
                }

                if($scope.appEnumKey){
                    $scope.options = Object.keys(appConst[$scope.appEnumKey]);
                }


                $scope.Func = {
                    onRefresh: function (query) {
                        if (!$debouncedSearchFn) {
                            return $q.reject();
                        }
                        if (query && query.length >= 2) {
                            return $debouncedSearchFn({ $query: query }).then(function (response) {
                                $scope.options = response.data.originalElement;
                                return response;
                            });
                        }
                        return $q.reject();
                    },
                    onSelect: function (item, model) {
                        $scope.model = item;
                        if (!angular.isFunction($scope.onSelect)) return;

                        return $scope.onSelect({$item:item, $model:model});
                    },
                    onRemove: function () {
                        $scope.model = null;
                        if (!angular.isFunction($scope.onRemove)) return;

                        return $scope.onRemove();
                    },
                    filterList:function(query,appEnumKey){

                        return function( item ) {
                            if(!query) return true
                            if(!appEnumKey) {
                                item = $scope.titlePropKey?item[$scope.titlePropKey]:item.title || item;
                                return item.includes(query)
                            }
                            return appConst[appEnumKey][item].includes(query)
                        };
                    }

                }



            }
        }

    }]);


