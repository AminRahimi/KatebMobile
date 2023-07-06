    angular.module("katebPrint", []).directive('katebPrint', function(cartableKatebSrvc , katebSrvc , configObj) {
    return {
		restrict : 'EAC',
		templateUrl : 'app/assets/js/directives/katebPrint/katebPrintTemplate.html',
		scope : {
		    model: '=',
            letterUid: "=",
			isPrintWithSignature : "=",
			isPrintWithHeader :"=",
			indecatorNumber:"=",
			deliverycc:"=",
			deliverybcc:"=",
			paraphers:"=", 
            disableCheckbox: "=",
            wordEnable: "=?",
            type:"=?",
            isDraft:"=",
            config:"=?",
            pdfGenerator:"=?"
		},
        controller : function($scope , cartableKatebSrvc , katebSrvc, $modal) {
                $scope.Data = {
                    deliverycc: $scope.deliverycc && $scope.deliverycc.length>0 ,
                    deliverybcc: $scope.deliverybcc && $scope.deliverybcc.length>0 ,
                    configObj: configObj,
                    showQRCode:true,
                    ccSelectedList:{},
                    bccSelectedList:{},
                };
                $scope.Func = {
                    onChangeDeliveryCc: function() {
                       if($scope.model.deliveryCc && $scope.model.deliveryCc.length>0) {
                            _.each($scope.model.deliveryCc, function(delivery) {
                                $scope.Data.ccSelectedList[delivery.uid] = $scope.Data.deliverycc;
                                // delivery.checked = $scope.Data.deliverycc;
                            });
                       }
                    },
                    onChangeDeliveryBcc: function() {
                        if($scope.model.deliveryBcc && $scope.model.deliveryBcc.length>0) {
                            _.each($scope.model.deliveryBcc, function(delivery) {
                                $scope.Data.bccSelectedList[delivery.uid] = $scope.Data.deliverybcc;
                                // delivery.checked = $scope.Data.deliverycc;
                            });
                        }
                    },
                    onPrintPDFClick: function(){
                        const openPrintModal= function (){
                            cartableKatebSrvc.openPDFModal($scope.Func.getPdfUrlWithSearchParams(true));
                        };

                        //generate pdf before getting pdf
                        if(angular.isFunction($scope.pdfGenerator)){
                            $scope.pdfGenerator($scope.Func.getPdfSearchParams()).then(function (){
                                openPrintModal();
                            });
                        }else{
                            openPrintModal();
                        }

        			},
                    getPdfSearchParams: function (isPrintMode){
                        var deliveryCopy = [];
                        var ccCheckedList =  Object.entries($scope.Data.ccSelectedList).filter((cc)=>cc[1]).map((cc)=>cc[0]);

                        deliveryCopy = deliveryCopy.concat(ccCheckedList);


                        var bccCheckedList =  Object.entries($scope.Data.bccSelectedList).filter((bcc)=>bcc[1]).map((bcc)=>bcc[0]);

                        deliveryCopy = deliveryCopy.concat(bccCheckedList);
                        

                        return cartableKatebSrvc.createPrintDownloadSearchParams({
                            isPrintWithSignature:$scope.isPrintWithSignature,
                            isPrintWithHeader:$scope.isPrintWithHeader,
                            indecatorNumber:$scope.indecatorNumber,
                            deliverycc:$scope.Data.deliverycc,
                            deliverybcc:$scope.Data.deliverybcc,
                            paraphers:$scope.paraphers,
                            deliveryCopy:deliveryCopy,
                            showQRCode:$scope.Data.showQRCode,
                        } ,isPrintMode);
                    },
                    getPdfUrlWithSearchParams: function (isPrintMode){
                        return cartableKatebSrvc.getGeneratedPdfUrlWithSearchParams({letterUid:$scope.letterUid,isDraft:$scope.isDraft},$scope.Func.getPdfSearchParams(isPrintMode));
                    },
                    onDownloadPDFClick: function () {
                        const downloadPdf= function (){
                            katebSrvc.downloadByLink($scope.Func.getPdfUrlWithSearchParams(false), "hello");
                        };
                        //generate pdf before getting pdf
                        if(angular.isFunction($scope.pdfGenerator)){
                            $scope.pdfGenerator($scope.Func.getPdfSearchParams()).then(function (){
                                downloadPdf();
                            });
                        }else{
                            downloadPdf();
                        }


                    },
                    onDownloadWordClick: function () {
                        var url = "api/letter/items/docx/" + $scope.letterUid;

                        const downloadWord= function (){
                            katebSrvc.downloadByLink(url,"hello");
                        };
                        //generate pdf before getting dox
                        if(angular.isFunction($scope.pdfGenerator)){
                            $scope.pdfGenerator($scope.Func.getPdfSearchParams()).then(function (){
                                downloadWord();
                            });
                        }else{
                            downloadWord();
                        }
                    },
                    openPrintReportModal:function (letterUid){
                        var modalInstance= $modal.open({
                            templateUrl:'app/assets/js/directives/katebPrint/printReportModal/printReportModal.html',
                            controller:'printReportModalCtrl',
                            size:'sm',
                            resolve:{
                                letterUid:function(){
                                    return letterUid;
                                }
                            }
                        });
                        modalInstance.result.then(function (){

                        });
                    },
                };
                var Run = function () {
                    $scope.isPrintWithSignature = !($scope.config && $scope.config.hideSign);
                    $scope.isPrintWithHeader = true;
                    $scope.indecatorNumber = true;
                    $scope.Data.deliverycc = true;
                    $scope.paraphers =  !($scope.config && $scope.config.hideParaphers);
                    // $scope.disableCheckbox = $scope.disableCheckbox ? false : true;
                };
                Run();
            }
            };
});
