angular.module('letterTabModule', []);

angular.module('letterTabModule').directive('letterBody', [
    /**
     * @memberOf letterModule
     * @ngdoc directive
     * @description Preview and upload letter
     * @name letterBody
     * @param {service} fileSrvc
     * @attr {object} ng-model
     * @attr {boolean} is-edit-mode
     * @example
     *  <letter-body ng-model="" is-edit-mode=""></letter-body>
     */
    function () {
        return {
            restrict: 'AE',
            scope: {
                model: "=",
                isEditMode: "=",
                onFileUploaded: "=",
                api: "=?",
                pdfFile: "=",
                type: "="
            },
            templateUrl: 'app/assets/js/directives/letterTab/letterBodyTemplate.html?vtPreventCache=' + new Date().getTime(),
            controller: function ($scope, fileSrvc, $sce, scannerSrvc, configObj) {
                $scope.api = $scope.api || {};
                $scope.api.setPdfUrl = function (model) {
                    if (model) {
                        if ($scope.pdfFile) {
                            $scope.pdfUrl = $scope.pdfFile;
                        }
                        $scope.pdfUrl = fileSrvc.getFileURLForViewByFile({name: 'letterPdf.html', hash: model.hash});
                    } else
                        $scope.pdfUrl = undefined;
                }

                $scope.api.setPdfUrlWithInformation = function () {
                    scannerSrvc.hidePDFViewer();
                    if ($scope.pdfFile) {
                        $scope.pdfUrl = $scope.pdfFile;
                    } else {
                        $scope.pdfUrl = undefined;
                    }
                }

                $scope.onFileUploaded = function (model) {
                    scannerSrvc.hidePDFViewer();
                    $scope.api.setPdfUrl(model);
                    if(angular.isFunction($scope.api.onPdfUploaded)){
                        $scope.api.onPdfUploaded(model);
                    }
                }
                $scope.onRemoveFile = function (model) {
                    $scope.pdfUrl = null;
                }
                $scope.getPdfUrl = function (url) {
                    url = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/" + url);
                    return $sce.trustAsResourceUrl(url)
                }
                if (_.isFunction($scope.api.onInit)) {
                    $scope.api.onInit();
                }
            }
        }
    }]);

