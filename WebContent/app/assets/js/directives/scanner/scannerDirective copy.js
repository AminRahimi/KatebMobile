angular.module('scannerModule', []);

angular.module('scannerModule').directive('scanner', [
        /**
         * @memberOf scannerModule
         * @ngdoc directive
         * @description scanner
         * @name scanner
         * @attr model hash response of uploaded file
         * @example
         *  <scanner></scanner>
         */
        function() {
        return {
             scope: {
                model: "=",
                api:"=",
                options:"=",
                scanerStatus:"=",
                lastScannerVersion:"="
             },
             templateUrl: 'app/assets/js/directives/scanner/scannerTemplate.html',
             controller: function($scope, scannerSrvc, $timeout, fileSrvc, $http, $sce) {
                $scope.Data = {
                    scannerList: [],
                    selectedScaner: '',
                    pageSize: 'A4',
                    scanQuality: '300',
                    scanType: 'false',
                    validationClick: false,
                    lastScannerVersion : '7',
                    scannerLoading: false,
                    scanedFilesCounter: 0
                }

                $scope.Func = {
                    onPrevent: function (e){
                        e.preventDefault();
                        e.stopPropagation();
                    },
                    getScanersStatus: function () {
                        scannerSrvc.getScannerStatus().then(function (res) {
                           $scope.Data.scanerStatus = res;
                           $scope.scanerStatus = $scope.Data.scanerStatus;
                           if (angular.isFunction($scope.api.softwareReady)) {
                               $scope.api.softwareReady();
                           }
                        }, function () {
                            $scope.Data.scanerStatus = "";
                            $scope.scanerStatus = $scope.Data.scanerStatus;
                            if (angular.isFunction($scope.api.softwareReady)) {
                                $scope.api.softwareReady();
                            }
                        });
                    },
                    getScanersList: function () {
                        scannerSrvc.getScannerList().then(function (res) {
                            $scope.Data.scannerList = res.data;
                            if($scope.Data.scannerList.length){
                            	$scope.Data.selectedScaner = $scope.Data.scannerList[0];
                            }
                        });
                    },
                    onScanClick: function (scanUpload) {
                        $scope.pdfUrl = undefined;
                        $scope.Data.isScanning = true;
                        $scope.api.onScanClick();
                        $timeout(function () {
                            if ($scope.Data.scanerForm.$valid) {
                                $scope.Data.scannerLoading = true;
                                var query = $scope.Data.selectedScaner.uid;
                                $scope.scanUrl = "http://localhost:4220/viratech_automation_office/api/scan/" + query;
                                scannerSrvc.scanFile($scope.scanUrl).then(function (res) {
                                    //$scope.Data.scanedFilesCounter++;
                                    $scope.Data.scanedFilesCounter = res.data.count;
                                    $scope.Data.isScanning = false;
                                    $scope.Data.scannerLoading = false;
                                    if (scanUpload) {
                                        $scope.Func.onUploadClick();
                                    } else {
                                        scannerSrvc.cleanupScanner();
                                    }
                                });
                            } else {
                                $scope.Data.validationClick = true;
                            }
                        }, 0);
                    },
                    onUploadClick: function () {
                        $timeout(function () {
                                $scope.downloadUrl = "http://localhost:4220/viratech_automation_office/api/download?"+Date.now();
                                scannerSrvc.uploadFileWithoutDownloadingAgain($scope.downloadUrl).then(function (res) {
                                    var model = {
                                        name: res.name,
                                        hash: res.hash
                                    };
                                    $scope.model = model;
                                    // $scope.pdfUrl = fileSrvc.getFileURLForViewByFile({name:'letterPdf.html', hash:$scope.model.hash});
                                    $scope.pdfUrl = res.data;
                                    $scope.Data.scannerLoading = false;
                                    $scope.Data.scanedFilesCounter = 0;
                                    // $http.get($scope.downloadUrl,{responseType: 'arraybuffer'}).then(function (resp) {
                                    //     var blob = new Blob([resp.data], {type: "application/pdf"});
                                    //     var reader = new window.FileReader();
                                    //     reader.readAsDataURL(blob);
                                    //     reader.onloadend = function() {
                                    //         base64data = reader.result;
                                    //         $timeout(function () {
                                    //             $scope.pdfUrl = base64data;
                                    //             console.log($scope.pdfUrl);
                                    //             console.log("$scope.pdfUrl");
                                    //         }, 1);
                                    //     }
                                    // }, function () {
                                    //     katebSrvc.notificationModal('scannerError').then(function () {
                                    //         that.resetFn();
                                    //     });
                                    // });
                                    scannerSrvc.cleanupScanner();
                                }, function () {
                                    $scope.Data.scannerLoading = false;
                                });
                        }, 0);
                    },
                    onScanAndUploadClick: function () {
                        $scope.Func.onScanClick(true);
                    },
                    onRemoveClick: function () {
                        $scope.removeUrl = "http://localhost:4220/viratech_automation_office/api/clear";
                        scannerSrvc.removeFile($scope.removeUrl).then(function (res) {
                            //$scope.Data.scanedFilesCounter--;
                            $scope.Data.scanedFilesCounter = res.data.count;
                        });
                    },
                    trustSrc : function(src) {
                        return $sce.trustAsResourceUrl(src);
                    },
                    getPdfUrl : function(src) {
                        return $sce.trustAsResourceUrl("app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/" + src));
                    }
                };

                var init = function () {
                    $scope.Func.getScanersStatus();
                    $scope.Func.getScanersList();
                    scannerSrvc.registerFn(function () {
                        $scope.pdfUrl = undefined;
                    });
                    scannerSrvc.registerRest(function () {
                        $scope.Data.scannerLoading = false;
                        $scope.Data.isScanning = false;
                        $scope.pdfUrl = undefined;
                    });
                    $scope.lastScannerVersion = $scope.Data.lastScannerVersion;
                }

                init();
             }
        }
}]);

