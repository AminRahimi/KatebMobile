angular.module('cartableModule').controller('cartableCtrl', function ($scope, $state, $rootScope, cartableSrvc) {

    $scope.Data = {};

    $scope.Func = {
        cartableListMenuIndermidiariFn: function(cartableFilterObj) {
            cartableSrvc.onCartableListItemChecked(null);
            // if($state.current.name !== "home.cartable.letter" && $state.current.name !== "home.cartable.orgLetter"){
            //     $state.go('home.cartable.cartableList');
            // }
            $state.go('home.cartable.cartableList',{cartableUid:cartableFilterObj.cartable.taskType});
            cartableSrvc.publishTo("cartableListDirective",cartableFilterObj);
            $scope.Data.selectedFilter = cartableFilterObj;
        }
    }

    $scope.Controller = { 
        cartableMenu: {
            settings: {
                taskSettings: {
                    isDisabledAddTask: false,
                    state: 'home.cartable.draft({orgUid: "CURRENT"})',
                    btnLable: 'ارسال پیش نویس',
                    extraBtns: [{
                        btnState: 'home.cartable.draft({orgUid: "EXTERNAL"})',
                        btnLabel: 'ارسال پیشنویس بین سازمانی',
                        feature: 'SEND_DRAFT_TO_OTHER_ORG',
                        btnIcon: 'flaticon-pencil-and-paper'
                    }]
                },
                customCartable: {
                    title: 'همه نامه‌ها',
                    list: [{
                        title: 'همه نامه‌ها',
                        uiSref: 'home.cartable.orgLetterList'
                    },{
                        title: 'نامه های آرشیو شده',
                        uiSref: 'home.cartable.archiveLetterList'
                    }]
                }
            }
        }
    };



    // var Run = function () {
    // }

    // Run();
});