angular.module('letterTabModule').directive('letterAttachment', [
    /**
     * @memberOf letterModule
     * @ngdoc directive
     * @description Preview and upload letter
     * @name letterAttachment
     * @param {service} secretariatSrvc
     * @param {service} katebSrvc
     * @attr {object} ng-model
     * @attr {boolean} is-edit-mode
     * @example
     *  <letter-attachment ng-model="" is-edit-mode=""></letter-attachment>
     */
    function () {
        return {
            restrict: 'AE',
            scope: {
                model: "=",
                isEditMode: "="
            },
            templateUrl: 'app/assets/js/directives/letterTab/letterAttachmentTemplate.html?vtPreventCache=' + new Date().getTime(),
            controller: function ($scope, $modal, secretariatSrvc, katebSrvc, fileSrvc, $rootScope, $interval, configObj, $q, $timeout) {

                $scope.Data = {
                    attachmentType: 'Turn',
                    letter: {},
                    validationClicked: false,
                    attachmentList: [],
                    letterBodyType: "doc,docx,xls,xlsx,pdf,png,jpg,jpeg,rar,zip,txt,dwg,dxf,dwf,DOC,DOCX,XLS,XLSX,PDF,PNG,JPG,JPEG,RAR,ZIP,TXT,DWG,DXF,DWF",
                    chooseLetterType: 'COMPUTER',
                    scanerStatus: "",
                    lastScannerVersion: "",
                    isLogin: configObj.userConfig.connectedToGanjeh,
                    ganjehFiles: null
                };

                $scope.Func = {
                    onAddAttachments: function () {
                        if ($scope.letterAttachementForm.$invalid) {
                            $scope.Data.validationClicked = true;
                        } else {
                            $scope.Data.validationClicked = false;
                            var attachments = {};
                            var setAttachments = function (file) {
                                if (file) {
                                    $scope.Data.file = file;
                                }
                                attachments = {
                                    type: $scope.Data.chooseLetterType == 'LETTER' ? 'LETTER' : 'FILE',
                                    relationTypeKey: $scope.Data.attachmentType,
                                    fileBody: $scope.Data.chooseLetterType != 'LETTER' ? $scope.Data.file : null,
                                    letterBody: ($scope.Data.chooseLetterType == 'LETTER' && $scope.Data.attachLetter) ? {
                                        uid: $scope.Data.attachLetter.uid,
                                        title: $scope.Data.attachLetter.internalNumber + '-' + $scope.Data.attachLetter.subject
                                    } : null,
                                    description: $scope.Data.description
                                }
                                if(!$scope.model){
                                    $scope.model = [];
                                }
                                $scope.model.push(attachments);
                            };
                            if ($scope.Data.ganjehFiles && $scope.Data.ganjehFiles.length > 0) {
                                angular.forEach($scope.Data.ganjehFiles, function (file) {
                                    setAttachments(file);
                                });
                            } else {
                                setAttachments(null);
                            }
                            $scope.Data.attachmentList.push($scope.Data.attachLetter);
                            $scope.Data.chooseLetterType = 'COMPUTER';
                            $scope.Data.attachmentType = 'Turn';
                            $scope.Data.file = null;
                            $scope.Data.description = null;
                            $scope.Data.attachLetter = null;
                            $scope.Data.ganjehFiles = null;
                        }
                    },
                    onReception: function (file) {
                        katebSrvc.downloadByLink('files/?mode=download&fcode=' + file.hash );
                    },
                    onRemove: function (index) {
                        $scope.model.splice(index, 1);
                        $scope.Data.attachmentList.splice(index, 1);
                    },
                    onSelectLetter: function () {
                        var modalInstance = $modal.open({
                            templateUrl: 'app/modules/kateb/allLetterModal/allLetterModal.html',
                            controller: 'allLetterModalCtrl',
                            size: 'lg',
                            resolve: {
                                // serverResponse: function () {
                                //     return function (start, len) {
                                //         return secretariatSrvc.getAllLettersList($rootScope.currentUserOrg.uid, start, len)
                                //     }
                                // },
                                // searchAllLettersList: function () {
                                //     return function (query, start, len) {
                                //         return secretariatSrvc.searchAllLettersList($rootScope.currentUserOrg.uid, query, start, len)
                                //     }
                                // }

                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                            $scope.Data.attachLetter = selectedItem;
                        });
                    },
                    onShowLetterModalClick: function (index) {
                        var modalInstance = $modal.open({
                            templateUrl: 'app/assets/js/directives/letterTab/letterAttachedPreviewModal.html',
                            controller: 'letterAttachedPreviewCtrlModal',
                            size: 'lg',
                            resolve: {
                                pdfUrl: function () {
                                    return "api/letter/pdf/" + $scope.model[index].letterBody.uid;//fileSrvc.getFileURLForViewByFile({name:$scope.Data.attachmentList[index].fileBody.name, hash:$scope.Data.attachmentList[index].fileBody.hash});
                                }
                            }
                        });
                        modalInstance.result.then(function () {

                        });
                    },
                    checkFileType: function (file) {
                        var type = 'none';
                        if (file && file.name) {
                            if (file.name.indexOf('.pdf') !== -1) {
                                type = 'pdf';
                            } else if (file.name.indexOf('.doc') !== -1) {
                                type = 'doc';
                            } else if (file.name.indexOf('.xls') !== -1) {
                                type = 'xls'
                            } else if (file.name.indexOf('.jpg') !== -1 || file.name.indexOf('.png') !== -1) {
                                type = 'img';
                            } else if (file.name.indexOf('.mp4') !== -1 ||
                                file.name.indexOf('.mp3') !== -1 ||
                                file.name.indexOf('.wav') !== -1 ||
                                file.name.indexOf('.wma') !== -1 ||
                                file.name.indexOf('.ogg') !== -1 ||
                                file.name.indexOf('.amr') !== -1 ||
                                file.name.indexOf('.mid') !== -1) {
                                type = 'mp3';
                            }
                        }
                        return type;
                    },
                    onChooseLetterTypeChange: function (type) {
                        $scope.Data.file = "";
                        $scope.Data.attachLetter = "";
                        $scope.Data.isSoftwareReady = false;
                    },
                    onEnterToGanjehClick: function () {
                        // Fixes dual-screen position                         Most browsers      Firefox
                        // var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
                        // var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;
                        // var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
                        // var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
                        // var systemZoom = width / window.screen.availWidth;
                        // var left = (width - 100) / 2 / systemZoom + dualScreenLeft;
                        // var top = (height - 500) / 2 / systemZoom + dualScreenTop;
                        var w = 500;
                        var h = 500;
                        var left = (screen.width - w) / 2;
                        var top = (screen.height - h) / 4;
                        var form = document.createElement("form");
                        form.setAttribute("method", "get");
                        form.setAttribute("action", "./api/ganjeh/login");
                        form.setAttribute("target", "view");
                        document.body.appendChild(form);
                        var viewWindowPopup = window.open('', 'view', "toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
                        form.submit();
                        var viewWindowPopupInterval = $interval(function () {
                            if (viewWindowPopup.closed) {
                                $interval.cancel(viewWindowPopupInterval);
                                console.log("viewWindowPopup is closed!");
                                secretariatSrvc.checkUserIsLoginToGanjeh().then(function (res) {
                                    if (res.data.isLogin) {
                                        $scope.Data.isLogin = true;
                                        // $scope.Data.accessToken = res.data.accessToken;
                                    } else {
                                        $scope.Data.isLogin = false;
                                    }
                                });
                            }
                        }, 2000);
                    },
                    checkGanjehLogin: function (){
                        secretariatSrvc.checkUserIsLoginToGanjeh().then(function (res) {
                            $scope.Data.isLogin = res.data.isLogin;
                        });
                    },
                    onChooseFileClick: function () {
                        var options = {
                            ganjehDomain: configObj.config.ganjeh.path,
                            // ganjehDomain: "http://localhost:7080/Ganjeh",
                            success: function (files) {
                                $scope.Func.moveFileToKateb(files);
                            },
                            cancel: function () {
                               
                            },
                            multiselect: true,
                            extensions: ["pdf", "jpg"],
                            sizelimit: 1048576
                        };
                        secretariatSrvc.checkUserIsLoginToGanjeh().then(function (res) {
                            options.accessToken = res.data.access_token;
                            $scope.Data.isLogin = res.data.isLogin;
                            $timeout(function () {
                                window.ganjehChooser.choose(options);
                            }, 1);
                        });
                    },
                    moveFileToKateb: function (files) {
                        var promises = [];
                        $scope.Data.ganjehFiles = [];
                        angular.forEach(files, function (file) {
                            promises.push(secretariatSrvc.moveFileToKateb(file).then(function (response) {
                                $scope.Data.ganjehFiles.push(response.data.originalElement);
                            }));
                        });
                        $q.all(promises).then(function (response) {
                            console.log($scope.Data.ganjehFiles);
                        });
                    }
                };

                $scope.controller = {
                    scanner: {
                        onFileScanned: function (hashNameObj) {
                            $scope.controller.letterBody.setPdfUrl(hashNameObj);
                        },
                        options: {
                            isHidenPDFViewer: true
                        },
                        softwareReady: function () {
                            $scope.Data.isSoftwareReady = true;
                        }
                    },
                    letterBody: {}
                };

                $scope.controller.scanner.onScanClick = function () {
                    $scope.controller.letterBody.setPdfUrl(undefined);
                };

                $scope.Func.checkGanjehLogin();

            }
        }
    }])
    .controller('letterAttachedPreviewCtrlModal', function ($scope, pdfUrl, $timeout) {
        $scope.api = {
            showLetter: {
                canSign: false,
                pdfUrl: pdfUrl
            }
        };
    });
