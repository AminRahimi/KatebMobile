angular.module('processModule').controller('processInfoCtrl', function ($scope, $state, processKatebSrvc, $rootScope,$timeout, katebSrvc) {

        $scope.Data = {
            processInfoUid: $state.params.uid,
            mode: $state.params.mode,
            schemaEdit: "",
            schemaEditShow: false,
            schemaEditModel: {},
            schemaView: "",
            schemaViewShow: false,
            schemaViewModel: {},
            showLetterSelection: false,
            orgUid: $rootScope.currentUserOrg.uid,
            processInfo: "",
            taskType: $state.params.taskType,
            showStatusPic: false,
            wordTemplateAvailable: "",
            schemaForm: {}
        }

        $scope.Func = {
            getTabList: function () {
                $scope.Data.tabList = [{
                    id: 0,
                    title: 'فرم',
                    uiSref: ''
                },
                // ,{
                //     id: 1,
                //     title: 'اطلاعات فرآیند',
                //     uiSref: ''
                // },
                     {
                     id: 2,
                     title: 'وضعیت',
                     uiSref: ''
                 },{
                     id: 3,
                     title: 'چاپ',
                     uiSref: ''
                 },
                    //{
                //     id: 4,
                //     title: 'پیش نمایش',
                //     uiSref: ''
                // }
                ]
            },
            onTabClick: function (tab) {
                $scope.Data.selectedTab = tab;
                $scope.Func.deactiveTabs();
                tab.active = true;
            },
            deactiveTabs: function () {
                for (var int = 0; int < $scope.Data.tabList.length; int++) {
                    $scope.Data.tabList[int].active = false;
                }
            },
            initProcess: function (res) {
                var formName = res.data.formScreen;
                var schemaForm = JSON.parse(res.data.formSchema);
                $scope.Data.schemaForm = angular.copy(schemaForm);
                var formScreen =  schemaForm.forms[formName];
                var schema = {};
                $scope.Data.schemaView = angular.copy(schemaForm);
                $scope.Data.schemaView.properties = {};
                $scope.Data.schemaEdit = angular.copy(schemaForm);
                $scope.Data.schemaEdit.properties = {};
                for(item in schemaForm.properties){
                    if(schemaForm.properties[item].enumType == "decision"){
                        $scope.Data.showLetterSelection = true;
                    }
                }
                angular.forEach(formScreen, function (value, key) {
                    var item = _.pick(schemaForm.properties, key);
                    angular.extend(schema, item);
                });
                angular.forEach(formScreen, function (valueScreen, keyScreen) {
                    angular.forEach(schema, function (value, key) {
                        if (key == keyScreen) {
                            if (valueScreen.e == 0) {
                                $scope.Data.schemaView.properties[key] = value;
                            } else {
                                if (valueScreen.r == 1) {
                                    value.required = true;
                                }
                                $scope.Data.schemaEdit.properties[key] = value;
                            }
                        }
                    });
                });
                $scope.Data.schemaViewShow = _.isEmpty($scope.Data.schemaView.properties);
                $scope.Data.schemaEditShow = _.isEmpty($scope.Data.schemaEdit.properties);
            },
            getProcessInfo: function () {
                if($scope.Data.mode == 'add'){
                    processKatebSrvc.getProcessInfo($scope.Data.processInfoUid).then(function (res) {
                        $scope.Func.initProcess(res);
                    });
                }else {
                    processKatebSrvc.getTaskInfo($scope.Data.processInfoUid).then(function (res) {
                        $scope.Func.initProcess(res);
                        var data = $scope.Func.removeExtraFields(res.data.formData);
                        $scope.Data.schemaViewModel = data;
                        $scope.Data.schemaEditModel = data;
                        if (data.letter_uid) {
                            $scope.Data.selectedLetter = {title: data.letter_title, uid: data.letter_uid}
                        }
                        $scope.Data.processInfo = res.data;
                        $scope.Data.processInfo.formData._bpmsData.history = _.reverse($scope.Data.processInfo.formData._bpmsData.history);
                        $scope.Data.showStatusPic = true;
                        $scope.Data.wordTemplateAvailable = res.data.wordTemplateAvailable;
                    });
                }
            },
            onStartProcessClick: function () {
                processKatebSrvc.startProcess($scope.Data.processInfoUid, $scope.Func.correctData()).then(function (res) {
                    $state.go("home.process.processTaskList");
                });
            },
            onCompleteProcessClick: function () {
                processKatebSrvc.completeProcess($scope.Data.processInfoUid, $scope.Func.correctData()).then(function (res) {
                    $state.go("home.process.processTaskList");
                });
            },
            getLetterList: function () {
                processKatebSrvc.getAllLetterList($scope.Data.orgUid).then(function (res) {
                    $scope.Data.lettersList = res.data;
                });
            },
            correctData: function () {
                if($scope.Data.selectedLetter){
                    $scope.Data.schemaEditModel.letter_title = $scope.Data.selectedLetter.title;
                    $scope.Data.schemaEditModel.letter_uid =  $scope.Data.selectedLetter.uid;
                }
                if($scope.Data.schemaEditModel.date){
                    $scope.Data.schemaEditModel.date = new Date($scope.Data.schemaEditModel.date).getTime();
                }
                if($scope.Data.schemaViewModel.date){
                    $scope.Data.schemaViewModel.date = new Date($scope.Data.schemaViewModel.date).getTime();

                }
                var  schemaViewModel =$scope.controller.schemaFormApiEdit.correctModel($scope.Data.schemaForm ,$scope.Data.schemaViewModel  );
                var  schemaEditModel =$scope.controller.schemaFormApiEdit.correctModel($scope.Data.schemaForm ,$scope.Data.schemaEditModel  );
                return {formData: angular.extend(schemaEditModel,schemaViewModel)}
            },
            removeExtraFields: function (data) {
                delete data.__$relations;
                delete __creationdDate;
                delete __creator;
                delete isDeleted;
                delete data._uid;
                delete data.displayString;
                return data;
            },
            getImage : function(id) {
                return katebSrvc.getFileURL(id);
            },
            onWordDownloadClick: function () {
                // processKatebSrvc.wordDownload($scope.Data.processInfoUid);
                var url = "api/vira_bpms/process/word/" + $scope.Data.processInfo.processInstanceId;
                $timeout(function () {
                    katebSrvc.downloadByLink(url,'88');
                },1);


            }
        };

        $scope.controller = {
            schemaFormApiView: {},
            schemaFormApiEdit: {},
            typeaheadApi: {
                getList: processKatebSrvc.getAllLetterList
            }
        }

        var Run = function () {
            $scope.Func.getLetterList();
            $scope.Func.getProcessInfo();
            $scope.Func.getTabList();
            $scope.Func.onTabClick($scope.Data.tabList[0]);
        }

        Run();
    });