angular.module('confermentModule').controller('confermentCtrl', function ($scope, $rootScope, confermentSrvc) {

    $scope.Data = {
        mode: 'view',
        searchMode: 'none',
        confermentList: [],
        selectedconferment: {
            active: false,
            seeDrafts: false,
            seeReceivedLetters: false,
            sendAndParaphLetter: false,
            sendAndSignLetter: false
        },
        originalconferment: {},
        positionList: [],
        successorList: [],
        seeLettersWithTagList: [],
        responseLettersWithTagList: [],
        validationClicked: false
    }

    $scope.Func = {
        onAddconfermentClick: function () {
            $scope.Data.mode = 'add';
            $scope.Func.reset();
        },
        onSelectconferment: function (conferment) {
            confermentSrvc.getconferment(conferment.uid).then(function (response) {
                $scope.Data.selectedconferment = response.data.originalElement;
                $scope.Data.originalconferment = angular.copy($scope.Data.selectedconferment);
                $scope.Data.selectedconferment.startTime = new Date($scope.Data.selectedconferment.startTime);
                $scope.Data.selectedconferment.endTime = new Date($scope.Data.selectedconferment.endTime);
                $scope.Func.initiateposition();
                $scope.Func.initiateSuccessor();
                $scope.Func.initiateseeLettersWithTag();
                $scope.Func.initiateresponseLettersWithTag();
                $scope.Data.mode = 'view';
            });
        },
        onEditconfermentClick: function () {
            $scope.Data.mode = 'edit';
        },
        onSaveconfermentClick: function () {
			if($scope.confermentForm.$valid){
				confermentSrvc.saveconferment($scope.Data.selectedconferment).then(function(response){
					$scope.Controller.confermentListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
        },
        onUpdateconfermentClick: function () {
            if ($scope.confermentForm.$valid) {
                confermentSrvc.updateconferment($scope.Data.selectedconferment).then(function (response) {
                    $scope.Controller.confermentListController.refreshList()
                    $scope.Func.resetForm();
                });
            } else {
                $scope.Data.validationClicked = true;
            }
        },
        onDeleteconfermentClick: function () {
            confermentSrvc.deleteconferment($scope.Data.selectedconferment.uid).then(function (response) {
                $scope.Func.resetForm();
                $scope.Func.reset();
                $scope.Controller.confermentListController.refreshList();
            });
        },
        onCancelClick: function () {
            $scope.Data.selectedconferment = angular.copy($scope.Data.originalconferment);
            $scope.Data.selectedconferment.startTime = $scope.Data.mode == "add" ? null : new Date($scope.Data.selectedconferment.startTime);
            $scope.Data.selectedconferment.endTime = $scope.Data.mode == "add" ? null :  new Date($scope.Data.selectedconferment.endTime);
            $scope.Func.initiateposition();
            $scope.Func.initiateSuccessor();
            $scope.Func.initiateseeLettersWithTag();
            $scope.Func.initiateresponseLettersWithTag();
            $scope.Func.resetForm();
        },

        onChangeSearchModeClick: function (mode) {
            $scope.Data.searchMode = mode;
        },
        onSearchClick: function (advancedMode) {
            if (advancedMode) {
                $scope.Func.onChangeSearchModeClick('advanced');
                $scope.Controller.confermentListController.searchQuery = $scope.Controller.confermentAdvancedSearchController.searchQuery;
                $scope.Controller.confermentListController.searchableFieldInfo = $scope.Controller.confermentAdvancedSearchController.searchableFieldInfo;
            } else {
                $scope.Func.onChangeSearchModeClick('quick');
                $scope.Controller.confermentListController.searchQuery = $scope.Controller.confermentSearchController.searchQuery;
                $scope.Controller.confermentListController.searchableFieldInfo = $scope.Controller.confermentSearchController.searchableFieldInfo;
            }
            $scope.Controller.confermentListController.refreshList(true);
        },
        onExitSearchModeClick: function () {
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.confermentAdvancedSearchController.searchQuery = {};
            $scope.Controller.confermentSearchController.searchQuery = {};
            $scope.Controller.confermentListController.exitSearchMode();
        },

        getpositionList: function () {
            confermentSrvc.getpositionList().then(function (response) {
                for (var int = 0; int < response.data.originalElement.length; int++) {
                    $scope.Data.positionList.push(response.data.originalElement[int]);
                }
            });
        },
        getSuccessorList: function () {
            confermentSrvc.getSuccessorList().then(function (response) {
                for (var int = 0; int < response.data.originalElement.length; int++) {
                    $scope.Data.successorList.push(response.data.originalElement[int]);
                }
            });
        },
        onSelectposition: function (position) {
            $scope.Data.position = position;
            $scope.Data.selectedconferment.position = {
                uid: $scope.Data.position.uid,
                title: $scope.Data.position.title
            };
        },
        onSelectSuccessor: function (successor) {
            $scope.Data.successor = successor;
            $scope.Data.selectedconferment.successor = {
                uid: $scope.Data.successor.uid,
                title: $scope.Data.successor.title
            };
        },
        initiateposition: function () {
            $scope.Data.position = null;
            if ($scope.Data.selectedconferment.position) {
                for (var int = 0; int < $scope.Data.positionList.length; int++) {
                    if ($scope.Data.positionList[int].uid == $scope.Data.selectedconferment.position.uid) {
                        $scope.Data.position = $scope.Data.positionList[int];
                    }
                }
            }
        },
        initiateSuccessor: function () {
            $scope.Data.successor = null;
            if ($scope.Data.selectedconferment.successor) {
                for (var int = 0; int < $scope.Data.successorList.length; int++) {
                    if ($scope.Data.successorList[int].uid == $scope.Data.selectedconferment.successor.uid) {
                        $scope.Data.successor = $scope.Data.successorList[int];
                    }

                }
            }
        },

        getseeLettersWithTagList: function () {
            confermentSrvc.getseeLettersWithTagList().then(function (response) {
                for (var int = 0; int < response.data.originalElement.length; int++) {
                    $scope.Data.seeLettersWithTagList.push(response.data.originalElement[int]);
                }
            });
        },
        onSelectseeLettersWithTag: function (seeLettersWithTag) {
            $scope.Data.seeLettersWithTag = seeLettersWithTag;
            $scope.Data.selectedconferment.seeLettersWithTag = {
                uid: $scope.Data.seeLettersWithTag.uid,
                title: $scope.Data.seeLettersWithTag.title
            };
        },
        initiateseeLettersWithTag: function () {
            $scope.Data.seeLettersWithTag = null;
            if ($scope.Data.selectedconferment.seeLettersWithTag) {
                for (var int = 0; int < $scope.Data.seeLettersWithTagList.length; int++) {
                    if ($scope.Data.seeLettersWithTagList[int].uid == $scope.Data.selectedconferment.seeLettersWithTag.uid)
                        $scope.Data.seeLettersWithTag = $scope.Data.seeLettersWithTagList[int];
                }
            }
        },

        getresponseLettersWithTagList: function () {
            confermentSrvc.getresponseLettersWithTagList().then(function (response) {
                for (var int = 0; int < response.data.originalElement.length; int++) {
                    $scope.Data.responseLettersWithTagList.push(response.data.originalElement[int]);
                }
            });
        },
        onSelectresponseLettersWithTag: function (responseLettersWithTag) {
            $scope.Data.responseLettersWithTag = responseLettersWithTag;
            $scope.Data.selectedconferment.responseLettersWithTag = {
                uid: $scope.Data.responseLettersWithTag.uid,
                title: $scope.Data.responseLettersWithTag.title
            };
        },
        initiateresponseLettersWithTag: function () {
            $scope.Data.responseLettersWithTag = null;
            if ($scope.Data.selectedconferment.responseLettersWithTag) {
                for (var int = 0; int < $scope.Data.responseLettersWithTagList.length; int++) {
                    if ($scope.Data.responseLettersWithTagList[int].uid == $scope.Data.selectedconferment.responseLettersWithTag.uid)
                        $scope.Data.responseLettersWithTag = $scope.Data.responseLettersWithTagList[int];
                }
            }
        },

        reset: function () {
            $scope.Data.selectedconferment = {
                active: false,
                seeDrafts: false,
                seeReceivedLetters: false,
                sendAndParaphLetter: false,
                sendAndSignLetter: false
            };
            $scope.Data.position = null;
            $scope.Data.successor = null;
            $scope.Data.seeLettersWithTag = null;
            $scope.Data.responseLettersWithTag = null;
        },
        resetForm: function () {
            $scope.Data.mode = 'view';
            $scope.Data.validationClicked = false;
        },
        onUserRefresh: function(query){
            if (query.length > 2) {
                confermentSrvc.getSuccessorList(query).then(function (response) {
                    $scope.Data.successorList.length = 0;
                    for (var int = 0; int < response.data.originalElement.length; int++) {
                        $scope.Data.successorList.push(response.data.originalElement[int]);
                    }
                });
            }
        },
        onRemoveSenderClick: function () {
            $scope.Data.selectedconferment.successor = null;
        }
    }

    $scope.Controller = {
        confermentListController: {
            headers: [
                {key: 'position.title'},
                {key: "successor.title",label: "جانشین"},
                {key: 'active'},
                {key: "sendAndSignLetter", type:"bool",label:"ارسال و امضاء نامه"},
                {key: "seeReceivedLetters", type:"bool",label:"مشاهده‌ی نامه‌های دریافتی"},
            ],
            getList: confermentSrvc.getFullconfermentList,
            onListItemSelect: $scope.Func.onSelectconferment,
            searchFunction: confermentSrvc.searchconferment,
        },
        confermentSearchController: {
            advanced: false,
            searchableFieldInfo: [
                {key: "position", type: "enum", label: "سمت", itemList: $scope.Data.positionList},
                {key: "successor", type: "enum", label: "جانشین", itemList: $scope.Data.successorList},
                {key: "active", type: "bool", label: "فعال"},

            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
        confermentAdvancedSearchController: {
            advanced: true,
            searchableFieldInfo: [
                {key: "position", type: "enum", label: "جانشین", itemList: $scope.Data.successorList},
                {key: "active", type: "bool", label: "فعال"},
                {key: "sendAndSignLetter", type:"bool",label:"ارسال و امضاء نامه"},
                {key: "seeReceivedLetters", type:"bool",label:"مشاهده‌ی نامه‌های دریافتی"},
                {key: "startTime", type: "date", label: "تاریخ شروع"},
                {key: "endTime", type: "date", label: "تاریخ پایان"}
                // {key:"seeReferences", type:"bool", label:"مشاهده ارجاع‌ها"},
                // {key:"responseToReferences", type:"bool", label:"پاسخ به ارجاع‌ها"},
                // {key:"seeReceivedLetters", type:"bool", label:"مشاهده نامه‌های دریافتی"},
                // {key:"responseReceivedLetters", type:"bool", label:"پاسخ به نامه‌ها دریافتی"},
                // {key:"seeLettersWithTag", type:"enum", label:"مشاهده نامه‌ها با برچسب", itemList:$scope.Data.seeLettersWithTagList},
                // {key:"responseLettersWithTag", type:"enum", label:"پاسخ به نامه‌ها با برچسب", itemList:$scope.Data.responseLettersWithTagList},
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        }
    }

    var Run = function () {
        confermentSrvc.setOrgUid($rootScope.currentUserOrg.uid);
        $scope.Func.getpositionList();
        // $scope.Func.getSuccessorList();
        $scope.Func.getseeLettersWithTagList();
        $scope.Func.getresponseLettersWithTagList();
    }

    Run();
});