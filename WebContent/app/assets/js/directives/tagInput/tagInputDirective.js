angular.module('tagInputModule', []);

angular.module('tagInputModule').directive('tagInput', [
        function() {
        return {
            restrict: 'AE',
             scope: {
                externalData: "=",
                 listChange: "="
             },
             templateUrl: 'app/assets/js/directives/tagInput/tagInputTemplate.html',
             controller: function($scope, tagInputSrvc,homeSrvc ) {
                $scope.Data = {
                    isMobileView:  homeSrvc.screenSizeDetector.isMobile(),
                };

                $scope.Func = {
                    refreshTegList: function (searchableTag) {
                        if (searchableTag.length > 1) {
                            return tagInputSrvc.getTagsList(searchableTag).then(function(response){
                                // $scope.Data.tagList = response.data.originalElement;
                                return response
                            });
                        }
                    },
                    onSendTagsClick: function (tags) {
                        var sendData = {
                            letters: $scope.externalData,
                            tags:[]
                        };
                        tags.forEach(function (tag) {
                            if(!_.isObject(tag)){
                                sendData.tags.push({title: tag});
                            }else{
                                sendData.tags.push(tag);
                            }
                        });
                        return tagInputSrvc.sendTags(sendData).then(function (res) {
                            if(_.isFunction($scope.listChange)){
                                $scope.listChange(sendData.tags);
                            }
                            // $scope.Data.tags = [];
                        });
                    }
                };
                var init = function () {
                    $('#tagInputDropDown').bind('click', function(e) {
                        e.stopPropagation();
                    });
                };

                init();
             }
        }
}]);



// FIXME:place to separate files
angular.module('tagInputModule').directive('tagInputModal', [
    function() {
    return {
        restrict: 'AE',
         scope: {
            externalData: "=",
             listChange: "=",
             refreshTegList:"&",
             onSendTagsClick:"&"
         },
         templateUrl: 'app/assets/js/directives/tagInput/modalView/tagInputModal.html',
         controller: function($scope,$modal) {
            $scope.Data = {
                
            };

            $scope.Func = {
                onActionBtnClick:function(){
                    var modalInstance = $modal.open({
                       templateUrl : 'app/assets/js/directives/tagInput/modalView/tagInputModal.modal.html',
                       controller : function($scope,$modalInstance,refreshTegList){


                        $scope.Func={
                            refreshTegList:function(query){
                                return refreshTegList({$query:query});
                            },
                            onCancelClick : function() {
                                $modalInstance.dismiss();
                            },
                            onSendClick : function() {
                                $modalInstance.close($scope.Data.tags);
                            }
                        }
                           
                       },
                       resolve:{
                            refreshTegList:()=>$scope.refreshTegList,
                       },
                       size : 'sm',
                   });
                   modalInstance.result.then(function(tags) {
                       $scope.onSendTagsClick({$tags:tags})
                   }, function() {
                   });
               }
           };
            var init = function () {
                
            };

            init();
         }
    }
}]);


angular.module('tagInputModule').directive('tagInputDropdown', [
    function() {
    return {
        restrict: 'AE',
         scope: {
            externalData: "=",
             listChange: "=",
             refreshTegList:"&",
             onSendTagsClick:"&"
         },
         templateUrl: 'app/assets/js/directives/tagInput/dropdownView/tagInputDropdown.html',
         controller: function($scope) {
            $scope.Data = {
                tagList: [],
                tags: []
            };

            $scope.Func = {
                refreshTegList: function (searchableTag) {
                    if (searchableTag.length > 1) {
                        return $scope.refreshTegList({$query:searchableTag})
                    }
                },
                onSendTagsClick: function () {

                    $scope.onSendTagsClick({$tags:$scope.Data.tags}).then(()=>{
                        $scope.Data.tags = [];
                    });

                }
            };
            var init = function () {
                $('#tagInputDropDown').bind('click', function(e) {
                    e.stopPropagation();
                });
            };

            init();
         }
    }
}]);








angular.module('tagInputModule').factory('tagInputSrvc', function (Restangular) {
    return {
        getTagsList: function (searchableTag) {
            var param = {
                query: searchableTag
            }
            return Restangular.all('/tag/actives').getList(param);
        },
        sendTags: function (data) {
            return Restangular.all('letter/add_tags/').post(data);
        }
    };
});