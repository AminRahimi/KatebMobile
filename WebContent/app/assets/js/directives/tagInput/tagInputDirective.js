angular.module('tagInputModule', []);

angular.module('tagInputModule').directive('tagInput', [
        /**
         * @memberOf tagModule
         * @ngdoc directive
         * @description set tag for entities
         * @name tagInput
         * @attr external-data data from other sources to send with tagList
         * @example
         *  <tag-input external-data=""></tag-input>
         */
        function() {
        return {
            restrict: 'AE',
             scope: {
                externalData: "=",
                 listChange: "="
             },
             templateUrl: 'app/assets/js/directives/tagInput/tagInputTemplate.html',
             controller: function($scope, $timeout, $rootScope, tagInputSrvc) {
                $scope.Data = {
                    tagList: [],
                    tags: []
                };

                $scope.Func = {
                    refreshTegList: function (searchableTag) {
                        if (searchableTag.length > 1) {
                            tagInputSrvc.getTagsList(searchableTag).then(function(response){
                                $scope.Data.tagList = response.data.originalElement;
                            });
                        }
                    },
                    onSendTagsClick: function () {
                        var sendData = {
                            letters: $scope.externalData,
                            tags:[]
                        };
                        $scope.Data.tags.forEach(function (tag) {
                            if(!_.isObject(tag)){
                                sendData.tags.push({title: tag});
                            }else{
                                sendData.tags.push(tag);
                            }
                        });
                        tagInputSrvc.sendTags(sendData).then(function (res) {
                            if(_.isFunction($scope.listChange)){
                                $scope.listChange(sendData.tags);
                            }
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