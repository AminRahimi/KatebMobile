angular.module('newsModule').controller('newsManagementCtrl', function ($scope, katebSrvc, newsSrvc, newsManagementSrvc, $modal, $state, $stateParams, $sce, $timeout) {
    $scope.Data = {
        startSave: false,
        validationClicked: false,
        cloneNewsInfo: null,
        currentNews: null,
        mode: "view",
        publishNow: true,
        ckeditor: null,
        photo_ref: null,
        availableTags:[],
        tags: [],
        orgUid: $stateParams.orgUid,
        currentDate: new Date()
    };
    $scope.Func = {
        refreshTags: function (query) {

        },

        returnStyleCss: function (html_code) {
            return $sce.trustAsHtml(html_code);
        },
        getOneNews: function () {
            if ($state.params.mode === "edit") {
                $scope.Data.mode = "edit";
            }
            newsSrvc.findOneNews($stateParams.newsId).then(function (response) {
                $scope.Data.cloneNewsInfo = response.data.originalElement;
                $scope.Data.currentNews = angular.copy($scope.Data.cloneNewsInfo);
                $scope.Data.ckeditor.setData($scope.Data.currentNews.content);
                $scope.Data.publishNow = !(response.data.publishDate && response.data.expirationDate);

            });
        },
        onGoToListClick: function () {
            $state.go("home.newsList");
        },
        onGoToNewModeClick: function () {
            $('#imageId').removeAttr('src');
            $scope.Data.mode = "add";
            $scope.Data.currentNews = null;
            if ($scope.Data.ckeditor != null)
                $scope.Data.ckeditor.setData();
            $scope.Data.publishNow = true;
        },
        onGoToEditModeClick: function () {
            $scope.Data.mode = "edit";
            $scope.Data.cloneNewsInfo = angular.copy($scope.Data.currentNews);
            //$scope.Data.ckeditor.on('load', function () {
                //$scope.Data.ckeditor.setData($scope.Data.currentNews.content);
            //});
            $timeout(function () {
                $('#editor1').val($scope.Data.currentNews.content);
            }, 1);
            $state.go("home.management.news", {
                mode: "edit",
                newsId: $scope.Data.currentNews.uid
            });
        },
        onAddNewsClick: function () {
            // if ($scope.Data.newsForm.$valid) {
            $scope.Func.prepareSendData();
            if ($scope.Data.ckeditor.getData() !== "") {
                if (!$scope.Data.startSave) {
                    $scope.Data.startSave = true;
                    newsSrvc.saveNews($scope.Data.currentNews).then(function (response) {
                        $scope.Data.currentNews = angular.copy(response.data);
                        $scope.Data.mode = "view";
                        $scope.Func.resetForm();
                        $scope.Func.prepareShowData();
                        $scope.Data.startSave = false;
                    });
                }
            } else {
                $('#ckeditorContainer').addClass('has-error');
                $scope.Data.ckeditor.isValid = false;
                $scope.Data.validationClicked = true;
            }
            // } else {
            //     $scope.Data.validationClicked = true;
            // }
        },
        onUpdateNewsClick: function () {
            // if ($scope.Data.newsForm.$valid) {
            if ($scope.Data.ckeditor.getData() !== "") {
                if (!$scope.Data.startSave) {
                    $scope.Data.startSave = true;
                    $scope.Func.prepareSendData();
                    newsSrvc.updateNews($scope.Data.currentNews, $scope.Data.currentNews.uid).then(function () {
                        $scope.Data.cloneNewsInfo = angular.copy($scope.Data.currentNews);
                        $scope.Data.mode = "view";
                        $scope.Func.resetForm();
                        $scope.Func.prepareShowData();
                        $scope.Data.startSave = false;
                    });
                }
            } else {
                $('#ckeditorContainer').addClass('has-error');
                $scope.Data.ckeditor.isValid = false;
                $scope.Data.validationClicked = true;
            }
            // } else {
            //     $scope.Data.validationClicked = true;
            // }
        },
        prepareSendData: function () {
            if ($scope.Data.currentNews.originalElement) {
                delete  $scope.Data.currentNews.originalElement;
            }
            $scope.Data.currentNews.content = $scope.Data.ckeditor.getData();
            // var tags = [];
            // $scope.Data.currentNews.tags.forEach(function (tag) {
            //     tags.push(tag.text);
            // });
            $scope.Data.currentNews.tags = [];
            $scope.Data.currentNews.published = $scope.Data.publishNow;

            if ($scope.Data.currentNews.publishDate) {
                $scope.Data.currentNews.publishDate = Date.parse($scope.Data.currentNews.publishDate);
                if ($scope.Data.currentNews.published) {
                    delete $scope.Data.currentNews.publishDate;
                } else {
                    delete $scope.Data.currentNews.published;
                }
            }
            if ($scope.Data.currentNews.expirationDate) {
                $scope.Data.currentNews.expirationDate = Date.parse($scope.Data.currentNews.expirationDate);
            }

            if($scope.Data.mode === 'edit' && $scope.Data.currentNews.expirationDate === $scope.Data.cloneNewsInfo.expirationDate && $scope.Data.currentNews.publishDate === $scope.Data.cloneNewsInfo.publishDate) {
                delete $scope.Data.currentNews.published;
                delete $scope.Data.currentNews.expirationDate;
                delete $scope.Data.currentNews.publishDate;
            }

        },
        prepareShowData: function () {
            if ($stateParams.mode === "add") {
                $state.go("home.management.news", {
                    mode: "view",
                    newsId: $scope.Data.currentNews.uid
                });
            } else if ($stateParams.mode === "edit") {
                $state.go("home.management.news", {
                    mode: "view",
                    newsId: $scope.Data.currentNews.uid
                });
            }
        },
        resetForm: function () {
            $('#ckeditorContainer').removeClass('has-error');
            $scope.Data.validationClicked = false;
            $scope.Data.ckeditor.isValid = true;
        },
        getLogoImage: function (hash) {
            // return katebSrvc.getFileURL(hash);
        },
        onCancelClick: function () {
            if ($state.params.mode == "add") {
                $state.go("home.management.newsList",{orgUid: $stateParams.orgUid});
            } else if ($state.params.mode == "edit") {
                $scope.Data.currentNews = angular.copy($scope.Data.cloneNewsInfo);
                $scope.Data.mode = "view";
                $scope.Func.resetForm();
                $state.go("home.management.news", {
                    mode: "view",
                    newsId: $scope.Data.currentNews.uid
                });
            }
        },
        imageSelect: function (file) {
            if (file.length > 0) {
                var reader = new FileReader();
                reader.readAsDataURL(file[0]);
                var modalInstance = $modal.open({
                    templateUrl: 'app/common/directives/addPicModal/picCropEditModal.html',
                    controller: 'picCropEditModalCtrl',
                    size: 'md',
                    backdrop: 'static',
                    resolve: {
                        file: function () {
                            return file;
                        },
                        aspectRatio: function () {
                            return 1;
                        },
                        size: function () {
                            return 350;
                        },
                        type: function () {
                            return 'image/jpeg';
                        }
                    }
                });
                modalInstance.result.then(function (item) {
                    if ($scope.Data.currentNews) {
                        $scope.Data.currentNews.photo_ref = item[0].hash;
                    } else {
                        $scope.Data.currentNews = {
                            photo_ref: item[0].hash
                        };
                    }
                });
            }
        }
    };
    var Run = function () {
        newsSrvc.setOrgUid($stateParams.orgUid);

        if ($stateParams.mode === "add") {
            $scope.Func.onGoToNewModeClick();
        }
        var ckeditorConfig = angular.copy(angular.module('app').ckeditorConfig);
        ckeditorConfig.addPic = {
            label : 'آپلود تصویر',
            icon:"",
            onClick:function(editor){
                console.log(editor);
                newsManagementSrvc.openFileSelectorModalAndUploadFile($scope,"fileSelector",function(inlineFileUploadResultObj){
                    $scope.Data.inlineFileUploadResultObj = inlineFileUploadResultObj;
                }).then(function(response) {
                    // var oEditor = CKEDITOR.instances[editor.name];
                    var html = '<img class="vt-img" contentType="' + response.file.type +'"  name="' + response.name + '" hash="' + response.hash + '" src="files/?mode=download&fcode=' + response.hash +  '"  >';

                    // var newElement = CKEDITOR.dom.element.createFromHtml(html, oEditor.document);
                    // oEditor.insertElement(newElement);

                    const viewFragment = editor.data.processor.toView( html );
                    const modelFragment = editor.data.toModel( viewFragment );

                    editor.model.insertContent( modelFragment );


                });
            }
            
        }

        ckeditorConfig.extraPlugins = [CKEditor5[ 'pic' ].AddPic];

        CKEditor5.editorClassic.ClassicEditor.create(
			document.querySelector( '#editor1' ),ckeditorConfig).then(function(editor){
			$scope.Data.ckeditor = editor;


            $scope.Data.ckeditor.model.document.on( 'change', () => {
                if ($scope.Data.ckeditor.getData() == "" && $scope.Data.validationClicked) {
                    $('#ckeditorContainer').addClass('has-error');
                    $scope.Data.ckeditor.isValid = false;
                } else {
                    $('#ckeditorContainer').removeClass('has-error');
                    $scope.Data.ckeditor.isValid = true;
                }
                // $scope.$digest();
            } );
		});

        if ($stateParams.newsId) {
            $scope.Func.getOneNews();
        }
        
        // CKEDITOR.config.height = 400;
    };
    Run();
});
