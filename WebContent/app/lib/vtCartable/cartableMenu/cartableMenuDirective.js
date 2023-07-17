angular.module('vtCartable').directive('cartableMenu',
    /**
     * @memberOf vtCartable
     * @ngdoc directive
     * @name cartableMenu
     * @param {service} cartableSrvc
     * @attr {function} on-filter-click function which returns task object on task filter click
     * @attr {object} settings object for configuration fo cartableMenu {taskSettings.btnLable:'',taskSettings.state:'',taskSettings.isDisabledAddTask:boolean}
     * @example
     *  Usage:
     *      <cartable-list settings="" on-filter-click=""></cartable-list>
     */
    function () {
        return {
            restrict: 'EAC',
            templateUrl: 'app/lib/vtCartable/cartableMenu/cartableMenuTemplate.html',
            scope: {
                onFilterClick: "=",
                onFilterAllLetterClick:"&",
                onBtnsClick:"&",
                settings: "=",
                type: "@",
                options:'=?'
            },
            controller: function ($scope, $state, $location, cartableSrvc,CARTABLE_CONFIG,$element,homeSrvc) {
                $scope.settings = !_.isEmpty($scope.settings) ? $scope.settings : {taskSettings: {}};
                $scope.config = {
                    isDisabledAddTask: ($scope.settings.taskSettings && $scope.settings.taskSettings.isDisabledAddTask === false) ? $scope.settings.taskSettings.isDisabledAddTask : true,
                    addTaskBtnState: $scope.settings.taskSettings.state || $scope.Func.getStateName('base.home.cartable.cartableList'),
                    addTaskBtnLabel: $scope.settings.taskSettings.btnLable || 'لیست کارتابل',
                    addTaskBtnIcon: $scope.settings.taskSettings.btnIcon || 'flaticon-pencil-and-paper',
                    extraBtns: _.isArray($scope.settings.taskSettings.extraBtns) ? $scope.settings.taskSettings.extraBtns : undefined
                };

                // $(".panel-cartable-menu").niceScroll(CARTABLE_CONFIG.niceScrollMenuConfig ? CARTABLE_CONFIG.niceScrollMenuConfig : {
                //     cursorcolor: "#048EA0", // change cursor color in hex
                //     cursoropacitymin: 0.5, // change opacity when cursor is inactive (scrollabar "hidden" state), range from 1 to 0
                //     cursoropacitymax: 1, // change opacity when cursor is active (scrollabar "visible" state), range from 1 to 0
                //     cursorwidth: "8px",
                //     cursorborderradius: "0",
                //     railalign: "left"
                // });
                $scope.Data = {
                    status: {
                        open: true,
                    }
                };


                var findFilterCartableInCartableList = function(catableUid,filterUid,cartableList){
                    let foundCartable = cartableList.find((_cartable)=>_cartable.taskType === catableUid);
                    if(!foundCartable){
                        return {
                            filter: null,
                            cartable: null
                        } 
                    }
                    let foundFilter = foundCartable.filters.find((_filter)=>_filter.uid===filterUid);
                    return {
                        filter: foundFilter,
                        cartable: foundCartable
                    }
                }

                $scope.Func = {
                    // toggleCollapseMenu:function (){
                    //
                    //     $element[0].querySelector('.panel-cartable-menu').classList.toggle('open');
                    // },
                    // onToggleMenuClick:function (){
                    //     $scope.Func.toggleCollapseMenu();
                    // },
                    getStateName: function (stateName) {
                        return homeSrvc.getStateName(stateName);
                    },
                    getCartableList: function () {
                        if ($state.current.name !== $scope.Func.getStateName("base.home.secretariat.orgLetterList")) {
                            cartableSrvc.getCartableList($scope.type).then(function (response) {
                                $scope.Data.cartableList = response.data;
                                var validUid,
                                    urlFilter = $state.params.filter;
                                if (urlFilter) {
                                    updateCartableListWithFilter()
                                }
                                if (!urlFilter && !validUid && (!$scope.options || !$scope.options.dontSelectDefaultCartable)) {
                                    updateCartableListWithoutFilter();
                                }
                                function updateCartableListWithFilter() {

                                    let {cartable,filter} = findFilterCartableInCartableList($state.params.cartableUid,urlFilter,$scope.Data.cartableList);
                                    if(filter){
                                        cartable.open = true;
                                        validUid = true;
                                        $scope.Func.onFilterClick(cartable, filter);
                                    }

                                }

                                function updateCartableListWithoutFilter() {
                                    var cartable, filter;
                                    for (var int = 0; int < $scope.Data.cartableList.length; int++) {
                                        for (var jnt = 0; jnt < $scope.Data.cartableList[int].filters.length; jnt++) {
                                            if ($scope.Data.cartableList[int].filters[jnt]['default']) {
                                                if (!cartable) {
                                                    cartable = $scope.Data.cartableList[int];
                                                    filter = $scope.Data.cartableList[int].filters[jnt];
                                                }
                                            }
                                        }
                                        $scope.Data.cartableList[int].open = true;
                                    }
                                    if(cartable && filter){

                                        $scope.Func.onFilterClick(cartable, filter);
                                    }
                                }
                            });
                        }
                    },

                    onFilterClick: function (cartable, filter) {
                        cartableSrvc.setSelectedItems([]);
                        if ($scope.Data.prevMenu)
                            $scope.Data.prevMenu.active = false;
                        filter.active = true;
                        $scope.Data.prevMenu = filter;
                        $scope.Data.selectedCartable = cartable;
                        $scope.Data.selectedFilter = filter;
                        $scope.onFilterClick({cartable: cartable, filter: filter});
                        // $scope.Func.toggleCollapseMenu();
                    },
                    onFilterAllLetterClick: function (filter) {
                        if ($scope.Data.prevMenu)
                            $scope.Data.prevMenu.active = false;
                        filter.active = true;
                        $scope.Data.prevMenu = filter;
                        $scope.Data.selectedFilter = filter;

                        if(angular.isFunction($scope.onFilterAllLetterClick)){

                            $scope.onFilterAllLetterClick()
                        }
                        // $scope.Func.toggleCollapseMenu();
                    },
                    updateMenu: function () {
                        if ($state.current.name !== $scope.Func.getStateName("base.home.secretariat.orgLetterList")) {
                            cartableSrvc.getCartableList($scope.type).then(function (response) {
                                $scope.Data.cartableList = response.data;
                                for (var int = 0; int < $scope.Data.cartableList.length; int++) {
                                    $scope.Data.cartableList[int].open = true;
                                    for (var jnt = 0; jnt < $scope.Data.cartableList[int].filters.length; jnt++) {
                                        if ($scope.Data.selectedFilter) {
                                            if ($scope.Data.selectedFilter.uid == $scope.Data.cartableList[int].filters[jnt].uid) {
                                                $scope.Data.cartableList[int].filters[jnt].active = true;
                                            }
                                        }

                                    }
                                }
                            });
                        }
                    }
                };



                var Run = function () {
                $scope.Func.getCartableList();


                    // If device is mobile
                    // Generate header menu items here
                    if(homeSrvc.screenSizeDetector.isSmall || homeSrvc.screenSizeDetector.isExtraSmall){

                        $scope.Data.headerMenuItems = homeSrvc.generateMenuData();

                        // homeSrvc.generateMenuDataWithDynamicChildItems().then(function (headerMenuItems){
                        //     $scope.Data.headerMenuItems = headerMenuItems;
                        // });
                    }


                    // FIXME: handle process menu and cartable menu needs!
                    if($scope.type==='CARTABLE'){
                        var subId = cartableSrvc.subscribeOn("updateCartableMenu", $scope.Func.updateMenu);
                        $scope.$on('$destroy',()=> {
                            cartableSrvc.unSubscribeOn("updateCartableMenu", subId);
                        });
                    }else if($scope.type==='PROCESS'){
                        var subId = cartableSrvc.subscribeOn("updateProcessMenu", $scope.Func.updateMenu);
                        $scope.$on('$destroy',()=> {
                            cartableSrvc.unSubscribeOn("updateProcessMenu", subId);
                        });
                    }
                    


                };



                Run();
            },
            link: function (scope, element, attrs, ctrls) {
            }
        };
    });
