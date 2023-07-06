angular.module('letterTabCMModule', []);

angular.module('letterTabCMModule').directive('letterBodyCm', [
    /**
     * @memberOf letterModule
     * @ngdoc directive
     * @description Preview and upload letter
     * @name letterBodyCm
     * @param {service} fileSrvc
     * @attr {object} ng-model
     * @attr {boolean} is-edit-mode
     * @example
     *  <letter-body ng-model="" is-edit-mode=""></letter-body>
     */
        function() {
        return {
            restrict: 'AE',
            scope: {
                model: "=",
                isEditMode: "=",
                onFileUploaded: "=",
                api:"=?",
                pdfFile: "="
            },
            templateUrl: 'app/assets/js/directives/letterTabCM/letterBodyTemplate.html',
            controller: function($scope, fileSrvc, scannerSrvc) {
                $scope.fileType = "pdf";
                $scope.api= $scope.api || {};
                $scope.api.setPdfUrl=function(model){
                    if(model) {
                        if ($scope.pdfFile) {
                            $scope.pdfUrl = $scope.pdfFile;
                        }
                        $scope.pdfUrl = fileSrvc.getFileURLForViewByFile({name:'letterPdf.html', hash:model.hash});
                    }
                    else
                        $scope.pdfUrl = undefined;
                }

                $scope.api.setPdfUrlWithInformation=function(){
                    scannerSrvc.hidePDFViewer();
                    if ($scope.pdfFile) {
                        $scope.pdfUrl = $scope.pdfFile;
                    } else {
                        $scope.pdfUrl = undefined;
                    }
                }

                $scope.onFileUploaded = function(model){
                    scannerSrvc.hidePDFViewer();
                    $scope.api.setPdfUrl(model);
                }
                $scope.onRemoveFile = function(model){
                    $scope.pdfUrl = null;
                }
                if (_.isFunction($scope.api.onInit)) {
                    $scope.api.onInit();
                }
            }
        }
    }]);

angular.module('letterTabCMModule').directive('letterAttachmentCm', [
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
        function() {
        return {
            restrict: 'AE',
            scope: {
                model: "=",
                isEditMode: "="
            },
            templateUrl: 'app/assets/js/directives/letterTabCM/letterAttachmentTemplate.html',
            controller: function($scope, $modal, secretariatSrvc, katebSrvc, fileSrvc, $rootScope) {
                $scope.Data = {
                    type: 'FILE',
                    attachmentType: 'Turn',
                    letter: {},
                    validationClicked:false,
                    attachmentList: []
                }

                $scope.Func = {
                    onAddAttachments: function(){
                        if($scope.letterAttachementForm.$invalid){
                            $scope.Data.validationClicked=true;
                        }else{
                            $scope.Data.validationClicked=false;
                            var attachments = {
                                type: $scope.Data.type,
                                relationTypeKey: $scope.Data.attachmentType,
                                fileBody: $scope.Data.file,
                                letterBody: $scope.Data.attachLetter?{
                                    uid: $scope.Data.attachLetter.uid,
                                    title: $scope.Data.attachLetter.internalNumber + '-' + $scope.Data.attachLetter.subject
                                }:null,
                                description: $scope.Data.description
                            }
                            $scope.model.push(attachments)
                            $scope.Data.attachmentList.push($scope.Data.attachLetter);
                            $scope.Data.type = 'FILE';
                            $scope.Data.attachmentType = 'Turn';
                            $scope.Data.file = null;
                            $scope.Data.description = null;
                            $scope.Data.attachLetter = null;
                        }

                    },
                    onReception: function(file){
                        katebSrvc.downloadByLink(fileSrvc.getFileURLForDownloadByFile(file));
                    },
                    onRemove: function(index){
                        $scope.model.splice(index,1);
                        $scope.Data.attachmentList.splice(index, 1);
                    },
                    onSelectLetter: function(){
                        var modalInstance = $modal.open({
                            templateUrl : 'app/modules/kateb/allLetterModal/allLetterModal.html',
                            controller : 'allLetterModalCtrl',
                            size : 'lg',
                            resolve : {
                                // serverResponse: function(){
                                //     return function(start, len){
                                //         return secretariatSrvc.getAllLettersList($rootScope.currentUserOrg.uid, start, len)
                                //     }
                                // },
                                // searchAllLettersList: function(){
                                //     return function(query, start, len){
                                //         return secretariatSrvc.searchAllLettersList($rootScope.currentUserOrg.uid,query, start, len)
                                //     }
                                // }

                            }
                        });
                        modalInstance.result.then(function(selectedItem) {
                            $scope.Data.attachLetter = selectedItem;
                        });
                    },
                    onShowLetterModalClick: function(index) {
                        var modalInstance = $modal.open({
                            templateUrl : 'app/assets/js/directives/letterTabCM/letterAttachedPreviewModal.html',
                            controller : 'letterAttachedPreviewCtrlModal',
                            size : 'lg',
                            resolve : {
                                pdfUrl: function() {
                                    return "api/letter/pdf/"+$scope.model[index].letterBody.uid;//fileSrvc.getFileURLForViewByFile({name:$scope.Data.attachmentList[index].fileBody.name, hash:$scope.Data.attachmentList[index].fileBody.hash});
                                }
                            }
                        });
                        modalInstance.result.then(function() {

                        });
                    },
                    checkFileType: function(file){
                        var type = 'none';
                        if(file && file.name){
                            if(file.name.indexOf('.pdf')!==-1){
                                type = 'pdf';
                            }else if(file.name.indexOf('.doc')!==-1){
                                type = 'doc';
                            }else if(file.name.indexOf('.xls')!==-1){
                                type = 'xls'
                            }else if(file.name.indexOf('.jpg')!==-1 || file.name.indexOf('.png')!==-1){
                                type = 'img';
                            }else if(file.name.indexOf('.mp4')!==-1 ||
                                file.name.indexOf('.mp3')!==-1 ||
                                file.name.indexOf('.wav')!==-1 ||
                                file.name.indexOf('.wma')!==-1 ||
                                file.name.indexOf('.ogg')!==-1 ||
                                file.name.indexOf('.amr')!==-1 ||
                                file.name.indexOf('.mid')!==-1){
                                type = 'mp3';
                            }
                        }
                        return type;
                    }
                }
            }
        }
    }])
    .controller('letterAttachedPreviewCtrlModal', function($scope, pdfUrl, $timeout) {
        $scope.api = {
            showLetter: {
                canSign: false,
                pdfUrl: pdfUrl
            }
        };
    });



