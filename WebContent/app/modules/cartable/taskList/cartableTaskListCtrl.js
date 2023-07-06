angular.module('cartableModule').controller('cartableTaskListCtrl', function ($scope, $location, $rootScope, $modal, $state,
                                   $window, modalPoolSrvc, katebSrvc, cartableSrvc, cartableKatebSrvc, Restangular,$q) {
    $scope.Data = {
        checkedItemList: [],
        checkedItemEntityUIdLis: [],
        selectedLetters: [],
    };


    $scope.Func = {

        isInFilter :function (filterName){
            return $scope.$parent.Data && $scope.$parent.Data.selectedFilter && $scope.$parent.Data.selectedFilter.cartable && $scope.$parent.Data.selectedFilter.cartable.taskType.indexOf(filterName)>-1;
        },
        readTask: function () {
            if(!$scope.Data.checkedItemList || $scope.Data.checkedItemList.length===0){
                return false;
            }
            var readAll= function (){
                var uids = $scope.Data.checkedItemList.map((task)=>task.uid);
                var readTaskPromiseList = uids.map((taskuid)=>cartableSrvc.readTask($scope.$parent.Data.selectedFilter.cartable.taskType,taskuid));
                return $q.all(readTaskPromiseList);
            };
            $scope.Func.doJobAndUpdateListAndMenu(readAll);
        },
        unreadTask: function () {

            if(!$scope.Data.checkedItemList || $scope.Data.checkedItemList.length===0){
                return false;
            }
            var unreadAll= function (){
                var uids = $scope.Data.checkedItemList.map((task)=>task.uid);
                var readTaskPromiseList = uids.map((taskuid)=>cartableSrvc.unreadTask($scope.$parent.Data.selectedFilter.cartable.taskType,taskuid));
                return $q.all(readTaskPromiseList);
            };
            $scope.Func.doJobAndUpdateListAndMenu(unreadAll);

        },
        openForwardLetterModal: function () {
            modalPoolSrvc.showModal('forwardLetters').then(function (response) {
                var data = response.data || response;
                var ids = _.map($scope.Data.checkedItemEntityUIdLis, 'uid');
                cartableKatebSrvc.forwardLetterToMultiple(katebSrvc.createArrayQueryParam('uid', ids), data).then(function () {
                    if(response.archive) {
                        cartableKatebSrvc.archiveLetter(ids).then(function () {
                            katebSrvc.showNotification('forwardSucceded');
                            cartableSrvc.publishTo("cartableListDirective", $scope.$parent.Data.selectedFilter);
                        });
                    }
                    else {
                        katebSrvc.showNotification('forwardSucceded');
                    }
                    cartableSrvc.setSelectedItems([]);
                });
            });
        },
        onRemoveLettersFromUserArchiveClick: function (){
            let uids = _.map($scope.Data.checkedItemList, 'uid');
            cartableKatebSrvc.removeFromUserArchive(uids).then(function () {
                katebSrvc.showNotification('removeLettersFromUserArchiveSuccess');
                $scope.Controller.api.listController.refreshList(true);
                cartableSrvc.setSelectedItems([]);
            });
        },
        onAddLettersToUserArchiveSuccess: function () {
            let uids = _.map($scope.Data.checkedItemEntityUIdLis, 'uid');
            cartableKatebSrvc.addToUserArchive(uids).then(function () {
                katebSrvc.showNotification('addLettersToUserArchiveSuccess');
            });
        },
        openSendLetterModal: function () {
            modalPoolSrvc.showModal('sendLetters').then(function (response) {
                var data = response.data || response;
                var ids = _.map($scope.Data.checkedItemEntityCUIdLis, 'uid');
                cartableKatebSrvc.sendLetterToMultiple(data.blankUid, katebSrvc.createArrayQueryParam('uid', ids), data).then(function () {
                    if(response.archive) {
                        cartableKatebSrvc.archiveLetter(ids).then(function () {
                            katebSrvc.showNotification('sendSucceded');
                            cartableSrvc.publishTo("cartableListDirective", $scope.$parent.Data.selectedFilter);
                        });
                    }
                    else {
                        katebSrvc.showNotification('sendSucceded');
                    }
                    cartableSrvc.setSelectedItems([]);
                });
            });
        },
        onProcessTaskClick: function (task, cartable) {
            var gotoViewer = function(){
                if (!task) {
                    return
                }
                $scope.$parent.Controller.cartableMenu.settings.taskSettings.isDisabledAddTask = false;
                
                if ($scope.Func.isInFilter('draft')) {
                    $scope.$parent.Controller.cartableMenu.settings.taskSettings.isDisabledAddTask = true;
                    $state.go('home.cartable.draft', {
                        draftUid: task.uid,
                        cartableUid:cartable.taskType,
                        filter:$scope.$parent.Data.selectedFilter ?$scope.$parent.Data.selectedFilter.filter.uid :null
                    });
                    return
                }

                var letterUid ,cartableType,userArchiveUid;
                
                if ($scope.Func.isInFilter('letter')) {
                    letterUid = task.itemUid;
                    cartableType = 'letter';

                }
                
                if($scope.Func.isInFilter('user-letter-archive')){
                    letterUid = task.letterUid;
                    cartableType = 'user-letter-archive';
                    userArchiveUid = task.uid
                }
                

                $state.go('home.cartable.letter', {
                    letterUid: letterUid,
                    userArchiveUid:userArchiveUid,
                    cartableType:cartableType,
                    cartableUid:cartable.taskType,
                    filter:$scope.$parent.Data.selectedFilter ? $scope.$parent.Data.selectedFilter.filter.uid : null
                });
            }

            gotoViewer();
            
            cartableSrvc.updateMenu();;
        },
        listDirectiveIsReady: function () {
            if ($scope.$parent.Data.selectedFilter) {
                cartableSrvc.publishTo("cartableListDirective", $scope.$parent.Data.selectedFilter);
            }
        },
        OnCheckedItemCb: function (checkedItem, isCheckedAll) {
            $scope.Data.selectedLetters = cartableSrvc.getSelectedItems();
            if (checkedItem && checkedItem.length === 1) {
                var found = false;
                angular.forEach($scope.Data.selectedLetters, function (selectedLetter, index) {
                    if (selectedLetter.uid === checkedItem[0].uid) {
                        $scope.Data.selectedLetters.splice(index, 1);
                        found = true;
                    }
                });
                if (!found) {
                    $scope.Data.selectedLetters.push(checkedItem[0]);
                }
                // if (_.includes($scope.Data.selectedLetters, checkedItem)) {
                //     _.remove($scope.Data.selectedLetters, function (letter) {
                //         return letter == checkedItem;
                //     });
                // } else {
                //     $scope.Data.selectedLetters.push(checkedItem);
                // }
            } else if (checkedItem && checkedItem.length > 1 ) {
                if (isCheckedAll) {
                    angular.forEach(checkedItem, function (item) {
                        var flag = false;
                        angular.forEach($scope.Data.selectedLetters, function (selectedLetters) {
                            if (item.uid == selectedLetters.uid) {
                                flag = true;
                            }
                        });
                        if (!flag) {
                            $scope.Data.selectedLetters.push(item);
                        }
                    });
                    // $scope.Data.selectedLetters = angular.copy(checkedItem);
                } else {
                    var removeSelectedItems = function (selectedLetters) {
                        for (var i = 0; i < selectedLetters.length; i++) {
                            var flag = false;
                            angular.forEach(checkedItem, function (item) {
                                if (selectedLetters[i].uid == item.uid) {
                                    flag = true;
                                }
                            });
                            if (flag) {
                                selectedLetters.splice(i, 1);
                                removeSelectedItems(selectedLetters);
                            }
                        }
                    };
                    removeSelectedItems($scope.Data.selectedLetters);
                    // $scope.Data.selectedLetters = [];
                }
            }
            $scope.Data.checkedItemList = [];
            $scope.Data.checkedItemEntityUIdLis = [];
            $scope.Data.checkedItemEntityCUIdLis = [];
            angular.forEach($scope.Data.selectedLetters, function (letter) {
                $scope.Data.checkedItemList.push({uid: letter.itemUid || letter.uid});
                $scope.Data.checkedItemEntityUIdLis.push({uid: letter.itemUid});
                $scope.Data.checkedItemEntityCUIdLis.push({uid: letter.content?letter.content.uid:undefined});
            });
            cartableSrvc.setSelectedItems($scope.Data.selectedLetters);
        },
        onArchiveCb: function () {
            cartableSrvc.publishTo("cartableListDirective", $scope.$parent.Data.selectedFilter);
            cartableSrvc.setSelectedItems([]);
        },
        onCheckedItemClick: function (checkedItem, e, isCheckedAll) {
            e.stopPropagation();
            cartableSrvc.onCartableListItemChecked(checkedItem, isCheckedAll);
        },
        onOpenLetterInNewTabClick: function (checkedItem, e) {
            e.stopPropagation();
            $window.open($state.href('home.cartable.letter', {
                letterUid: checkedItem.content.uid,
                cartableUid:$state.params.cartableUid,
                filter:$state.params.filter
            }), '_blank');
        },
        onFollowClick: function () {
            var follow = function (){
                var sendData = {
                    letters: $scope.Data.checkedItemList,
                    tags: [{title: "نیاز به پیگیری"}]
                };
                return cartableKatebSrvc.follow(sendData);
            };
            $scope.Func.doJobAndUpdateListAndMenu(follow);
        },
        onUnfollowClick: function () {
            var unFollow= function (){
                var sendData = {
                    letters: $scope.Data.checkedItemList,
                    tags: [{title: "نیاز به پیگیری"}]
                };
                return cartableKatebSrvc.unFollow(sendData);
            };
            $scope.Func.doJobAndUpdateListAndMenu(unFollow);
        },
        doJobAndUpdateListAndMenu: function (job){
            job().then(function (){
                cartableSrvc.setSelectedItems([]);
                $scope.Controller.api.listController.refreshList(true);
                cartableSrvc.updateMenu();
            });
        }
    };

    var getParameterByName = function(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    };

    $scope.Controller = {
        api: {
            showTaskBtnName: 'مشاهده نامه'
        },
        options: {
            customPagination: [10, 20, 50],
            'user-letter-archive': {
                searchableFieldInfo: [
                    {
                        "sortable": true,
                        "type": "timestamp",
                        "label": "تاریخ آرشیو",
                        "key": "archiveDate"
                    },
                    {
                        "sortable": false,
                        "type": "tagInput",
                        "label": "شماره",
                        "key": "number"
                    },
                    {
                        "sortable": false,
                        "type": "tagInput",
                        "label": "موضوع",
                        "key": "subject"
                    },
                    {
                        "sortable": false,
                        "type": "timestamp",
                        "label": "تاریخ رسمی",
                        "key": "officialDate"
                    },
                    {
                        "sortable": false,
                        "type": "enum",
                        "label": "نوع نامه",
                        "key": "dirType",
                        "multiple": true,
                        "itemList": [
                            {
                                "uid": "Inside",
                                "title": "داخلی"
                            }, {
                                "uid": "Incomming",
                                "title": "وارده"
                            }, {
                                "uid": "Issued", "title": "صادره"
                            }
                        ]
                    },
                    {
                        "sortable": false,
                        "type": "tagInput",
                        "label": "شماره خارجی",
                        "key": "externalNumber"
                    }],
                headers: [
                    {
                        "type": "checkbox3",
                        "label": "",
                        "sortable": false,
                        "display": true,
                        "action": $scope.Func.onCheckedItemClick
                    },
                    {
                        "key": "archiveDate"
                    },
                    {
                        "key": "number"
                    },
                    {
                        "key": "subject",
                        "width": "30%",
                        "hasTooltip": true
                    },
                    {
                        "key": "officialDate",
                        "label": "تاریخ رسمی",
                        "format": "jDD-jMMMM-jYYYY"
                    },
                    {
                        "key": "dirType"
                    },
                    {
                        "key": "externalNumber"
                    }
                ]
            },
            draft: {
                searchableFieldInfo: [/*{
                    "sortable": true,
                    "type": "timestamp",
                    "label": "تاریخ رسمی",
                    "key": "officialDate"
                },*/ {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "شماره",
                    "key": "number"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "فرستنده",
                    "key": "senderTitle"
                }, {
                    "sortable": true,
                    "type": "timestamp",
                    "label": "تاریخ رسمی",
                    "key": "modificationDate"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "موضوع",
                    "key": "subject"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "متن پیش‌نویس",
                    "key": "body"
                }],
                headers: [
                    {
                        "key": "number"
                    }, {
                        "key": "sender.title",
                        "type": "string",
                        "hasTooltip": true
                    }, {
                        "key": "subject",
                        "hasTooltip": true
                    }, {
                        "key": "modificationDate",
                        "label": "تاریخ رسمی",
                        "format": "jDD-jMMMM-jYYYY"
                    }, {
                        "key": 'sender.title',
                        "label": '',
                        "type": 'action2',
                        "actionName": 'ایجاد نامه مشابه',
                        "action": function (item, event) {
                            if (!$scope.Data.isDisableCreateSimilarLetter) {
                                $scope.Data.isDisableCreateSimilarLetter = true;
                                event.preventDefault();
                                event.stopPropagation();
                                cartableKatebSrvc.duplicateDraft($rootScope.currentUserOrg.uid, item.uid).then(function (res) {
                                    $state.go('home.cartable.draft', {draftUid: res.data.originalElement.uid});
                                    $scope.Data.isDisableCreateSimilarLetter = false;
                                }, function(err){
                                    $scope.Data.isDisableCreateSimilarLetter = false;
                                });
                            }
                            // duplicateUid param have to remove in future
                            //$state.go('home.cartable.draft', {orgUid: 'CURRENT', duplicateUid: item.uid});
                        },
                        // "isHide": function () {
                        //     return getParameterByName('filter') === 'static_cartable.letterDraft.history' || getParameterByName('filter') === 'static_cartable.letterDraft.sent';
                        // }
                    }, {
                        "key": "letterNumber",
                        "type":"string",
                        "isHide": function () {
                          return getParameterByName('filter') === 'static_cartable.letterDraft.completting' || getParameterByName('filter') === 'static_cartable.letterDraft.toOtherOrg';
                        }
                    }]
            },
            letter: {
                searchableFieldInfo: [
                    {
                        type: "multi_like",
                        label: "جستجوی سریع",
                        key: [
                            "content.subject",
                            "content.internalNumber",
                            "content.externalNumber"
                        ]
                    },
                    {
                    "sortable": true,
                    "type": "timestamp",
                    "label": "تاریخ دریافت نامه",
                    "key": "content.officialDate"
                    },
                                        {
                    "sortable": true,
                    "type": "bool",
                    "label": "ارجاع توسط شما",
                    "key": "isForwarded"
                    },
                    {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "موضوع",
                    "key": "content.subject",
                    "serverType": "string"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "شماره",
                    "key": "content.internalNumber"
                    },
                 {
                    "sortable": true,
                    "type": "timestamp",
                    "label": "تاریخ رسمی",
                    "key": "content.letterOfficialDate"
                    },
                    {
                    "sortable": true,
                    "type": "collection",
                    "label": "برچسب",
                    "key": "content.tags",
                    "getList": function(query){
                        return Restangular.all('/tag/actives').getList({query: query});
                    }
                }, {
                    "sortable": true,
                    "type": "bool",
                    "label": "فقط ویرایش شده",
                    "key": "edited",
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "فرستنده",
                    "key": "content.senderTitle",
                }, {
                    "sortable": true,
                    "type": "bool",
                    "label": "خوانده شده",
                    "key": "read"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "ارجاع‌دهنده",
                    "key": "content.forwarderTitle"
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "شماره‌خارجی",
                    "key": "content.externalNumber"
                }, {
                    "sortable": true,
                    "type": "enum",
                    "label": "محرمانگی",
                    "key": "content.confidentialityLevel",
                    "multiple": true,
                    "itemList": [{
                        "uid": "Unclassified",
                        "title": "طبقه بندی نشده"
                    }, {
                        "uid": "Restricted", "title": "محرمانه"
                    }, {
                        "uid": "Confidential",
                        "title": "فوق محرمانه"
                    }, {
                        "uid": "Secret", "title": "سری"
                    }, {
                        "uid": "Top_secret",
                        "title": "فوق سری"
                    }]
                }, {
                    "sortable": true,
                    "type": "bool",
                    "label": "پاسخ  ",
                    "key": "content.responded"
                    },
                    {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "هامش",
                    "key": "content.hamesh"
                    },
                    // {
                    // "sortable": true,
                    // "type": "timestamp",
                    // "label": "تاریخ رسمی",
                    // "key": "content.letterOfficialDate"
                    // },
                    {
                    "sortable": true,
                    "type": "bool",
                    "label": "بایگانی",
                    "key": "content.archive"
                }, {
                    "sortable": true,
                    "type": "enum",
                    "label": "فوریت",
                    "key": "content.priority",
                    "multiple": true,
                    "itemList": [{
                        "uid": "Normal",
                        "title": "عادی"
                    }, {
                        "uid": "Critical",
                        "title": "فوری"
                    }, {
                        "uid": "Blocker",
                        "title": "خیلی فوری"
                    }, {
                        "uid": "Immediate",
                        "title": "آنی"
                    }, {
                        "uid": "Unknown",
                        "title": "نامشخص"
                    }]
                }, {
                    "sortable": true,
                    "type": "enum",
                    "label": "نوع نامه",
                    "key": "content.dirType",
                    "multiple": true,
                    "itemList": [
                        {
                            "uid": "Inside",
                            "title": "داخلی"
                        }, {
                            "uid": "Incomming",
                            "title": "وارده"
                        }, {
                            "uid": "Issued", "title": "صادره"
                        }]
                }, {
                    "sortable": true,
                    "type": "tagInput",
                    "label": "گیرندگان",
                    "key": "content.deliveryTo"
                }],
                headers: [
                    {
                    "type": "checkbox3",
                    "label": "",
                    "sortable": false,
                    "display": true,
                    "action": $scope.Func.onCheckedItemClick
                },
        
                    {
                    "key": "content.internalNumber"
                    },
                    {
                        "key": "content.initiation.sender.title",
                        "hasTooltip": true
                    },
                    {
                    "key": "content.subject",
                    "width": "30%",
                    "hasTooltip": true
                    },
                    {
                        "key": "content.officialDate",
                        "label" : "تاریخ دریافت نامه",
                        "format": "jDD-jMMMM-jYYYY"
                    },
                    {
                    "key": "content.dirType"
                    },
                    {
                        "key": "content.isForwarded",
                        "label": "ارجاع توسط شما",
                        "type": "isForwarded",
                        "sortable": true,
                    },
                    {
                    "key": "content.forwarder.title"
                    },

                    {
                    "key": "content.hamesh",
                    "width": "15%",
                    "hasTooltip": true
                    },
                    {
                    "key": "content.letterOfficialDate",
                    "type": "timestamp",
                    "label": 'تاریخ رسمی',
                    "format": "jDD-jMMMM-jYYYY",
                    "width": "15%",
                    "sortable": true,
                    "hasTooltip": true,
                    "display": true,
                    
                    },
                    {
                    "key": "content.initiation.externalNumber"
                    },
               
                    {
                    "key": "content.priority"
                    },

                    {
                    "key": "content.confidentialityLevel"
                }, {
                    "key": "content.deliveryTo"
                }, {
                    "type": "link",
                    "label": "",
                    "sortable": false,
                    "display": true,
                    "action": $scope.Func.onOpenLetterInNewTabClick
                }, {
                    "key": "content.responded",
                    "type": "tag",
                    "if": "item[field.key] == false",
                    "label": "",
                    "sortable": false,
                    "display": true
                    }
                    ,
                {
                "type": "edited",
                "label": "",
                "key": "edited",
                "sortable": false,
                "display": true
                },
                {
                "type": "img",
                "label": "",
                "key": "content.attachments",
                "if": "item[field.key].length>0",
                "trueIcon": "fa fa-paperclip",
                "falseIcon": "fa",
                "sortable": false
                }, {
                    "type": "img",
                    "label": "",
                    "key": "content.forwarder",
                    "if": "item[field.key].uid",
                    "trueIcon": "fa fa-arrow-circle-left",
                    "falseIcon": "fa",
                    "sortable": false
                }]
            }
        }
    };
    $scope.$parent.Controller.cartableMenu.settings.taskSettings.isDisabledAddTask = false;

    var Run = function () {
        cartableKatebSrvc.resetOrgLetterState();
        cartableKatebSrvc.resetArchiveLetterState();
        cartableSrvc.registerOnCheckedItemCb($scope.Func.OnCheckedItemCb);
        // $location.search({page: cartableSrvc.getCurrentPage()});
    };

    Run();
});
