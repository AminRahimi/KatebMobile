angular.module('intelcartableModule').controller('intelcartableCtrl', function ($scope, $rootScope, cartableKatebSrvc, intelcartableSrvc, katebSrvc) {

        $scope.isDisableOnDubClick = false;
        $scope.Data = {
            newOrganizationUid: "CURRENT",
            checkboxReferenceTo: false,
            positionList: [],
            tagList: [],
            letterFilters: [],
            actions: [],
            selected: {},
            onAddFilterClick: false,
            isAddfilterClicked:false,
            andFilters: true,
            ononAddFilterClickList:false,
            letterFieldList: [
                {
                    title: 'موضوع نامه',
                    value: 'SUBJECT'
                },{
                    title: 'شماره نامه',
                    value: 'LETTER_NUMBER'
                },{
                    title: 'متن نامه',
                    value: 'BODY'
                },{
                    title: 'فوریت نامه',
                    value: 'PRIORITY'
                },{
                    title: 'سطح محرمانگی',
                    value: 'CONFIDENTIALITY_LEVEL'
                },{
                    title: 'فرستنده',
                    value: 'SENDER'
                },
            ],
            operatorList: [
                {
                    title: 'شامل',
                    value: 'CONTAINS'
                },{
                    title: 'برابر است با',
                    value: 'EQUALS'
                },{
                    title: 'شروع با',
                    value: 'STARTS_WITH'
                },{
                    title: 'خاتمه با',
                    value: 'ENDS_WITH'
                }
            ],
        };

    $scope.Func = {
        onSelectFilter: function (uid) {
            intelcartableSrvc.getIntelcartableFilter(uid).then(function (response) {
                $scope.Data.selectedIntelcartable = response.data.originalElement;
                $scope.Data.selectedIntelcartable.sender
                $scope.Data.mode = 'view';
                $scope.Data.selected = null;
                $scope.Data.letterFilters = $scope.Data.selectedIntelcartable.letterFilters;
                $scope.Data.actions = $scope.Data.selectedIntelcartable.actions;
                angular.forEach($scope.Data.selectedIntelcartable.actions, function (action , index) {
                action.referenceTo = $scope.Data.referenceTo;
                delete action.uid;
                delete action.preparedResponse;
                switch (action.name) {
                    case 'SEND_TO_ARCHIVE': 
                        $scope.Data.selectedIntelcartable.sendToArchive = true;
                        delete action.referenceTo;
                        delete action.hamesh;
                        delete action.tags;
                        break;
                    case 'ADD_NEED_TO_TRACK': 
                        $scope.Data.selectedIntelcartable.needToTrack = true;
                        delete action.referenceTo;
                        delete action.hamesh;
                        delete action.tags;
                        break;
                    case 'FORWARD_TO_ANOTHER_POSITION' : 
                        $scope.Data.selectedIntelcartable.checkboxReferenceTo = true;
                        $scope.Data.checkboxHamesh = true;
                        $scope.Data.referenceTo = response.data.actions[index].referenceTo;
                        $scope.Data.selectedIntelcartable.hamesh = action.hamesh;
                        delete action.tags;
                        break;
                    case 'ADD_TAG' : 
                        $scope.Data.selectedIntelcartable.addTags = true;
                        $scope.Data.checkboxAddTags = true;
                        $scope.Data.tags = action.tags;
                        delete action.referenceTo;
                        delete action.hamesh;
                        break;   
                    }
                })
                angular.forEach($scope.Data.selectedIntelcartable.letterFilters, function (filter) {
                    delete filter.uid;
                    if (filter.field == 'SENDER') {
                        $scope.Data.selectedIntelcartable.sender = filter
                    }else if (filter.field != 'SENDER') {
                            delete filter.sender
                    }

                })
            });
        },
        /* initiateIndicators: function () {
             if ($scope.Data.selectedIntelcartable.sender) {
                 for (var int = 0; int < $scope.Data.senders.length; int++) {
                     if ($scope.Data.senders[int].uid === $scope.Data.selectedIntelcartable.sender.uid)
                         $scope.Data.selectedIntelcartable.sender = $scope.Data.senders[int];
                 }
             }
         },*/
        removeSender: function () {
            $scope.Data.selectedIntelcartable.sender = null;
            $scope.Data.isSenderRemoved = true;
            angular.forEach($scope.Data.selectedIntelcartable.letterFilters, function (filter , index) {
                    if (filter.field == 'SENDER') {
                        $scope.Data.selectedIntelcartable.letterFilters.splice(index, 1);
                }
                })
        },
        onSelectPosition: function () {
            if ($scope.Data.selected) {
                $scope.Data.selected.positionUserAssignment = {
                uid: $scope.Data.selectedIntelcartable.positionUserAssignment.uid
            };
            }
            initAllIntelcartables($scope.Data.selectedIntelcartable.positionUserAssignment.uid);
        },
        onSelectField: function (field) {
            $scope.Data.selected = { 'title': $scope.Data.selectedIntelcartable.title }
            $scope.Data.selected.description = $scope.Data.selectedIntelcartable.description;
            $scope.Data.selected.field = field.value;
            $scope.Data.selectedIntelcartable.filed = $scope.Data.selected.field;
            $scope.Data.selected.andFilters = $scope.Data.andFilters;
            
        },
        onSelectOperator: function (field) {
            $scope.Data.selected.operator = field.value;
            // if (field.value == 'SENDER') {
            //     $scope.Data.selected.sender = {
            //         uid : 
            //     }
            // }
        },
        onEditClick: function () {
            $scope.Data.mode = 'edit';
        },
        onArchiveSend: function () {
            if ($scope.Data.selectedIntelcartable.sendToArchive) {
                $scope.Data.actions.push({
                    name: 'SEND_TO_ARCHIVE'
                })
            } else if (!$scope.Data.selectedIntelcartable.sendToArchive) {
                angular.forEach($scope.Data.actions, function (action, index) {
                    if (action.name == 'SEND_TO_ARCHIVE') {
                        $scope.Data.actions.splice(index, 1);
                        
                    }
                })
            }
        },
        onTrack: function () {
            if ($scope.Data.selectedIntelcartable.needToTrack) {
                $scope.Data.actions.push({
                    name: 'ADD_NEED_TO_TRACK'
                })
            } else if (!$scope.Data.selectedIntelcartable.needToTrack) {
                angular.forEach($scope.Data.actions, function (action , index) {
                    if (action.name == 'ADD_NEED_TO_TRACK') {
                        $scope.Data.actions.splice(index, 1);
                    }
                })
            }
        },
        onTags: function () {
            $scope.Data.selectedIntelcartable.tags = [];
            $scope.Data.tags = [];
            if (!$scope.Data.checkboxAddTags) {
                angular.forEach($scope.Data.actions, function (action,index) {
                    if (action.name == 'ADD_TAG') {
                        $scope.Data.actions.splice(index, 1);
                    }
                })
            }
        },
        onForwardTo: function () {
            $scope.Data.selectedIntelcartable.referenceTo = [];
            $scope.Data.referenceTo = [];
            if (!$scope.Data.checkboxReferenceTo) {
                angular.forEach($scope.Data.actions, function (action,index) {
                    if (action.name == 'FORWARD_TO_ANOTHER_POSITION') {
                        $scope.Data.actions.splice(index, 1);
                    }
                })
            }
        },
        onSaveClick: function () {
            $scope.Data.validationClicked = true;
            var errorFlag = false;
            if(!$scope.Data.letterFilters.length)
            {
                katebSrvc.showNotification('filterNotAdded');
                errorFlag = true;
            }
            if($scope.Data.intelcartableForm.$invalid)
            {
                katebSrvc.showNotification('fillEmptyFields');
                errorFlag = true;
            }
            if(errorFlag)
            {
                return;
            }
            var positionUserAssignment = $scope.Data.selectedIntelcartable.positionUserAssignment
            $scope.Data.selected.actions = $scope.Data.actions;
            if ($scope.Data.selectedIntelcartable.checkboxReferenceTo) {
                angular.forEach($scope.Data.selected.actions, function (action) {
                    action.referenceTo = $scope.Data.selectedIntelcartable.referenceTo;
                    action.hamesh = $scope.Data.selectedIntelcartable.hamesh;
                })
            }
            delete $scope.Data.selected.field;
            delete $scope.Data.selected.operator;
            $scope.Data.selected.positionUserAssignment = positionUserAssignment;
            $scope.Data.selected.startTime = $scope.Data.selectedIntelcartable.startTime;
            $scope.Data.selected.endTime = $scope.Data.selectedIntelcartable.endTime;
            intelcartableSrvc.saveIntelcartableFilter($scope.Data.selected).then(function () {
                    $scope.isDisableOnDubClick = false;
                    $scope.Func.resetForm();
                    initData();
                    $scope.Data.selectedIntelcartable = null;
                    $scope.Data.mode = null;
                initAllIntelcartables(positionUserAssignment.uid)
                }, function () {
                    $scope.isDisableOnDubClick = false;
                });
            $scope.isAddfilterClicked = false;
        },
        onAddFilterClick: function (selectedField) {
            $scope.Data.isAddfilterClicked = true;
            if (selectedField == 'customValue') {
                $scope.Data.letterFilters.push({
                    field: $scope.Data.selectedIntelcartable.field.value,
                    operator: $scope.Data.selected.operator,
                    value: $scope.Data.selectedIntelcartable.value,
                })
            }
            if (selectedField == 'sender') {
                $scope.Data.letterFilters.push({
                    field: $scope.Data.selectedIntelcartable.field.value,
                    operator: 'EQUALS',
                    sender: $scope.Data.selectedIntelcartable.sender
                })
            }
            if (selectedField == 'EnumCnof') {
                $scope.Data.letterFilters.push({
                    field: $scope.Data.selectedIntelcartable.field.value,
                    operator: 'EQUALS',
                    value: $scope.Data.selectedIntelcartable.confidentialityLevel,
                })
            }
            if (selectedField == 'EnumPri') {
                $scope.Data.letterFilters.push({
                    field: $scope.Data.selectedIntelcartable.field.value,
                    operator: 'EQUALS',
                    value: $scope.Data.selectedIntelcartable.priority,
                })
            }
            $scope.Data.selected.letterFilters = $scope.Data.letterFilters;
        },
            
        onRemoveFilterSelectedFinalClick: function (selectedFilter) {
            _.find($scope.Data.letterFilters, function (filter) {
                if (selectedFilter == filter) {
                    $scope.Data.letterFilters.pop(filter)
                }
            })
        },
        onUpdateClick: function () {
            $scope.Data.validationClicked = true;
            var errorFlag = false;
            if(!$scope.Data.letterFilters.length)
            {
                katebSrvc.showNotification('filterNotAdded');
                errorFlag = true;
            }
            if($scope.Data.intelcartableForm.$invalid)
            {
                katebSrvc.showNotification('fillEmptyFields');
                errorFlag = true;
            }
            if(errorFlag)
            {
                return;
            }
            $scope.Data.selected = $scope.Data.selectedIntelcartable;
            $scope.Data.selected.actions = $scope.Data.actions;
            var uid = $scope.Data.selected.uid;
            delete $scope.Data.selected.needToTrack;
            delete $scope.Data.selected.sendToArchive;
            delete $scope.Data.selected.checkboxReferenceTo;
            delete $scope.Data.selected.hamesh;
            delete $scope.Data.selected.uid;
            delete $scope.Data.selected.sender;
            delete $scope.Data.selected.field;
            delete $scope.Data.selected.filed;
            delete $scope.Data.selected.value;
            delete $scope.Data.selected.confidentialityLevel;
            delete $scope.Data.selected.operator;
            delete $scope.Data.selected.referenceTo;
            delete $scope.Data.selected.addTags;
            delete $scope.Data.selected.tags;
            delete $scope.Data.selected.priority;
            if ($scope.Data.isSenderRemoved) {
                angular.forEach($scope.Data.selected.letterFilters, function (filter, index) {
                if (filter.field == 'SENDER') {
                    $scope.Data.selected.letterFilters.splice(index, 1);
                }
            })
            }
            intelcartableSrvc.updateIntelcartableFilter($scope.Data.selected, uid).then(function () {
                $scope.Data.letterFilters = []
                $scope.Func.onSelectFilter(uid);
            })
        },
        onNewFilterClick: function () {
            initData();
        },
        onDeleteClick: function () {
            var positionUserAssignment = $scope.Data.selectedIntelcartable.positionUserAssignment;
            if ($scope.Data.selectedIntelcartable.uid) {
                intelcartableSrvc.deleteIntelcartableFilter($scope.Data.selectedIntelcartable.uid).then(function () {
                    initAllIntelcartables(positionUserAssignment.uid)
                    $scope.isDisableOnDubClick = false;
                    $scope.Func.resetForm();
                    initData();
                    $scope.Data.selectedIntelcartable = null;
                    $scope.Data.mode = null;
                });
            }
        },
        onHameshSelect: function (item) {
            $scope.Data.selectedIntelcartable.hamesh = item.content;
        },
        onCancelClick: function () {
            $scope.Data.validationClicked = false;
            var positionUserAssignment = $scope.Data.selectedIntelcartable.positionUserAssignment
            initData();
            $scope.Data.selectedIntelcartable = null;
            $scope.Data.mode = null;
            initAllIntelcartables(positionUserAssignment.uid)
            $scope.Data.selectedIntelcartable.positionUserAssignment = positionUserAssignment.uid
        },
        reset: function () {
            initData();
            initAllIntelcartables($scope.Data.selectedIntelcartable.positionUserAssignment.uid);
        },
        resetForm: function () {
            $scope.Data.validationClicked = false;
        },
        onSelectSender: function (item) {
            $scope.Data.selectedIntelcartable.sender = item;
            $scope.Func.onAddFilterClick('sender')
            
        },
        onSelectReferenceTo: function (item) {
            $scope.Data.selectedIntelcartable.referenceTo = []
            $scope.Data.selectedIntelcartable.referenceTo.push(item);
            if ($scope.Data.selectedIntelcartable.checkboxReferenceTo) {
                angular.forEach($scope.Data.actions, function (action , index) {
                    if (action.name == 'FORWARD_TO_ANOTHER_POSITION') {
                        $scope.Data.actions.splice(index, 1);
                    }
                })

                $scope.Data.actions.push({
                    name: 'FORWARD_TO_ANOTHER_POSITION',
                    referenceTo: $scope.Data.selectedIntelcartable.referenceTo,
                    hamesh: $scope.Data.selectedIntelcartable.hamesh
                })
            } 
        },
        onSelectTags: function (item) {
            $scope.Data.selectedIntelcartable.tags.push(item);
            if ($scope.Data.checkboxAddTags && $scope.Data.selectedIntelcartable.tags.length<2) {
                $scope.Data.actions.push({
                    name: 'ADD_TAG',
                    tags:$scope.Data.selectedIntelcartable.tags
                })
            } 

        },
            onClickAddNewFilter: function () {
                // initData();
                $scope.Data.validationClicked = false;
                $scope.Data.letterFilters = [];
                $scope.Data.mode = 'add';
                
            },
            onChnageCheckboxResponseWithExplanation: function () {
                if(!$scope.Data.checkboxResponseWithExplanation){
                    $scope.Data.selectedIntelcartable.responseWithExplanation = "";
                }
            },
            onChnageCheckboxHamesh: function () {
                if(!$scope.Data.checkboxHamesh){
                    $scope.Data.selectedIntelcartable.hamesh = "";
                    $scope.Data.hamesh = null;
                }
            },
            getPuaListAllPosition: function () {
                cartableKatebSrvc.getPuaListAllPosition().then(function (response) {
                    $scope.Data.positionList = response.data.originalElement;
                })
            },
            getTagsList: function (tagQuery) {
                if (!tagQuery || tagQuery.length>1) {
                    intelcartableSrvc.getTagsList(tagQuery).then(function (response) {
                    $scope.Data.tagList = response.data.originalElement;
                })
                }
            }
        };

        $scope.Controller = {
            multiSelectorsController: {
                multiSelectTranslate: {
                    buttonDefaultText: 'انتخاب ارجاعات',
                    searchPlaceholder: 'جستجو',
                    checkAll: 'انتخاب همه',
                    uncheckAll: 'حذف همه',
                    dynamicButtonTextSuffix: 'مورد انتخاب شده'
                },
                multiSelectSettings: {
                    externalIdProp: '',
                    displayProp: 'title',
                    enableSearch: true,
                    scrollableHeight: '300px',
                    scrollable: true,
                    idProp: 'uid',
                    showCheckAll: true,
                    showUncheckAll: true
                }
            },
            dragControlListeners: {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return true;
                }
            },
            multiselectSenderSearch: intelcartableSrvc.getIntelcartablesearch,
            multiselectReferenceToSearch: cartableKatebSrvc.getPuaListAllForwardable,
            multiselectTagToSearch:intelcartableSrvc.getTagsList
        };

        function initData() {
            if ($scope.Data) {
                $scope.Data.selectedIntelcartable = {
                    referenceTo: []
                };
            } else {
                $scope.Data = {
                    selectedIntelcartable: {
                        referenceTo: []
                    },
                    reordered: []
                };
            }
            $scope.Data.checkboxResponseWithExplanation = false;
            $scope.Data.checkboxHamesh = false;
            //$scope.Data.mode = 'add';
        }

        function initAllIntelcartables(positionUid) {
            intelcartableSrvc.getIntelcartablePuaList(positionUid).then(function (response) {
                $scope.Data.intelcartableList = response.data.originalElement;
            });
        }

        /*function initAllSenders() {
            intelcartableSrvc.getIntelcartableFilterReferenceToList($rootScope.currentUserOrg.uid).then(function (response) {
                $scope.Data.senders = response.data.originalElement;
            });
        }*/

        function initFullhameshhotkeyList() {
            cartableKatebSrvc.getFullhameshhotkeyList().then(function (response) {
                $scope.Data.hameshList = response.data.originalElement;

            });
        }

        function initReferenceToList() {
            intelcartableSrvc.getIntelcartableFilterReferenceToList($rootScope.currentUserOrg.uid).then(function (response) {
                $scope.Data.referenceToList = response.data.originalElement;
            })

        }

    var Run = function () {
            initData();
            $scope.Func.getPuaListAllPosition();
            $scope.Func.getTagsList()
            //initAllSenders();
            initFullhameshhotkeyList();
            initReferenceToList();
        };
        Run();
    }
)
;
