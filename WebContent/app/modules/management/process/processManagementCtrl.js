angular.module('processManagementModule').controller('processManagementCtrl',
    function ($scope, $state, processManagementSrvc, katebSrvc, modalPoolSrvc) {
    $scope.Data = {
        mode: 'view',
        selectedProcess: {
            accessContainer: {
                users: [],
                positions: [],
                positionUserAssignemts: [],
                groups: [],
                all: false
            }
        }
    };
    $scope.Func = {
        onSelectProcess: function (item) {
            processManagementSrvc.getProcessItem(item.uid).then(function (response) {
                $scope.Data.selectedProcess = $scope.Func.prepareVtFileData(response.data);
                $scope.Func.initiateIndicators();
                $scope.Data.mode = 'view';
            });
        },
        initiateIndicators: function () {
            if ($scope.Data.selectedProcess.indicatorBook) {
                for (var int = 0; int < $scope.Data.indicators.length; int++) {
                    if ($scope.Data.indicators[int].uid === $scope.Data.selectedProcess.indicatorBook.uid)
                        $scope.Data.selectedProcess.indicatorBook = $scope.Data.indicators[int];
                }
            }
        },
        onSearchClick: function () {
            $scope.Func.onChangeSearchModeClick('quick');
            $scope.Controller.processListController.searchQuery = $scope.Controller.processSearchController.searchQuery;
            $scope.Controller.processListController.searchableFieldInfo = $scope.Controller.processSearchController.searchableFieldInfo;
            $scope.Controller.processListController.refreshList(true);

        },
        onChangeSearchModeClick: function (mode) {
            $scope.Data.searchMode = mode;
        },
        onExitSearchModeClick: function () {
            $scope.Func.onChangeSearchModeClick('none');
            $scope.Controller.processSearchController.searchQuery = {};
            $scope.Controller.processListController.exitSearchMode();
        }
        ,
        onAddProcessClick: function () {
            $scope.Data.mode = 'add';
            $scope.Func.reset();
        },
        onEditProcessClick: function () {
            $scope.Data.mode = 'edit';
        },
        onSaveProcessClick: function () {
            if ($scope.processForm.$valid) {
                processManagementSrvc.saveProcess($scope.Func.correctData($scope.Data.selectedProcess)).then(function () {
                    $scope.Controller.processListController.refreshList();
                    $scope.Func.reset();
                    $scope.Func.resetForm();
                });
            } else {
                $scope.Data.validationClicked = true;
            }
        },

        onUpdateProcessClick: function () {
            if ($scope.processForm.$valid) {
                if ($scope.Data.selectedProcess.originalElement) {
                    delete $scope.Data.selectedProcess.originalElement;
                }
                processManagementSrvc.updateProcess($scope.Func.correctData($scope.Data.selectedProcess)).then(function () {
                    $scope.Func.resetForm();
                    $scope.Func.reset();
                    $scope.Controller.processListController.refreshList();
                });
            } else {
                $scope.Data.validationClicked = true;
            }

        },
        onCancelProcessClick: function () {
            $scope.Data.mode = 'view';
            $scope.Data.validationClicked = false;
        },
        onDeleteProcessClick: function () {
            processManagementSrvc.removeProcess($scope.Data.selectedProcess.uid).then(function () {
                $scope.Func.resetForm();
                $scope.Func.reset();
                $scope.Controller.processListController.refreshList();
            });
        },
        onDeployClick: function () {
            processManagementSrvc.deployProcess($scope.Data.selectedProcess.uid).then(function (res) {
                katebSrvc.showNotification('deploySucceded');
            }, function (error) {
                katebSrvc.showNotification('deployFailed');
            });
        },
        reset: function () {
            $scope.Data.selectedProcess = {
                accessContainer: {
                    users: [],
                    positions: [],
                    positionUserAssignemts: [],
                    groups: [],
                    all: false
                }
            };
        },
        resetForm: function () {
            $scope.Data.mode = 'view';
            $scope.Data.validationClicked = false;
        },
        getFileHash: function (file) {
            if(!file)
                return;
            return file.hash;
        },
        correctData: function (data) {
            var selectedProcessCp = angular.copy(data);
            selectedProcessCp.templateFile = $scope.Func.getFileHash(selectedProcessCp.templateFile);
            selectedProcessCp.bpmnXmlFile = $scope.Func.getFileHash(selectedProcessCp.bpmnXmlFile);
            selectedProcessCp.formFile = $scope.Func.getFileHash(selectedProcessCp.formFile);
            selectedProcessCp.iconFile = $scope.Func.getFileHash(selectedProcessCp.iconFile);
            return selectedProcessCp;
        },
        prepareVtFileData: function (data) {
            data.templateFile = data.templateFile?{hash:data.templateFile, name: 'test'}:data.templateFile;
            data.bpmnXmlFile = data.bpmnXmlFile?{hash:data.bpmnXmlFile, name: 'test'}:data.bpmnXmlFile;
            data.formFile = data.formFile?{hash:data.formFile, name: 'test'}:data.formFile;
            data.iconFile = data.iconFile?{hash:data.iconFile, name: 'test'}:data.iconFile;
            return data;
        },
        onAddUserAccess: function () {
            modalPoolSrvc
                .showModal('userAccessModal', {accessContainer: $scope.Data.selectedProcess.accessContainer, mode: $scope.Data.mode})
                .then(function (data) {
                    $scope.Data.selectedProcess.accessContainer = data;
                });
        }
    };
    $scope.Controller = {
        processSearchController: {
            advanced: false,
            searchableFieldInfo: [
                {key: "name", type: "string", label: "نام فرآیند"}
            ],
            onSearchClick: $scope.Func.onSearchClick,
            onExitSearchModeClick: $scope.Func.onExitSearchModeClick

        },
        processListController: {
            headers: [
                {key: 'name'},
                {key: 'deploymentDate'},
                {key: 'enabled'}
            ],
            getList: processManagementSrvc.getProcessItemsList,
            onListItemSelect: $scope.Func.onSelectProcess,
            searchFunction: processManagementSrvc.searchProcess
        }
    };

    function getAllIndicators() {
        processManagementSrvc.getIndicators().then(function (data) {
            $scope.Data.indicators = data;
        });
    }

    function Run() {
        processManagementSrvc.setOrgUid($state.params.orgUid);
        getAllIndicators();
    }

    Run();
});