angular.module('vtFolderSelector', []).directive('vtFolderSelector', function () {

    return {
        restrict: 'EA',
        templateUrl: 'app/assets/js/directives/vtFolderSelector/vtFolderSelector.html',
        scope: {
            model: "=",         // main date binding
            hasUpload: "=?",    // if TRUE then user can upload selected folder
            uploadFn: "&?",     // function of upload request
            isEditMode: "=?",   // view or edit mode - Boolean
            formName: "=?",     // name of form
            required:"=?" , 
            modernizationCodePlacement: "=?"
        },
        controller: function ($scope, configObj, $modal, $interval, vtFolderSelectorSrvc, $timeout, appConst) {
            $scope.Data = {

                isLogin: configObj.userConfig.connectedToGanjeh,
                archivedType: "",
                validationClicked: true,
                archivedTypesList: configObj.externalArchives,
                systemTagsMap: configObj.userConfig.organization.code === 'sima-va-manzar' ? appConst.systemTagSimaManzar : appConst.systemTag,
                archiveType: "modernizationCode",
                modernizationCodePopoverIsOpen: false,
                rcShow: null,
                modernizationCodeRegionDisabled: false,
                formName:'',
                modernizationCode: {
                    region: null
                }
            };
            $scope.Func = {
                checkGanjehLogin: function (){
                    vtFolderSelectorSrvc.checkUserIsLoginToGanjeh().then(function (res) {
                        if (res.data.isLogin) {
                            $scope.Data.isLogin = true;
                        } else {
                            $scope.Data.isLogin = false;
                        }
                    });
                },
                onEnterToGanjehClick: function () {
                    // Fixes dual-screen position                         Most browsers      Firefox
                    // var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
                    // var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
                    // var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                    // var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                    // var systemZoom = width / window.screen.availWidth;
                    // var left = (width - 900) / 2 / systemZoom + dualScreenLeft;
                    // var top = (height - 500) / 2 / systemZoom + dualScreenTop;
                    var w = 500;
                    var h = 500;
                    var left = (screen.width - w) / 2;
                    var top = (screen.height - h) / 4;
                    var form = document.createElement("form");
                    var form = document.createElement("form");
                    form.setAttribute("method", "get");
                    form.setAttribute("action", "./api/ganjeh/nodes");
                    form.setAttribute("target", "view");
                    document.body.appendChild(form);
                    var viewWindowPopup = window.open('', 'view', "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
                    form.submit();
                    var viewWindowPopupInterval = $interval(function () {
                        if (viewWindowPopup.closed) {
                            $interval.cancel(viewWindowPopupInterval);
                            $scope.Func.checkGanjehLogin();

                        }
                    }, 2000);
                },
                onChooseFolderClick: function () {
                    vtFolderSelectorSrvc.checkUserIsLoginToGanjeh().then(function (res) {
                        if (res.data.isLogin) {
                            $scope.Data.isLogin = true;
                            var modalInstance = $modal.open({
                                templateUrl: 'app/assets/js/directives/vtFolderSelector/modal/chooseFolderModal.html',
                                controller: 'chooseFolderModalCtrl',
                                size: 'lg',
                                windowClass: 'vt-Folder-Selector-window-class',
                                resolve: {
                                    hasUpload: function () {
                                        return $scope.hasUpload;
                                    }
                                }
                            });
                            modalInstance.result.then(function (res) {
                                $scope.model.folderUid = res.selectedNode.uid ? res.selectedNode.uid : res.selectedNode._uid;
                                $scope.model.title = res.selectedNode.title ? res.selectedNode.title : res.selectedNode.name;
                                $scope.model.path = res.selectedNodePathList;
                                $scope.model.realUser = {
                                    uid : configObj.userConfig.uid,
                                    title: configObj.userConfig.title
                                };

                                if(res.selectedNode.label) {
                                    $scope.model.label = res.selectedNode.label;
                                }
                                $timeout(function () {
                                    if ($scope.hasUpload && $scope.uploadFn && angular.isFunction($scope.uploadFn)) {
                                        $scope.uploadFn();
                                    }
                                }, 1);
                            }, function (errRes) {
                            });
                        } else {
                            $scope.Data.isLogin = false;
                        }
                    });
                },
                onArchivedTypesChange: function (archivedType) {
                    if (!archivedType) {
                        $scope.model = undefined;
                        return;
                    }
                    switch (archivedType.key) {
                        case "GANJEH":
                            $scope.model = {
                                type: "GANJEH"
                            };
                            break;
                        case "SAMAN_SHAHR":
                            $scope.model = {
                                type: "SAMAN_SHAHR"
                            };
                            break;
                        case "DIDGAH":
                            $scope.model = {
                                type: "DIDGAH"
                            };
                            break;
                         case "OTHER":
                            $scope.model = null;
                            break;
                    }
                },
                onSubmitAndUploadClick: function () {
                        $timeout(function () {
                            if ($scope.hasUpload && $scope.uploadFn && angular.isFunction($scope.uploadFn)) {
                                $scope.uploadFn();
                            }
                        }, 1);


                },
                onModernizationCodeKeypress: function (event, item, length) {
                    if (event.charCode == 32) {
                        event.preventDefault();
                        return false;
                    } else if (item && item.length >= length) {
                        event.preventDefault();
                        return false;
                    }
                },
                onModernizationCodeChange: function () {
                    //$scope.model.rc = ($scope.Data.modernizationCode.region || '') + ($scope.Data.modernizationCode.district || '') + ($scope.Data.modernizationCode.blocks || '') + ($scope.Data.modernizationCode.house || '') + ($scope.Data.modernizationCode.building || '') + ($scope.Data.modernizationCode.apartment || '') + ($scope.Data.modernizationCode.guild || '');
                    $scope.model.rc = '';
                    if($scope.Data.modernizationCode.region && $scope.Data.modernizationCode.region.length > 0){
                        $scope.model.rc += $scope.Data.modernizationCode.region;
                    }
                    if($scope.Data.modernizationCode.district && $scope.Data.modernizationCode.district.length > 0){
                        $scope.model.rc += '-' + $scope.Data.modernizationCode.district;
                    }
                    if($scope.Data.modernizationCode.blocks && $scope.Data.modernizationCode.blocks.length > 0){
                        $scope.model.rc += '-' + $scope.Data.modernizationCode.blocks;
                    }
                    if($scope.Data.modernizationCode.house && $scope.Data.modernizationCode.house.length > 0){
                        $scope.model.rc += '-' + $scope.Data.modernizationCode.house;
                    }
                    if($scope.Data.modernizationCode.building && $scope.Data.modernizationCode.building.length > 0){
                        $scope.model.rc += '-' + $scope.Data.modernizationCode.building;
                    }
                    if($scope.Data.modernizationCode.apartment && $scope.Data.modernizationCode.apartment.length > 0){
                        $scope.model.rc += '-' + $scope.Data.modernizationCode.apartment;
                    }
                    if($scope.Data.modernizationCode.guild && $scope.Data.modernizationCode.guild.length > 0){
                        $scope.model.rc += '-' + $scope.Data.modernizationCode.guild;
                    }
                    $scope.Data.rcShow = ($scope.Data.modernizationCode.region || '') + " - " + ($scope.Data.modernizationCode.district || '') + " - " + ($scope.Data.modernizationCode.blocks || '') + " - " + ($scope.Data.modernizationCode.house || '') + " - " + ($scope.Data.modernizationCode.building || '') + " - " + ($scope.Data.modernizationCode.apartment || '') + " - " + ($scope.Data.modernizationCode.guild || '');
                }
            };

            var Run = function () {
                $scope.Func.checkGanjehLogin();
                var shouldAddOther = false;
                angular.forEach($scope.Data.archivedTypesList, function (type) {
                    if (type.key === "OTHER") {
                        shouldAddOther = true
                    }
                });

                var otherArchiveTypeObj = { key: 'OTHER', value: 'سایر' , $$hashKey: 'object:225'};
                if (!shouldAddOther) {
                    $scope.Data.archivedTypesList.push(otherArchiveTypeObj)
                }

                if (!$scope.model && !$scope.required) {
                    $scope.Data.archivedType = otherArchiveTypeObj;
                }

                if(configObj.userConfig && configObj.userConfig.organization && configObj.userConfig.organization.code) {
                    switch (configObj.userConfig.organization.code) {
                        case 'M1':
                            $scope.Data.modernizationCode.region = '01';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M2':
                            $scope.Data.modernizationCode.region = '02';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M4':
                            $scope.Data.modernizationCode.region = '04';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M5':
                            $scope.Data.modernizationCode.region = '05';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M6':
                            $scope.Data.modernizationCode.region = '06';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M7':
                            $scope.Data.modernizationCode.region = '07';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M8':
                            $scope.Data.modernizationCode.region = '08';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M9':
                            $scope.Data.modernizationCode.region = '09';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M11':
                            $scope.Data.modernizationCode.region = '11';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                        case 'M12':
                            $scope.Data.modernizationCode.region = '12';
                            $scope.Data.modernizationCodeRegionDisabled = true;
                            break;
                    }
                }
                var unbindWatcher = $scope.$watch('model', function () {
                    if ($scope.model && $scope.model.type) {
                        angular.forEach($scope.Data.archivedTypesList, function (archivedType) {
                            if ($scope.model.type === archivedType.key) {
                                $scope.Data.archivedType = archivedType;
                                unbindWatcher();
                            }
                        });
                    }
                    if($scope.model && $scope.model.rc) {
                        $scope.Data.rcShow = angular.copy($scope.model.rc);
                    }
                });
                $scope.$watch('Data.modernizationCodePopoverIsOpen', function() {
                    if ($scope.Data.modernizationCodePopoverIsOpen == true) {
                        $timeout(function () {
                            if (!$scope.Data.modernizationCode) {
                                document.getElementById("region").focus();
                            } else {
                                if (!$scope.Data.modernizationCode.region || $scope.Data.modernizationCode.region.length != 2) {
                                    document.getElementById("region").focus();
                                } else if (!$scope.Data.modernizationCode.district || $scope.Data.modernizationCode.district.length != 2) {
                                    document.getElementById("district").focus();
                                } else if (!$scope.Data.modernizationCode.blocks || $scope.Data.modernizationCode.blocks.length != 5) {
                                    document.getElementById("blocks").focus();
                                } else if (!$scope.Data.modernizationCode.house || $scope.Data.modernizationCode.house.length != 5) {
                                    document.getElementById("house").focus();
                                } else if (!$scope.Data.modernizationCode.building || $scope.Data.modernizationCode.building.length != 5) {
                                    document.getElementById("building").focus();
                                } else if (!$scope.Data.modernizationCode.apartment || $scope.Data.modernizationCode.apartment.length != 5) {
                                    document.getElementById("apartment").focus();
                                } else if (!$scope.Data.modernizationCode.guild || $scope.Data.modernizationCode.guild.length != 5) {
                                    document.getElementById("guild").focus();
                                }
                            }
                        }, 300);
                        $(document).mouseup(function (e) {
                            var container = $(".popover");
                            // if the target of the click isn't the container nor a descendant of the container
                            if (!container.is(e.target) && container.has(e.target).length === 0 && e.target.id != "modernizationCodePopover") {
                                // container.hide();
                                $timeout(function () {
                                    $scope.Data.modernizationCodePopoverIsOpen = false;
                                }, 1);
                            }
                        });
                    }
                });
            };

            Run();

        }
    }

});
