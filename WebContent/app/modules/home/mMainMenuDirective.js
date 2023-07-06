angular.module('mMainMenu',[]).directive('mMainMenu', function () {
    return {
        restrict: 'EA',
        templateUrl: 'app/modules/home/mMainMenu.html',
        scope: {
            onMenuItemClick:"&"
        },
        controller: function ($scope,homeSrvc) {

            $scope.Data = {

            }

            $scope.Func = {
                getStateName: function (stateName){
                    return homeSrvc.getStateName(stateName);
                },
                onMenuItemClick: function(){
                    if(angular.isFunction($scope.onMenuItemClick)){
                        $scope.onMenuItemClick();
                    }
                }

            }



            var Run = function () {

                $scope.Data.headerMenuItems = homeSrvc.generateMenuData();

            };



            Run();
        },
        link: function (scope, element, attrs, ctrls) {
        }
    };
});
