angular.module('scannerModule').controller('pdfReviewModalCtrl', function($scope, $timeout, $modalInstance, readyImages, $q, Upload) {
    var maxLengthBase64PDF = 26214400;
    $scope.Data = {
        readyImages: readyImages,
        pdfBase64: {},
        showVtPdf: false,
        pdfBlobUrl: "",
        pdfFileSize: 0,
        pdfBlobUrlOptimal: "",
        pdfFileSizeOptimal: 0,
        optimal: false,
        isLoadingUploadAndClose: false,
        isLoadingUploadAndReScan: false,
        onSaveClicked: false,
        fileName:'',
        labels: [],
    };
    
    $scope.Func = {
        onSaveClick: function(mode) {
                if(mode === 'close'){
                    $scope.Data.isLoadingUploadAndClose = true;
                } else {
                    $scope.Data.isLoadingUploadAndReScan = true;
                }
                
                var base64 = $scope.Data.pdfBase64;

                var fileName = $scope.Data.fileName.trim() || 'fromPDFCreator';
                var file = $scope.Func.convertBase64ToFile(base64,fileName);
                $scope.Func.upload(file).then(function(res) {
                    var data = {
                        hash: res[0].hash,
                        name: res[0].name,
                    };
                    $modalInstance.close(data);
                });
                $scope.Data.onSaveClicked =true;
        },
        onCancelClick : function() {
            $modalInstance.dismiss('cancel');
        },
        upload: function (file) {
            var defer = $q.defer();
            Upload.upload({
                url: 'api/files/upload',
                data: {
                    file: file
                }
            }).progress(function (evt) {
            
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (r) {
                $scope.Data.isLoadingUploadAndClose = false;
                $scope.Data.isLoadingUploadAndReScan = false;
            });
            return defer.promise
        },
        convertBase64toBlobUrl: function(base64){
            var blobBin = atob(base64.split(',')[1]);
            var array = [];
            for(var i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            var blob = new Blob([new Uint8Array(array)], {type: base64.split(',')[0].match(/:(.*?);/)[1]});
            return {url: URL.createObjectURL(blob), size: blob.size};
        },
        convertBase64ToFile: function(base64, filename) {
            var arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename + '.pdf', {type:mime});
        },
        generatePDF: function(images, isMin) {
            var defer = $q.defer();
            var worker = new Worker('app/assets/js/directives/scanner/scanWorker.js');
            worker.postMessage({ images: images , isMin: isMin});
            worker.onmessage = function (event){
                defer.resolve(event.data);
            };
            return defer.promise.then(function (res) {
                worker.terminate();
                return res;
            });
        },
        onChangeOptimal: function() {
            $scope.Data.showVtPdf = false;
            if($scope.Data.optimal){
                if(!$scope.Data.pdfBlobUrlOptimal){
                    $scope.Func.generatePDF($scope.Data.readyImages, true).then(function(res) {
                        $scope.Data.pdfBase64Optimal = res;
                        if($scope.Data.pdfBase64Optimal.length < maxLengthBase64PDF) {
                            var blob = $scope.Func.convertBase64toBlobUrl($scope.Data.pdfBase64Optimal);
                            $scope.Data.pdfBlobUrlOptimal = blob.url;
                            $scope.Data.pdfFileSizeOptimal = blob.size;
                            $scope.Apis.vtPDF.pdfUrl = $scope.Data.pdfBlobUrlOptimal;
                            $scope.Apis.vtPDF.isLargeSizeError = false;
                        } else {
                            $scope.Apis.vtPDF.isLargeSizeError = true;
                        }
                        $scope.Data.showVtPdf = true;
                    });
                } else {
                    $timeout(function() {
                        $scope.Apis.vtPDF.pdfUrl = $scope.Data.pdfBlobUrlOptimal;
                        $scope.Data.showVtPdf = true;
                    }, 1000);
                    
                }
            } else {
                if(!$scope.Data.pdfBlobUrl){
                    $scope.Func.generatePDF($scope.Data.readyImages, false).then(function(res) {
                        $scope.Data.pdfBase64 = res;
                        if($scope.Data.pdfBase64.length < maxLengthBase64PDF) {
                            var blob = $scope.Func.convertBase64toBlobUrl($scope.Data.pdfBase64);
                            $scope.Data.pdfBlobUrl = blob.url;
                            $scope.Data.pdfFileSize = blob.size;
                            $scope.Apis.vtPDF.pdfUrl = $scope.Data.pdfBlobUrl;
                            $scope.Apis.vtPDF.isLargeSizeError = false;
                        } else {
                            $scope.Apis.vtPDF.isLargeSizeError = true;
                        }
                        $scope.Data.showVtPdf = true;
                    });
                } else {
                    $timeout(function() {
                        $scope.Apis.vtPDF.pdfUrl = $scope.Data.pdfBlobUrl;
                        $scope.Data.showVtPdf = true;
                    }, 1000);
                }
            }
        },
        onKeyDownFileNameInput: function(event) {
            if($scope.Data.isLoadingUploadAndClose || $scope.Data.isLoadingUploadAndReScan || !$scope.Data.showVtPdf || (!$scope.Data.fileName && $scope.Data.onSaveClicked)){
                // disabled
            } else {
                if(event.key === 'Enter' && !event.ctrlKey){
                    $scope.Func.onSaveClick('reScan');
                } else if(event.key === 'Enter' && event.ctrlKey) {
                    $scope.Func.onSaveClick('close');
                }
            }
        }
    };
    
    $scope.Apis = {
        vtPDF: {
            isBlob: true,
            pdfUrl: "",
            isLargeSizeError: false
        }
    };
    
    var Run = function() {
        $scope.Func.generatePDF($scope.Data.readyImages, false).then(function(res) {
            $scope.Data.pdfBase64 = res;
            if($scope.Data.pdfBase64.length < maxLengthBase64PDF){
                var blob = $scope.Func.convertBase64toBlobUrl($scope.Data.pdfBase64);
                $scope.Data.pdfBlobUrl = blob.url;
                $scope.Data.pdfFileSize = blob.size;
                $scope.Apis.vtPDF.pdfUrl = $scope.Data.pdfBlobUrl;
                $scope.Apis.vtPDF.isLargeSizeError = false;
            } else {
                $scope.Apis.vtPDF.isLargeSizeError = true;
            }
            $scope.Data.showVtPdf = true;
        });
       
    };
    
    Run();
    
});
