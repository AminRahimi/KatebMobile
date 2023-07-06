angular.module('processModule').controller('processTaskListCtrl', function ($scope, $location, $rootScope, $modal,
     $state, cartableSrvc, modalPoolSrvc, katebSrvc, processKatebSrvc,homeSrvc) {
    $scope.Data = {
        checkedItemList: [],
        checkedItemEntityUIdLis: [],
        selectedLetters: [],
        selectedFlter:null
    };

    $scope.Func = {
        isInFilter :function (filterName){
            return $state.params.cartableUid && $state.params.cartableUid.indexOf(filterName)>-1;
        },
        getStateName: function (stateName) {
            return homeSrvc.getStateName(stateName);
        },
        openForwardLetterModal: function () {
            modalPoolSrvc.showModal('forwardLetters').then(function (data) {
                var ids = _.map($scope.Data.checkedItemEntityUIdLis, 'uid');
                processKatebSrvc.forwardLetterToMultiple(katebSrvc.createArrayQueryParam('uid', ids), data).then(function (data) {
                    katebSrvc.showNotification('forwardSucceded');
                });
            });
        },
        setDraftButtonDisablity:function (disablity){
            // TODO : refactor this
            cartableSrvc.publishTo("isDisabledAddTask", disablity);
        },
        onProcessTaskClick: function (task, process) {
            if (task) {
                $scope.Func.setDraftButtonDisablity(false);
                if (process.taskType.split('_')[0] == 'bpmsProcessInstance') {
                    $state.go($scope.Func.getStateName('base.home.process.processInstanceInfo'), 
                    {
                        uid: task.uid,
                        cartableUid:process.taskType,
                        filter:$scope.Data.selectedFilter ?$scope.Data.selectedFilter.filter.uid :null
                    });
                } else {
                    $state.go($scope.Func.getStateName('base.home.process.processInfo'), 
                    {
                        uid: task.uid, 
                        mode: 'view',
                        cartableUid:process.taskType,
                        filter:$scope.Data.selectedFilter ?$scope.Data.selectedFilter.filter.uid :null
                    });
                }
            }
            cartableSrvc.publishTo("updateProcessMenu");
        },
        listDirectiveIsReady: function () {
            if ($scope.Data.selectedFilter) {
                cartableSrvc.publishTo("selectedProcessFilterChanged", $scope.Data.selectedFilter);
            }
        },
        OnCheckedItemCb: function (checkedItem) {
            if (checkedItem) {
                if (_.includes($scope.Data.selectedLetters, checkedItem)) {
                    _.remove($scope.Data.selectedLetters, function (letter) {
                        return letter == checkedItem;
                    });
                } else {
                    $scope.Data.selectedLetters.push(checkedItem);
                }
            }else{
                $scope.Data.selectedLetters = [];
                $scope.Data.checkedItemList = [];
                $scope.Data.checkedItemEntityUIdLis = [];
            }
            $scope.Data.checkedItemList = [];
            $scope.Data.checkedItemEntityUIdLis = [];
            angular.forEach($scope.Data.selectedLetters, function (letter) {
                $scope.Data.checkedItemList.push({uid: letter.content.uid});
                $scope.Data.checkedItemEntityUIdLis.push({uid: letter.itemUid});
            });
        },
        onArchiveCb: function () {
            // FIXME $parent
            cartableSrvc.publishTo("processListDirective", $scope.Data.selectedFilter);
        }
    };

    $scope.Controller = {
        api: {
            showTaskBtnName: 'مشاهده نامه'
        },
        options: {
            bpmsTask: {
                searchableFieldInfo: [{
                    "sortable": true,
                    "type": "timestamp",
                    "label": "تاریخ واگذاری",
                    "key": "createTime"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "وضعیت",
                    "key": "name"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "توضیحات",
                    "key": "description"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "کد رهگیری",
                    "key": "trackingNumber"
                }],
                headers: {
                    mobile:[
                        { "key": "name" },
                        { "key": "formData._bpmsData.processModel.title" },
                        { "key": "description", "hasTooltip": true }, 
                        {"key": "trackingNumber"}, 
                        {
                            "key": "createTime",
                            "format": "jDD-jMMMM-jYYYY (HH:mm)"
                        }, 
                        {
                            "key": "formData._bpmsData.createTime", 
                            "format": "jDD-jMMMM-jYYYY (HH:mm)"
                        }
                    ],
                    desktop:[
                        { "key": "name" },
                        { "key": "formData._bpmsData.processModel.title" },
                        { "key": "description", "hasTooltip": true }, 
                        {"key": "trackingNumber"}, 
                        {
                            "key": "createTime",
                            "format": "jDD-jMMMM-jYYYY (HH:mm)"
                        }, 
                        {
                            "key": "formData._bpmsData.createTime", 
                            "format": "jDD-jMMMM-jYYYY (HH:mm)"
                        }
                    ]
                    
                }
            },
            bpmsProcessInstance: {
                searchableFieldInfo: [{
                    "sortable": true,
                    "type": "tagInput",
                    "label": "کد رهگیری",
                    "key": "trackingNumber"
                }, {
                    "sortable": true,
                    "type": "timestamp",
                    "label": "تاریخ شروع",
                    "key": "createTime"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "عنوان",
                    "key": "title"
                }],
                headers: {
                    mobile:[
                        { "key": "formData._bpmsData.processModel.title" }, 
                        { "key": "formData.letter.title" }, 
                        { "key": "description", "hasTooltip": true }, 
                        {
                            "key": "formData._creationdDate",
                            "format": "jDD-jMMMM-jYYYY (HH:mm)"
                        }, 
                        {"key": "trackingNumber"}, 
                        {"key": "formData._bpmsData.starter.user.title"}
                    ],
                    desktop:[
                        { "key": "formData._bpmsData.processModel.title" }, 
                        { "key": "formData.letter.title" }, 
                        { "key": "description", "hasTooltip": true }, 
                        {
                            "key": "formData._creationdDate",
                            "format": "jDD-jMMMM-jYYYY (HH:mm)"
                        }, 
                        {"key": "trackingNumber"}, 
                        {"key": "formData._bpmsData.starter.user.title"}
                    ]
                    
                }
            }
        }
    }
    // $scope.$parent.Controller.processMenu.settings.taskSettings.isDisabledAddTask = false;

    var Run = function () {
        processKatebSrvc.registerOnCheckedItemCb($scope.Func.OnCheckedItemCb);



        var subId = cartableSrvc.subscribeOn("selectedProcessFilterChanged",(selectedFilter) =>{
            $scope.Data.selectedFlter = selectedFilter;
        });
        $scope.$on('$destroy',()=> {
            cartableSrvc.unSubscribeOn("selectedProcessFilterChanged", subId);
        });


        $scope.Func.setDraftButtonDisablity(false);

        // $location.search({page: processKatebSrvc.getCurrentPage()});
    };

    Run();
});