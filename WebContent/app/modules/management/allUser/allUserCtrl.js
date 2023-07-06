angular.module('allUserModule').controller('allUserCtrl', function ($scope, utils, allUserSrvc, userroleSrvc,cartableSrvc,userSrvc) {

    $scope.Data = {
        mode: 'view',
        searchMode: 'none',
        allUserList: [],
        selectedallUser: {},
        originalallUser: {},
        validationClicked: false,
        confirmDelete:false,
        allUserrolelist: [],
        selectedOrg: '',
        extOrgList:[],
        selectedAllUserAuthorization: {
            accessToSignLetter: false,
            sendLetterToOut: false,
            seenByCooperatorInstitutions: false,
            accessToParaphOtherOrgLetter: false
        },
        organizationList: []
    };

    $scope.Func = {
        onAddallUserClick: function () {
            $scope.Data.mode = 'add';
            $scope.Data.selectedallUser = {roles: $scope.Data.allUserroleList};
            $scope.Data.selectedAllUserAuthorization.signIssuedLetterAccess = true;
        },
        onSelectallUser: function (allUser) {
            allUserSrvc.getallUser(allUser.uid).then(function (response) {
                $scope.Data.selectedallUser = response.data.originalElement;
                $scope.Data.originalallUser = angular.copy($scope.Data.selectedallUser);
                $scope.Data.mode = 'view';
            });
            $scope.Func.getallUserAuthentication(allUser.uid);
        },
        onConfirmClick: function () {
			$scope.Data.confirmDelete = !$scope.Data.confirmDelete;

        },
        onMoveClick: function () {
			userSrvc.moveUser($scope.Data.selectedallUser.uid, $scope.Data.selectedOrg.uid).then(function () {
				$scope.Data.selectedOrg = null;
				$scope.Controller.allUserListController.refreshList();
				$scope.Data.confirmDelete = false;
			})

		},
        onEditallUserClick: function () {
            $scope.Data.mode = 'edit';
        },
        onSaveallUserClick: function () {
            if ($scope.allUserForm.$valid) {
                if ($scope.Data.selectedallUser.password) {
                    // $scope.Data.selectedallUser.password = md5($scope.Data.selectedallUser.password);
                } else {
                    delete $scope.Data.selectedallUser.password;
                }
                allUserSrvc.saveallUser($scope.Data.selectedallUser).then(function (response) {
                    $scope.Func.updateallUserAuthentication(response.data.uid, $scope.Data.selectedAllUserAuthorization);
                    $scope.Controller.allUserListController.refreshList()
                    $scope.Func.resetForm();
                });
            } else {
                $scope.Data.validationClicked = true;
            }
        },
        onUpdateallUserClick: function () {
            if ($scope.allUserForm.$valid) {
                if ($scope.Data.selectedallUser.password) {
                    // $scope.Data.selectedallUser.password = md5($scope.Data.selectedallUser.password);
                } else {
                    delete $scope.Data.selectedallUser.password;
                }
                if (!$scope.Data.selectedallUser.signature) {
                    $scope.Data.selectedallUser.signature = null;
                }
                allUserSrvc.updateallUser($scope.Data.selectedallUser).then(function (response) {
                    $scope.Controller.allUserListController.refreshList()
                    $scope.Func.resetForm();
                });
            } else {
                $scope.Data.validationClicked = true;
            }
            $scope.Func.updateallUserAuthentication($scope.Data.selectedallUser.uid, $scope.Data.selectedAllUserAuthorization);
        },
        onDeleteallUserClick: function () {
            utils.removeConfirmModal().then(function (res) {
                if (res) {
                    allUserSrvc.deleteallUser($scope.Data.selectedallUser.uid).then(function (response) {
                        $scope.Func.resetForm();
                        $scope.Func.reset();
                        $scope.Controller.allUserListController.refreshList();
                    });
                }
            });
        },
        onLoginClick: function () {
            // TODO Uncomment and it must work
            $.ajax({
                type: "POST",
                url: '../Kateb/j_spring_security_switch_user',
                data: {
                    j_username: $scope.Data.selectedallUser.username,
                },
                contentType: "application/x-www-form-urlencoded",
                dataType: "JSON",
                success: function (strData) {
                    window.location.href = "/";
                },
                error: function () {
                    window.location.href = "./";
                }
            });
            /*allUserSrvc.getAllUserPass($scope.Data.selectedallUser.uid).then(function (res) {
                $.ajax({
                    type: "POST",
                    url: '../Kateb/j_spring_security_check',
                    data: {
                        j_username: res.data.username,
                        j_password: res.data.password
                    },
                    contentType: "application/x-www-form-urlencoded",
                    dataType: "JSON",
                    success: function (strData) {
                        window.location.href = "./";
                    },
                    error: function () {
                        window.location.href = "./";
                    }
                });
            });*/
        },
        onCancelClick: function () {
            $scope.Data.selectedallUser = angular.copy($scope.Data.originalallUser);
            $scope.Func.resetForm();
        },

        onChangeSearchModeClick: function (mode) {
            $scope.Data.searchMode = mode;
        },
        onSearchClick: function (advancedMode) {
            if (advancedMode) {
                $scope.Func.onChangeSearchModeClick('advanced');
                $scope.Controller.allUserListController.searchQuery = $scope.Controller.allUserAdvancedSearchController.searchQuery;
                $scope.Controller.allUserListController.searchableFieldInfo = $scope.Controller.allUserAdvancedSearchController.searchableFieldInfo;
            } else {
                $scope.Func.onChangeSearchModeClick('quick');
                $scope.Controller.allUserListController.searchQuery = $scope.Controller.allUserSearchController.searchQuery;
                $scope.Controller.allUserListController.searchableFieldInfo = $scope.Controller.allUserSearchController.searchableFieldInfo;
            }
            $scope.Controller.allUserListController.refreshList(true);
        },
        onExitSearchModeClick: function () {
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.allUserAdvancedSearchController.searchQuery = {};
            $scope.Controller.allUserSearchController.searchQuery = {};
            $scope.Controller.allUserListController.exitSearchMode();
        },
        updateallUserAuthentication: function (allUserUid, data) {
            delete data.originalElement;
            allUserSrvc.updateallUserAuthentication(allUserUid, data).then(function (res) {

            });
        },
        getallUserAuthentication: function (allUserUid) {
            allUserSrvc.getallUserAuthentication(allUserUid).then(function (res) {
                $scope.Data.selectedAllUserAuthorization = res.data;
            });
        },
        getExternalOrganizationList: function () {
			cartableSrvc.getExternalOrganizationList().then(function (res) {
				$scope.Data.extOrgList = res.data.originalElement;
			})
		},
        getallUserroleList: function () {
            userroleSrvc.getExtenduserroleList().then(function (response) {
                $scope.Data.allUserroleList = response.data.originalElement;
                _.map($scope.Data.allUserroleList, function (allUserrole) {
                    allUserrole.active = false;
                    return allUserrole;
                });
            });
        },

        reset: function () {
            $scope.Data.selectedallUser = {};
        },
        resetForm: function () {
            $scope.Data.mode = 'view';
            $scope.Data.validationClicked = false;
        },
        getOrganizationList: function () {
            allUserSrvc.getOrganizationList().then(function (res) {
                $scope.Data.organizationList = res.data.originalElement;
            });
        }
    };

    $scope.Controller = {
        allUserListController: {
            headers: [
                {key: 'username'},
                {key: 'firstName'},
                {key: 'lastName'},
            ],
            getList: allUserSrvc.getFullallUserList,
            onListItemSelect: $scope.Func.onSelectallUser,
            searchFunction: allUserSrvc.searchallUser,
        },
        allUserSearchController: {
            advanced: false,
            searchableFieldInfo: [
                {key: "username", type: "string", label: "نام کاربری"},
                {key: "firstName", type: "string", label: "نام"},
                {key: "lastName", type: "string", label: "نام خانوادگی"},
                {key: "didgahPersonnelNo", type: "string", label: "شماره پرسنلی دیدگاه" },
                {key: "enabled", type: "bool", label: "فعال"},
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
        allUserAdvancedSearchController: {
            advanced: true,
            searchableFieldInfo: [
                {key: "username", type: "string", label: "نام کاربری"},
                {key: "firstName", type: "string", label: "نام"},
                {key: "lastName", type: "string", label: "نام خانوادگی"},
                {key: "enabled", type: "bool", label: "فعال بودن"},
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        }
    };

    var Run = function () {
        $scope.Func.getallUserroleList();
        $scope.Func.getExternalOrganizationList();
        $scope.Func.getOrganizationList();
    };

    Run();

});