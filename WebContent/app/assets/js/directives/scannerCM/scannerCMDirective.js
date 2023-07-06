angular.module('scannerCMModule', []);

angular.module('scannerCMModule').directive('scannerCm', [
        /**
         * @memberOf scannerCMModule
         * @ngdoc directive
         * @description scannerCM
         * @name scannerCM
         * @attr model hash response of uploaded file
         * @example
         *  <scannerCM></scannerCM>
         */
        function() {
        return {
             scope: {
                model: "=",
                api:"="
             },
             templateUrl: 'app/assets/js/directives/scannerCM/scannerCMTemplate.html',
             controller: function($scope, scannerCMSrvc, $timeout, fileSrvc) {
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
                        scannerCMSrvc.getScannerStatus().then(function (res) {
                           $scope.Data.scanerStatus = res;
                        });
                    },
                    getScanersList: function () {
                        scannerCMSrvc.getScannerList().then(function (res) {
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
                                scannerCMSrvc.scanFile($scope.scanUrl).then(function (res) {
                                    //$scope.Data.scanedFilesCounter++;
                                    $scope.Data.scanedFilesCounter = res.data.count;
                                    $scope.Data.isScanning = false;
                                    $scope.Data.scannerLoading = false;
                                    if (scanUpload) {
                                        $scope.Func.onUploadClick();
                                    }
                                });
                            } else {
                                $scope.Data.validationClick = true;
                            }
                        }, 0);
                    },
                    onUploadClick: function () {
                        $timeout(function () {
                                $scope.downloadUrl = "http://localhost:4220/viratech_automation_office/api/download";
                                scannerCMSrvc.uploadFile($scope.downloadUrl).then(function (res) {
                                    $scope.model = res;
                                    $scope.pdfUrl = fileSrvc.getFileURLForViewByFile({name:'letterPdf.html', hash:$scope.model.hash});
                                    $scope.Data.scannerLoading = false;
                                    $scope.Data.scanedFilesCounter = 0;
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
                        scannerCMSrvc.removeFile($scope.removeUrl).then(function (res) {
                            //$scope.Data.scanedFilesCounter--;
                            $scope.Data.scanedFilesCounter = res.data.count;
                        });
                    }
                };

                var init = function () {
                    $scope.Func.getScanersStatus();
                    $scope.Func.getScanersList();
                    scannerCMSrvc.registerFn(function () {
                        $scope.pdfUrl = undefined;
                    });
                    scannerCMSrvc.registerRest(function () {
                        $scope.Data.scannerLoading = false;
                        $scope.Data.isScanning = false;
                        $scope.pdfUrl = undefined;
                    });
                }

                init();
             }
        }
}]);

angular.module('scannerCMModule').factory('scannerCMSrvc', function (Restangular, $q, $http, Upload, katebSrvc) {
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
                    if (blob && (blob.size > 0 || blob.getBytes().length > 0)) {
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
                    } else {
                        vtShowMessageSrvc.showMassage('error', 'خطا', 'حجم فایل برای آپلود باید بیشتر از صفر باشد');
                    }
            }, function () {
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
        }
    };
});
