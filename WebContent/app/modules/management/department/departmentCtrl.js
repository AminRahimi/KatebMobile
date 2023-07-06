angular.module('departmentModule').controller('departmentCtrl', function ($scope, $state, utils, departmentSrvc) {
    $scope.treeData = {
        selectedNode: {}
    };
    $scope.Data = {
        selectedDepartment: {},
        validationClicked: false,
        managerList: []
    };

    $scope.Func = {
        onSelectDepartment: function (department) {
            departmentSrvc.getDepartment(department.uid).then(function (response) {
                $scope.Data.selectedDepartment = response.data;
                $scope.Func.initiateManager();
                $scope.Data.mode = 'view';
            });
        },
        initiateManager: function () {
            if ($scope.Data.selectedDepartment.manager) {
                for (var int = 0; int < $scope.Data.managerList.length; int++) {
                    if ($scope.Data.managerList[int].uid === $scope.Data.selectedDepartment.manager.uid)
                        $scope.Data.selectedDepartment.manager = $scope.Data.managerList[int];
                }
            }
        },
        onAddDepartmentClick: function () {
            $scope.Data.mode = 'add';
            $scope.Func.reset();
        },
        onEditDepartmentClick: function () {
            $scope.Data.mode = 'edit';
        },
        onSaveDepartmentClick: function () {
            if ($scope.departmentForm.$valid) {
                departmentSrvc.saveDepartment($scope.Data.selectedDepartment).then(function () {
                    $scope.Func.reset();
                    $scope.Func.resetForm();
                    $scope.Controller.departmentListController.refreshList();
                });

            } else {
                $scope.Data.validationClicked = true;
            }
        },
        onUpdateDepartmentClick: function () {
            if ($scope.departmentForm.$valid) {
                if ($scope.Data.selectedDepartment.originalElement) {
                    delete $scope.Data.selectedDepartment.originalElement;
                }
                departmentSrvc.updateDepartment($scope.Data.selectedDepartment).then(function () {
                    $scope.Func.reset();
                    $scope.Func.resetForm();
                    $scope.Controller.departmentListController.refreshList();
                })
            } else {
                $scope.Data.validationClicked = true;
            }

        },
        onDeleteDepartmentClick: function () {
            utils.removeConfirmModal().then(function (res) {
                if (res) {
                    departmentSrvc.deleteDepartment($scope.Data.selectedDepartment.uid).then(function () {
                        $scope.Func.resetForm();
                        $scope.Func.reset();
                        $scope.Controller.departmentListController.refreshList();
                    });
                }
            });
        },
        onCancelClick: function () {
            $scope.Func.resetForm();
        },

        onChangeSearchModeClick: function (mode) {
            $scope.Data.searchMode = mode;
        },
        onSearchClick: function () {
            $scope.Func.onChangeSearchModeClick('quick');
            $scope.Controller.departmentListController.searchQuery = $scope.Controller.departmentSearchController.searchQuery;
            $scope.Controller.departmentListController.searchableFieldInfo = $scope.Controller.departmentSearchController.searchableFieldInfo;
            $scope.Controller.departmentListController.refreshList(true);
        },
        onExitSearchModeClick: function () {
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.departmentListController.searchQuery = {};
            $scope.Controller.departmentSearchController.searchQuery = {};
            $scope.Controller.departmentListController.refreshList(true);
        },

        reset: function () {
            $scope.Data.selectedDepartment = {};
        },
        resetForm: function () {
            $scope.Data.mode = 'view';
            $scope.Data.validationClicked = false;
        }
    };

    $scope.Controller = {
        departmentSearchController: {
            advanced: false,
            searchableFieldInfo: [{
                key: "name",
                type: "string",
                label: "نام"
            },{
                key: "manager",
                type: "enum",
                label: "ریشه واحد",
                itemList: $scope.Data.managerList
            }],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick
        },
        departmentListController: {
            headers: [
                {key: 'name'},		
				{key:'code'},		
				{key:'enabled'}
            ],
            getList: departmentSrvc.getDepartmentsList,
            onListItemSelect: $scope.Func.onSelectDepartment,
            searchFunction: departmentSrvc.searchDepartment
        }
    };
    function getDepartmentRoots() {
        $scope.Data.managerList.length = 0;
        departmentSrvc.getDepartmentRoots().then(function (response) {
            angular.forEach(response.data, function (item) {
                $scope.Data.managerList.push(item)
            });
        })
    }

    var Run = function () {
        departmentSrvc.setOrgUid($state.params.orgUid);
        getDepartmentRoots();
    };
    Run();
});