angular.module('internalArchiveActionBtnModule', []);

angular.module('internalArchiveActionBtnModule').directive('internalArchiveActionBtn', [
        function() {
        return {
             restrict: 'AE',
             scope: {
                uidList: "=",
                cb: "="
             },
             templateUrl: 'app/assets/js/directives/internalArchiveActionBtn/internalArchiveActionBtnTemplate.html',
             controller: function($scope,homeSrvc ,internalArchiveActionBtnSrvc,$timeout) {


                $scope.Data={
                    isMobileView:  homeSrvc.screenSizeDetector.isMobile(),
                }

                $scope.Func = {
                    onSendClick: function (description,directiveScope) {
                        internalArchiveActionBtnSrvc.send($scope.uidList, description).then(function (res) {
                            directiveScope.description = "";
                            directiveScope.sendSucceded = true;
                            $(".successMessage").fadeIn();
                            $timeout(function () {
                                $(".successMessage").fadeOut();
                            }, 3000);
                            $scope.cb();
                        });
                    },
                    onTextAreaAdjust: function () {
                        var element = document.getElementById('textareainternalArchiveActionBtn');
                        element.style.height = "1px";
                        element.style.height = (25 + element.scrollHeight)<450 ? (25 + element.scrollHeight)+"px" : "450px";
                    }
                };
                var init = function () {
                    
                }

                init();
             }
        }
}]);





// FIXME:place these tow directive  in separate files
angular.module('internalArchiveActionBtnModule').directive('internalArchiveActionBtnModal', [
    function() {
        return {
            restrict: 'AE',
         scope: {
            uidList: "=",
            cb: "=",
            onSendClick:"&",
            onTextAreaAdjust:"&"
         },
         templateUrl: 'app/assets/js/directives/internalArchiveActionBtn/mobileView/internalArchiveActionBtnModal.html',
         controller: function($scope, $modal) {
             
             $scope.Func = {
                 onActionBtnClick:function(){
                     var modalInstance = $modal.open({
                        templateUrl : 'app/assets/js/directives/internalArchiveActionBtn/mobileView/internalArchiveActionBtnModal.modal.html',
                        controller : function($scope,$modalInstance,onTextAreaAdjust){


                            $scope.Func={
                                onTextAreaAdjust:()=>{
                                    onTextAreaAdjust({})
                                },
    
                                onCancelClick : function() {
                                    $modalInstance.dismiss();
                                },
                                onSendClick : function() {
                                    $modalInstance.close($scope.description);
                                }
                            }

                            
                        },
                        resolve:{
                            onTextAreaAdjust:()=>$scope.onTextAreaAdjust
                        },
                        size : 'sm',
                    });
                    modalInstance.result.then(function(description) {
                        $scope.onSendClick({$description:description,$directiveScope:$scope})
                    }, function() {
                    });
                }
            };
            var init = function () {
               
            }

            init();
         }
        }
    }]);
    
    
    
    angular.module('internalArchiveActionBtnModule').directive('internalArchiveActionBtnDropdown', [
        function() {
            return {
                restrict: 'AE',
                scope: {
                    uidList: "=",
                    cb: "=",
                    onSendClick:"&",
                    onTextAreaAdjust:"&"
                },
                templateUrl: 'app/assets/js/directives/internalArchiveActionBtn/desktopView/internalArchiveActionBtnDropdown.html',
                controller: function($scope) {
                    
                    $scope.Func = {
                        onSendClick: function () {
                            $scope.onSendClick({$description:$scope.description,$directiveScope:$scope})
                        },
                        onTextAreaAdjust: function () {
                            $scope.onTextAreaAdjust({});
                        }
                    };
                    var init = function () {
                        $('#internalArchiveActionBtn').bind('click', function(e) {
                            e.stopPropagation();
                        });
                    }
                    init();
                }
            }
}]);



angular.module('internalArchiveActionBtnModule').factory('internalArchiveActionBtnSrvc', function (Restangular) {
    return {
        send: function (uidList, description) {
            var _uidList = [];
            uidList.forEach(function (item) {
                _uidList.push(item.uid);
            });
            var desc = encodeURI(description);
            return Restangular.all('letter/archive?description='+desc).post(_uidList);
        }
    };
});