angular.module('HomeModule').controller('mobileHomeCtrl', 
    function ($scope) {

        $scope.Data = {
            
        };

        


        $scope.Func = {
            closeMenu: function(){
                document.querySelector('.m-main-menu').classList.remove('open');
            },
            toggleCollapseMenu: function (){

                document.querySelector('.m-main-menu').classList.toggle('open');
            },
            onToggleMenuClick: function (){
                $scope.Func.toggleCollapseMenu();
            },
            onMenuItemClick: function () {
                $scope.Func.closeMenu();
            }
           
        };
        

    });
