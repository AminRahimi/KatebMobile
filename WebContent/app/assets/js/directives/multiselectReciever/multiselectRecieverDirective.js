// FIXME:change this directive to general type
angular.module('multiselectReciever').directive('multiselectReciever', [

    function () {
        return {
            scope: {
                model: "=",
                isEditMode: "=",
                searchFn: "&?",
                onSelectFn: "&",
                onRemoveFn: "&",
                hasDescription: "=",
                initOptions: "=",
                notShowModel: "=",
                isTagging:"=",
                widget: "@"
            },
            templateUrl: 'app/assets/js/directives/multiselectReciever/multiselectRecieverTemplate.html?v=2',
            controller: function ($scope, $q, multiselectRecieverSrvc,$debounce) {
                $scope.model = $scope.model || [];
                $scope.options = $scope.initOptions || [];


                var isDuplicateModel = function (model) {
                    if (!$scope.model || $scope.model.length === 0) {
                        return false
                    }

                    let foundIndex = $scope.model.findIndex((item) => angular.isObject(item) ? item.uid === model.uid : item === model);
                    return foundIndex > -1;

                };

                

                let $debouncedSearchFn
                if (angular.isFunction($scope.searchFn)) {
                    $debouncedSearchFn = $debounce((query) => $scope.searchFn(query),300);
                }



                $scope.Data = {
                    selectedItem: undefined
                }



                $scope.Func = {
                    onRefresh: function (query) {
                        if (!$debouncedSearchFn) { return $q.reject(); }
                        if (query && query.length >= 2) {
                            return $debouncedSearchFn({ query: query }).then(function (response) {
                                $scope.options = response.data.originalElement;
                                return response;
                            });
                        }
                        return $q.reject();
                    },
                    onSelect: function (item, model) {
                        if (!$scope.model)
                            $scope.model = [];

                        if (!$scope.notShowModel && !isDuplicateModel(model)) {
                            $scope.model.push(model);
                            if ($scope.hasDescription) {
                                model.descEditMode = true;
                            }
                        }

                        if ($scope.onSelectFn) {
                            $scope.onSelectFn({ item: item, model: model });
                            if ($scope.hasDescription) {
                                model.descEditMode = true;
                            }
                        }
                    },
                    onOpenClick: function (index, item) {
                        multiselectRecieverSrvc.getGroupMember(item.uid).then(function (response) {
                            $scope.model.splice(index, 1);
                            angular.forEach(response.data.activePositionUserAssignemts, function (new_item) {
                                var notAdd = false;
                                angular.forEach($scope.model, function (old_item) {
                                    if (new_item.uid == old_item.uid)
                                        notAdd = true;
                                })
                                if (!notAdd) {
                                    new_item.type = "INSIDE";
                                    $scope.model.push(new_item);
                                }
                            });
                        });
                    },
                    onRemove: function (item) {
                        // $scope.model.splice(index, 1);
                        $scope.model = $scope.model.filter((modelItem) => item.uid !== modelItem.uid);
                        if ($scope.onRemoveFn) {
                            $scope.onRemoveFn({ item: item });
                        }
                    },
                    onModelItemSelect: function (item) {
                        $scope.Data.selectedItem = item;
                    }
                }


                $scope.toggleDescEditMode = function (editMode, item) {
                    if ($scope.isEditMode) {
                        item.descEditMode = editMode;
                    }
                };

                $scope.saveDesc = function (item) {
                    if (item.descEditMode) {
                        delete item.descEditMode
                    }
                }
            }
        }
    }]);


