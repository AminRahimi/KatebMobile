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
             controller: function($scope, $state, scanSrvc, $timeout, $window, $document, $q, $modal, $filter, vtShowMessageSrvc) {
                const maxLengthBase64PDF = 26214400;
                $scope.Data = {
                    scannerList: {},
                    selectedScaner: {},
                    readyImages: [],
                    imagesBase64: [],
                    selectedIndexImage: 0,
                    selectedImages: [],
                    readyImagesSelectAll: false,
                    pdfBase64: "",
                    isLoadingStartScan: false,
                    isLoadingAddFromLocal: false,
                    scannerStatus: false,
                    scanForm: {},
                    filesScanned: [],
                    filesDeleted: [],
                    scrollElement: {},
                    imagesSelectedFromLocal: []
                };
            
                $scope.Func = {
                    getScanersList: function () {
                        scanSrvc.getScannerList().then(function (res) {
                            $scope.Data.scannerList = res.data;
                            if($scope.Data.scannerList.length){
                                $scope.Data.selectedScaner = $scope.Data.scannerList[0];
                            }
                        });
                    },
                    onClickStartScan: function() {
                        $scope.Data.isLoadingStartScan = true;
                        $scope.Func.pushReadyImagesFromScanner();
                    },
                    onClickAddFromLocal: function(images) {
                        if(images && images.length > 0) {
                            $scope.Data.imagesSelectedFromLocal = images;
                            $scope.Data.isLoadingAddFromLocal = true;
                            $scope.Func.onPushReadyImagesFromLocal(0);
                        }
                    },
                    onClickRotate: function(degree) {
                        angular.forEach($scope.Data.selectedImages, function(image) {
                            $scope.Func.rotateImage(image.base64, degree).then(function(res) {
                                image.base64 = res.base64;
                                image.base64Min = res.base64Min;
                                image.width = res.width;
                                image.height = res.height;
                            });
                        });
                    },
                    onClickRemove: function() {
                        angular.forEach($scope.Data.selectedImages, function(image) {
                            $scope.Data.readyImages.splice(image.index, 1);
                            $scope.Data.filesDeleted.push(image.uid);
                            $scope.Func.getSelectedImages();
                        });
                        $scope.Data.readyImagesSelectAll = false;
                    },
                    onClickGeneratePDF: function() {
                        $scope.Func.onOpenPdfReviewModal();
                    },
                    pushReadyImagesFromScanner: function() {
                        scanSrvc.onScan($scope.Data.selectedScaner.uid).then(function() {
                            scanSrvc.getFileUidList().then(function(res) {
                                $scope.Data.filesScannedUid = res.data;
                                $scope.Func.onPushReadyImagesFromScanner(0);
                            }, function() {
                                $scope.Data.isLoadingStartScan = false;
                            });
                        }, function() {
                            $scope.Data.isLoadingStartScan = false;
                        });
                    },
                    onPushReadyImagesFromScanner: function(index) {
                        var isDuplicate = false;
                        var endWhile = false;
                        var i = 0;
                        var filesDisabled = [];
                        if($scope.Data.filesScanned.length > 0 && !$scope.Data.filesDeleted.length){
                            filesDisabled = $scope.Data.filesScanned;
                        } else if($scope.Data.filesDeleted.length > 0 && !$scope.Data.filesScanned.length){
                            filesDisabled = $scope.Data.filesDeleted;
                        } else if($scope.Data.filesScanned.length > 0 && $scope.Data.filesDeleted.length > 0){
                            filesDisabled = $scope.Data.filesScanned.concat($scope.Data.filesDeleted);
                        }
                        while (!endWhile){
                            if(i == filesDisabled.length){
                                endWhile = true;
                            } else {
                                if(filesDisabled[i] == $scope.Data.filesScannedUid[index]){
                                    isDuplicate = true;
                                    endWhile = true;
                                }
                            }
                            i++;
                        }
                        if(!isDuplicate){
                            $scope.Func.getBase64Image(scanSrvc.getImageScannedUrl($scope.Data.filesScannedUid[index])).then(function(res) {
                                $scope.Data.readyImages.push(angular.extend(res, {from: 'scanner', selected: false, uid: $scope.Data.filesScannedUid[index]}));
                                /*if($scope.Data.readyImages.length == 1) {
                                    $scope.Func.setFullScreenViewImage();
                                }*/
                                $scope.Data.filesScanned.push($scope.Data.filesScannedUid[index]);
                                index++;
                                if((index+1) <= $scope.Data.filesScannedUid.length){
                                    $timeout(function() {
                                        //FIXME simpleBar
                                        // $scope.Data.scrollElement.getScrollElement().scrollTop = document.getElementById('scan-container').scrollHeight;
                                    }, 10).then(function() {
                                        $scope.Func.onPushReadyImagesFromScanner(index);
                                    });
                                } else {
                                    $scope.Data.isLoadingStartScan = false;
                                }
                            });
                        } else {
                            index++;
                            if((index+1) <= $scope.Data.filesScannedUid.length){
                                $scope.Func.onPushReadyImagesFromScanner(index);
                            } else {
                                $scope.Data.isLoadingStartScan = false;
                            }
                        }
                    },
                    onPushReadyImagesFromLocal: function(index){
                        if($scope.Data.imagesSelectedFromLocal[index] && $scope.Data.imagesSelectedFromLocal[index].type.indexOf('image/') == -1){
                            vtShowMessageSrvc.showMassage("error", '', "نوع فایل "+$scope.Data.imagesSelectedFromLocal[index].name+" مجاز نیست. باید تصویر باشد.");
                            index++;
                            if(index < $scope.Data.imagesSelectedFromLocal.length){
                                $scope.Func.onPushReadyImagesFromLocal(index);
                            } else {
                                $scope.Data.imagesSelectedFromLocal = [];
                                $scope.Data.isLoadingAddFromLocal = false;
                            }
                        } else if($scope.Data.imagesSelectedFromLocal[index] && $scope.Data.imagesSelectedFromLocal[index].size > 10485760) {
                            vtShowMessageSrvc.showMassage("error", '', "حجم فایل " + $scope.Data.imagesSelectedFromLocal[index].name +" مجاز نیست. باید کمتر از 10MB باشد.");
                            index++;
                            if(index < $scope.Data.imagesSelectedFromLocal.length){
                                $scope.Func.onPushReadyImagesFromLocal(index);
                            } else {
                                $scope.Data.imagesSelectedFromLocal = [];
                                $scope.Data.isLoadingAddFromLocal = false;
                            }
                        } else if($scope.Data.imagesSelectedFromLocal[index]) {
                            var reader = new FileReader();
                            reader.readAsDataURL($scope.Data.imagesSelectedFromLocal[index]);
                            reader.onload = function () {
                                $timeout(function() {
                                    $scope.Func.getBase64Image(reader.result).then(function(res) {
                                        $scope.Data.readyImages.push(angular.extend(res, {from: 'local', selected: false}));
                                        $timeout(function() {
                                            //FIXME simpleBar
                                            // $scope.Data.scrollElement.getScrollElement().scrollTop = document.getElementById('scan-container').scrollHeight;
                                            index++;
                                            if(index < $scope.Data.imagesSelectedFromLocal.length){
                                                $scope.Func.onPushReadyImagesFromLocal(index);
                                            } else {
                                                $scope.Data.imagesSelectedFromLocal = [];
                                                $scope.Data.isLoadingAddFromLocal = false;
                                            }
                                        }, 10);
                                    });
                                }, 1);
                            };
                        }
                    },
                    getBase64Image: function(src) {
                        var defer = $q.defer();
                        var image = new Image();
                        image.crossOrigin = "anonymous";
                        image.src = src;
                        image.onload = function() {
                            $timeout(function() {
                                var canvas = $document[0].createElement('canvas');
                                canvas.width = image.width;
                                canvas.height = image.height;
                                var context = canvas.getContext("2d");
                                context.drawImage(image, 0, 0);
                                defer.resolve({
                                    base64: canvas.toDataURL('image/jpeg', 1.0),
                                    base64Min: canvas.toDataURL('image/jpeg', 0.8),
                                    width: canvas.width,
                                    height: canvas.height
                                });
                            }, 1);
                        };
                        return defer.promise;
                    },
                    getSelectedImages: function() {
                        $scope.Data.selectedImages = [];
                        angular.forEach($scope.Data.readyImages, function(image, index) {
                            if(image.selected) {
                                $scope.Data.selectedImages.push(angular.extend(image, {index: index}));
                            }
                        });
                    },
                    onChangeCheckboxImages: function() {
                        $scope.Func.getSelectedImages();
                        if($scope.Data.selectedImages.length > 0){
                            if($scope.Data.selectedImages.length == $scope.Data.readyImages.length){
                                $scope.Data.readyImagesSelectAll = true;
                            } else {
                                $scope.Data.readyImagesSelectAll = null;
                            }
                        } else {
                            $scope.Data.readyImagesSelectAll = false;
                        }
                    },
                    onChangeCheckboxSelectAll: function() {
                        if($scope.Data.readyImagesSelectAll){
                            angular.forEach($scope.Data.readyImages, function(image) {
                                image.selected = true;
                            });
                        } else {
                            angular.forEach($scope.Data.readyImages, function(image) {
                                image.selected = false;
                            });
                            $scope.Data.readyImagesSelectAll = false;
                        }
                        $scope.Func.getSelectedImages();
                    },
                    rotateImage: function(base64, degree) {
                        var defer = $q.defer();
                        var image = new Image();
                        image.src = base64;
                        image.onload = function() {
                            $timeout(function() {
                                var canvas = $document[0].createElement('canvas');
                                canvas.width = image.height;
                                canvas.height = image.width;
                                var context = canvas.getContext("2d");
                                context.clearRect(0,0,canvas.width,canvas.height);
                                context.translate(canvas.width/2,canvas.height/2);
                                context.rotate(degree*Math.PI/180);
                                context.drawImage(image,-image.width/2, -image.height/2);
                                defer.resolve({
                                    base64: canvas.toDataURL('image/jpeg', 1.0),
                                    base64Min: canvas.toDataURL('image/jpeg', 0.8),
                                    width: canvas.width,
                                    height: canvas.height
                                });
                            }, 1);
                        };
                        return defer.promise;
                    },
                    onOpenPdfReviewModal: function() {



                        var modalInstance = $modal.open({
                            templateUrl: 'app/assets/js/directives/scanner/pdfReviewModal/pdfReviewModal.html',
                            controller: 'pdfReviewModalCtrl',
                            size: 'lg',
                            resolve: {
                                readyImages: function () {
                                    return $scope.Data.readyImages;
                                }
                            }
                        });
                        modalInstance.result.then(function (uploadedFile) {
                            
                            $scope.model=uploadedFile;
                            if(angular.isFunction($scope.api.onCreatedpdfUploaded)){
                                $scope.api.onCreatedpdfUploaded(uploadedFile);
                            }
                            
                        }, function() {
                            
                        });
                    },
                    resetScanPage: function() {
                        $scope.Data.readyImages = [];
                        $scope.Data.filesScanned = [];
                        $scope.Data.filesDeleted = [];
                        $scope.Data.selectedImages = [];
                    },
                    onClickSelectImageForView: function(index) {
                        $scope.Data.selectedIndexImage = index;
                    },
                    setFullScreenViewImage: function() {
                        /*$timeout(function() {
                            var imageView = document.getElementById('image-view');
                            Intense( imageView );
                        }, 1);*/
                    },
                    getScannerStatus: function() {
                        return scanSrvc.getScannerStatus().then(function(res) {
                            if(res.data.versionName == '1.1.7'){
                                $scope.Data.scannerStatus = 'ok';
                                return true;
                            } else {
                                $scope.Data.scannerStatus = 'oldVersion';
                                //just show a danger button that open a modal if user click that
                                // $scope.Func.onOpenScannerStatusModal();
                                return false;
                            }
                        }, function() {
                            $scope.Data.scannerStatus = 'inactive';
                            //just show a danger button that open a modal if user click that
                            // $scope.Func.onOpenScannerStatusModal();
                            return false;
                        });
                    },
                    onOpenScannerStatusModal: function() {
                        $modal.open({
                            templateUrl: 'app/assets/js/directives/scanner/scannerStatusModal/scannerStatusModal.html',
                            controller: 'scannerStatusModalCtrl',
                            backdrop: 'static',
                            // keyboard: false,
                            resolve: {
                                scannerStatus: function() {
                                    return $scope.Data.scannerStatus;
                                }
                            }
                        });
                    },
                    cleanupScanner: function() {
                        scanSrvc.cleanupScanner();
                    },
                    shortKeyGeneratePDF: function(event) {
                        if($scope.Data.isLoadingStartScan || $scope.Data.isLoadingAddFromLocal || !$scope.Data.readyImages.length){
                            // disabled
                        } else if(document.getElementsByClassName("modal").length === 0) {
                            if (event.key === 'Enter' && event.ctrlKey) {
                                $scope.Func.onOpenPdfReviewModal()
                            }
                        }
                    },
                    addShortKeyEventForGeneratePDF: function() {
                        $timeout(function() {
                            document.addEventListener('keydown', $scope.Func.shortKeyGeneratePDF);
                        }, 1);
                    },
                    removeShortKeyEventForGeneratePDF: function() {
                        $timeout(function() {
                            document.removeEventListener('keydown', $scope.Func.shortKeyGeneratePDF);
                        }, 1);
                    },
                    onClicKGoToImageViewer: function(initialViewIndex) {
                        $timeout(function() {
                            var div = document.createElement('div');
                            var img = [];
                            angular.forEach($scope.Data.readyImages, function(item, index) {
                                img[index] = document.createElement('img');
                                img[index].setAttribute('src', item.base64);
                                img[index].setAttribute('alt', 'صفحه ' + $filter('EnToFaNumber')(index+1));
                                div.appendChild(img[index]);
                            });
                            var viewer = new Viewer(div, {
                                title: function(image, imageData){
                                    return image.alt + ' (' + $filter('EnToFaNumber')(Math.round(imageData.naturalHeight*0.2645833333)) + '×' + $filter('EnToFaNumber')(Math.round(imageData.naturalWidth*0.2645833333)) + ' میلیمتر)';
                                },
                                toolbar: {
                                    zoomIn: 1,
                                    reset: 1,
                                    zoomOut: 1,
                                    prev: 1,
                                    play: 0,
                                    next: 1,
                                    rotateLeft: function() {
                                        $scope.Func.rotateImage($scope.Data.readyImages[viewer.index].base64, -90).then(function(res) {
                                            $scope.Data.readyImages[viewer.index].base64 = res.base64;
                                            $scope.Data.readyImages[viewer.index].base64Min = res.base64Min;
                                            $scope.Data.readyImages[viewer.index].width = res.width;
                                            $scope.Data.readyImages[viewer.index].height = res.height;
                                            img[viewer.index].setAttribute('src', res.base64);
                                            viewer.update();
                                            viewer.view(viewer.index + 1);
                                        });
                                    },
                                    rotateRight: function() {
                                        $scope.Func.rotateImage($scope.Data.readyImages[viewer.index].base64, 90).then(function(res) {
                                            $scope.Data.readyImages[viewer.index].base64 = res.base64;
                                            $scope.Data.readyImages[viewer.index].base64Min = res.base64Min;
                                            $scope.Data.readyImages[viewer.index].width = res.width;
                                            $scope.Data.readyImages[viewer.index].height = res.height;
                                            img[viewer.index].setAttribute('src', res.base64);
                                            viewer.update();
                                            viewer.view(viewer.index + 1);
                                        });
                                    },
                                    flipHorizontal: 0,
                                    flipVertical: 0,
                                },
                                initialViewIndex: initialViewIndex
                            });
                            viewer.show();
                        }, 1);
                    }
                };
                
                $scope.Controller = {
                    sortable: {
                        allowDuplicates: false
                    }
                };
            
                var Run = function () {
                    $scope.Func.getScannerStatus().then(function() {
                        if($scope.Data.scannerStatus == 'ok') {
                            $scope.Func.getScanersList();
                            $scope.Func.cleanupScanner();
                            if (angular.isFunction($scope.api.softwareReady)) {
                                $scope.api.softwareReady();
                            }
                            $timeout(function() {
                                // $scope.Data.scrollElement = new SimpleBar(document.getElementById('scan-scrollbar'), {autoHide: false});
                                //FIXME SimpleBar
                                $scope.Func.addShortKeyEventForGeneratePDF();
                            }, 1);
                        }
                    });
                    $scope.$on("$destroy", function handler() {
                        $scope.Func.removeShortKeyEventForGeneratePDF();
                    });
                };
            
                Run();
             }
        }
}
]);

angular.module('scannerModule').factory('scanSrvc', function($http, Restangular) {
    var baseUrl = "http://localhost:4220/viratech_automation_office/api/";
    return {
        getScannerList: function () {
            return $http.get(baseUrl+'scanners');
        },
        onScan: function(selectedScaner) {
            // uncomment line below for test mode
            //return $http.get(baseUrl+'fake');
            // comment line below for test mode
            return $http.get(baseUrl+'scanWithType/'+selectedScaner+'/jpg');
        },
        getFileUidList: function() {
            return $http.get(baseUrl+'filesPath');
        },
        cleanupScanner: function() {
            // comment line below for test mode
            return $http.get(baseUrl+'cleanup');
        },
        getScannerStatus: function () {
            return $http.get(baseUrl+'status');
        },
        getImageScannedUrl: function(uid) {
            return baseUrl+'download/'+uid;
        },
        saveFile: function(uid, data, docUid) {
            if(docUid){
                return Restangular.all('cnode/items/'+docUid+'/uploadNewVersion').post(data);
            } else {
                return Restangular.all('cnode/items/'+uid+'/new').post(data);
            }
        }
    };
});



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