angular.module('scannerModule').factory('scannerSrvc', function (Restangular, $q, $http, Upload, katebSrvc) {
    var baseUrl = "http://localhost:4220/viratech_automation_office/api/";
    var fn = undefined;
    return {
        registerFn: function (fn) {
            this.fn = fn;
        },
        hidePDFViewer: function () {
        	if(this.fn){
        		this.fn();        		
        	}
        },
        getScannerStatus: function () {
            return  $http.get(baseUrl+"status");
        },
        getScannerList: function () {
            return $http.get(baseUrl+"scanners");
        },
        uploadFile: function (url) {
            var deffered = $q.defer(),
                model,
                formData = new FormData(),
                that = this;
            $http.get(url,{responseType: 'arraybuffer'}).then(function (res) {
            	var blob = new Blob([res.data], {type: "application/pdf"});
                formData.append('file', blob, 'scan.pdf');
                $.ajax({
                    url : "api/files/upload",
                    type: "POST",
                    data : formData,
                    processData: false,
                    contentType: false,
                    success:function(data, textStatus, jqXHR){
                        model = {
                            hash : data[0].hash,
                            name : data[0].name
                         };
                        deffered.resolve(model);
                    },
                    error: function(jqXHR, textStatus, errorThrown){
                        deffered.resolve(model);
                        //if fails
                    }
                });
            }, function () {
                katebSrvc.notificationModal('scannerError').then(function () {
                    that.resetFn();
                });
            });
            return deffered.promise;
        },
        uploadFileWithoutDownloadingAgain: function (url) {
            var deffered = $q.defer(),
                model,
                formData = new FormData(),
                that = this,
                base64data;
            $http.get(url,{responseType: 'arraybuffer'}).then(function (res) {
                    var blob = new Blob([res.data], {type: "application/pdf"});
                    if (blob && (blob.size > 0 || blob.getBytes().length>0)) {
                        formData.append('file', blob, 'scan.pdf');
                        var reader = new window.FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = function() {
                            base64data = reader.result;
                            // console.log("base64data" );
                            // console.log(base64data );
                        };
                        $.ajax({
                            url : "api/files/upload",
                            type: "POST",
                            data : formData,
                            processData: false,
                            contentType: false,
                            success:function(data, textStatus, jqXHR){
                                model = {
                                    hash : data[0].hash,
                                    name : data[0].name,
                                    data : base64data
                                };
                                deffered.resolve(model);
                            },
                            error: function(jqXHR, textStatus, errorThrown){
                                deffered.resolve(model);
                                //if fails
                            }
                        });
                    } else {
                        vtShowMessageSrvc.showMassage('error', 'خطا', 'حجم فایل برای آپلود باید بیشتر از صفر باشد');
                    }
            }, function () {
                deffered.reject();
                katebSrvc.notificationModal('scannerError').then(function () {
                    that.resetFn();
                });
            });
            return deffered.promise;
        },
        registerRest: function (fn) {
            this.resetFn = fn;
        },
        scanFile: function (url) {
            var deffered = $q.defer();
            $http.get(url).then(function (res) {
                deffered.resolve(res);
            });
            return deffered.promise;
        },
        removeFile: function (url) {
            var deffered = $q.defer();
            $http.get(url).then(function (res) {
                deffered.resolve(res);
            });
            return deffered.promise;
        },
        cleanupScanner: function() {
            return $http.get(baseUrl+'cleanup');
        }
    };
});
