angular.module('labelChooser', []).directive('labelChooser', function(){
    return {
        restrict : 'EAC',
        templateUrl: 'app/assets/js/directives/labelChooser/labelChooserTemplate.html',
        scope: {
            model : '=',
            docUid: '=',
            docUids: '=',
            label: '=',
            onUpdate: '='
        },
        controller: function($scope, $timeout, labelChooserSrvc) {
            $scope.Data = {
                labelsSearch : [],
                typeModel: null
            };

            $scope.Func = {
                onSelect : function(item, model, label, event) {
                    $scope.Data.typeModel = '';
                    if (!$scope.model) {
                        $scope.model = []
                    }
                    var flag = true;
                    angular.forEach($scope.model, function (model) {
                        if(model.uid === item.uid){
                            flag = false;
                        }
                    });
                    if(flag) {
                        // if($scope.docUid) {
                        //     labelChooserSrvc.addLabel($scope.docUid, item.uid).then(function () {
                        //         $scope.model.push(item);
                        //         $scope.onUpdate();
                        //     });
                        // } else if($scope.docUids){
                        //     labelChooserSrvc.addLabels($scope.docUids, [item.uid]).then(function () {
                        //         $scope.model.push(item);
                        //         $scope.onUpdate();
                        //     });
                        // } else {
                            $scope.model.push(item);
                        //}
                    }
                },
                onRemove: function(label, index, event){
                    event.stopPropagation();
                    // if($scope.docUid) {
                    //     labelChooserSrvc.deleteLabel($scope.docUid, label.uid).then(function () {
                    //         $scope.model.splice(index, 1);
                    //         $scope.onUpdate();
                    //     });
                    // } else {
                        $scope.model.splice(index, 1);
                    //}

                },
                onSearch: function(query) {
                    return labelChooserSrvc.searchLabels(query).then(function (res) {
                        $scope.Data.labelsSearch = res.data.originalElement;
                        if (angular.isArray($scope.model) && $scope.model.length > 0 && $scope.Data.labelsSearch.length > 0) {
                            angular.forEach($scope.model, function (model) {
                                angular.forEach($scope.Data.labelsSearch, function (tag, index) {
                                    if (model.uid === tag.uid) {
                                        $scope.Data.labelsSearch.splice(index, 1);
                                    }
                                })
                            });
                            return $scope.Data.labelsSearch;
                        } else {
                            return $scope.Data.labelsSearch;
                        }
                    });
                }
            };
        }
    }
}).factory('labelChooserSrvc', function(Restangular) {
    return {
        searchLabels: function (query) {
            return Restangular.one('ganjeh/searchLabels').get({
            //return Restangular.one('../../Ganjeh/api/label/items/applicable').get({
                query: query
            });
        },
        // addLabel: function (docUid, labelUid) {
        //     return Restangular.all('cnode/items/' + docUid + '/label/' + labelUid).post();
        // },
        // addLabels: function (docUids, labelUids) {
        //     return Restangular.all('cnode/items/addLabels').post({
        //         cnodeUIDs: docUids,
        //         labelUIDs: labelUids,
        //     });
        // },
        // deleteLabel: function(docUid, labelUid) {
        //     return Restangular.one('cnode/items/' + docUid + '/label/' + labelUid).remove();
        // },
    }
});
