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
             scope: {
                externalData: "="
             },
             templateUrl: 'app/assets/js/directives/tagInput/tagInputTemplate.html',
             controller: function($scope, $timeout, $rootScope, tagInputSrvc) {
                $scope.Data = {
                    tagList: [],
                    tags: []
                }

                $scope.Func = {
                    getTagList: function () {
                        tagInputSrvc.getTagsList($rootScope.currentUserOrg.uid).then(function(response){
                            $scope.Data.tagList = response.data.originalElement;
                        });
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
                            $scope.Data.tags = [];
                        });
                    }
                };
                var init = function () {
                    $('#tagInputDropDown').bind('click', function(e) {
                        e.stopPropagation();
                    });
                    $scope.Func.getTagList();
                }

                init();
             }
        }
}]);

angular.module('tagInputModule').factory('tagInputSrvc', function (Restangular) {
    return {
        getTagsList: function (orgUid) {
            return Restangular.all('/org/' + orgUid +'/public_tag/items').getList();
        },
        sendTags: function (data) {
            return Restangular.all('letter/add_tags/').post(data);
        }
    };
});