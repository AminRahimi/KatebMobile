angular.module('vtMessageShower', ['toaster'])
    .factory('vtShowMessageSrvc', ['toaster', function(toaster) {
       var callbackFn=null;
        return {
            showMassage: function(type, title, body, timeout, bodyOutputType, clickHandler) {
                toaster.pop(type, title, body, timeout, bodyOutputType, clickHandler);
            },
           showLoadingDialog:function(){
               callbackFn(true);
           },
           hideLoadingDialog:function(){
               callbackFn(false);
           },
           registerToggleFunction:function(_callbackFn){
               callbackFn=_callbackFn;
           }
        }
    }])
    .directive("vtShowMessage", function() {
        return {
            restrict: 'EA',
           scope : true,
           controller : function($scope,vtShowMessageSrvc) {
               $scope.isWaiting=false;
               vtShowMessageSrvc.registerToggleFunction(function(isShow){
                   $scope.isWaiting=isShow;
               });
           },
            template: "<toaster-container toaster-options=\"{'position-class': 'toast-top-center'}\"></toaster-container>" +
                "<div class=\"waiting-dialog\" ng-show=\"isWaiting\"> لطفا منتظر بمانید...<div class=\"progress progress-bar-warning progress-striped active\">" +
                "<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>" +
                "</div>" +
                "</div>"
        }
    });