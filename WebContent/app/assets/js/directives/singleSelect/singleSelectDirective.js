// FIXME:change this directive to general type
angular.module('singleSelect', []).directive('singleSelect', [

    function () {
        return {
            scope: {
                model: "=",
                widget: "@",
                searchFn: "&?",
                onSelect: "&",
                isEditMode: "=",
                titlePropKey:"@",
                // FIXME:change options to initialList and place all optional inputs to option
                options: "=",
                appEnumKey:"@"
            },
            templateUrl: 'app/assets/js/directives/singleSelect/singleSelectTemplate.html',
            controller: function ($scope,$debounce,$q) {


                let $debouncedSearchFn;
                if (angular.isFunction($scope.searchFn)) {
                    $debouncedSearchFn = $debounce((query) => $scope.searchFn(query), 300);
                }


                $scope.Func = {
                    onRefresh: function (query) {
                        if (!$debouncedSearchFn) {
                            return $q.reject();
                        }
                        if (query && query.length >= 2) {
                            return $debouncedSearchFn({ query: query }).then(function (response) {
                                $scope.options = response.data.originalElement;
                                return $scope.options;
                            });
                        }
                        return $q.reject();
                    },
                    onSelect: function (item, model) {
                        $scope.model = item;
                        if (!angular.isFunction($scope.onSelect)) return;

                        return $scope.onSelect({$item:item, $model:model});
                    }

                }



            }
        }

    }]);


