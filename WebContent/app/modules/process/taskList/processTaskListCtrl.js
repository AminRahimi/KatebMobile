angular.module('processModule').controller('processTaskListCtrl', function ($scope, $location, $rootScope, $modal, $state, cartableSrvc, modalPoolSrvc, katebSrvc, processKatebSrvc) {
    $scope.Data = {
        checkedItemList: [],
        checkedItemEntityUIdLis: [],
        selectedLetters: []
    };

    $scope.Func = {
        openForwardLetterModal: function () {
            modalPoolSrvc.showModal('forwardLetters').then(function (data) {
                var ids = _.map($scope.Data.checkedItemEntityUIdLis, 'uid');
                processKatebSrvc.forwardLetterToMultiple(katebSrvc.createArrayQueryParam('uid', ids), data).then(function (data) {
                    katebSrvc.showNotification('forwardSucceded');
                });
            });
        },
        onProcessTaskClick: function (task, process) {
            if (task) {
                $scope.$parent.Controller.processMenu.settings.taskSettings.isDisabledAddTask = true;
                if (process.taskType.split('_')[0] == 'bpmsProcessInstance') {
                    $state.go('home.process.processInstanceInfo', {uid: task.uid});
                } else {
                    $state.go('home.process.processInfo', {uid: task.uid, mode: 'view'});
                }
            }
            cartableSrvc.publishTo("processMenuDirective");
        },
        listDirectiveIsReady: function () {
            if ($scope.$parent.Data.selectedFilter) {
                cartableSrvc.publishTo("cartableListDirective", $scope.$parent.Data.selectedFilter);
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
            cartableSrvc.publishTo("processListDirective", $scope.$parent.Data.selectedFilter);
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
                headers: [{ "key": "name" }, { "key": "formData._bpmsData.processModel.title" }, { "key": "description", "hasTooltip": true }, {"key": "trackingNumber"}, {
                    "key": "createTime",
                    "format": "jDD-jMMMM-jYYYY (HH:mm)"
                }, {"key": "formData._bpmsData.createTime", "format": "jDD-jMMMM-jYYYY (HH:mm)"}]
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
                headers: [{ "key": "formData._bpmsData.processModel.title" }, { "key": "formData.letter.title" }, { "key": "description", "hasTooltip": true }, {
                    "key": "formData._creationdDate",
                    "format": "jDD-jMMMM-jYYYY (HH:mm)"
                }, {"key": "trackingNumber"}, {"key": "formData._bpmsData.starter.user.title"}]
            }
        }
    }
    $scope.$parent.Controller.processMenu.settings.taskSettings.isDisabledAddTask = false;

    var Run = function () {
        processKatebSrvc.registerOnCheckedItemCb($scope.Func.OnCheckedItemCb);
        // $location.search({page: processKatebSrvc.getCurrentPage()});
    };

    Run();
});