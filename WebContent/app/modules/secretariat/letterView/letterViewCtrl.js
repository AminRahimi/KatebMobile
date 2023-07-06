angular.module('secretariatModule').controller('letterViewCtrl',
	function($scope, $rootScope, $state, secretariatSrvc, fileSrvc, katebSrvc, cartableKatebSrvc, $timeout,
			 $sce, vtShowMessageSrvc, configObj) {

	$scope.Data = {
			tabList: [],
			letterUid: $state.params.letterUid,
			secUid: $state.params.secUid,
		archivedLetter: [],
		selectedFolder: "",
		hasExternalArchives: configObj.externalArchives.length,
		vtFolderSelectorForm: ""
		}

		$scope.Func = {
			getTabList: function(){
				$scope.Data.tabList = [{
					id: 1,
					title: 'نامه',
					uiSref: ''
				},{
					id: 0,
					title: 'اطلاعات نامه',
					uiSref: ''
				}/*,{
					id: 2,
					title: 'ضمیمه',
					uiSref: ''
				},{
					id: 3,
					title: 'چاپ',
					uiSref: ''
				}*/,{
					id: 8,
					title: 'آرشیو',
					uiSref: '',
					feature: '*'
				}]
			},
			onTabClick: function(tab){
				$scope.Data.selectedTab = tab;
				$scope.Func.deactiveTabs();
				tab.active = true;
				if ($scope.Data.selectedTab.id === 8) {
					$scope.Func.getArchivedLetterList();
				}
			},
			deactiveTabs: function(){
				for ( var int = 0; int < $scope.Data.tabList.length; int++) {
					$scope.Data.tabList[int].active = false;
				}
			},
			getLetter: function() {
				//console.log($scope.Data.letterUid);
				secretariatSrvc.getLetter($state.params.secUid, $scope.Data.letterUid,$state.params.letterType).then(function(res) {
					$scope.Data.letter = res.data.originalElement;
				});
			},

			onReturnClick: function(){
				if (!_.isEmpty($scope.Func.getLastSearchQuery()))
                	secretariatSrvc.setSearchMode(true);
				$state.go(secretariatSrvc.getBackButton(), {secUid: $scope.Data.secUid});
			},

			onPrintPDFClick: function(){
				cartableKatebSrvc.openPDFModal($scope.Func.getPdfUrlWithSearchParams(true));
			},
			getPdfSearchParams: function (isPrintMode) {
				return cartableKatebSrvc.createPrintDownloadSearchParams({
					isPrintWithSignature:$scope.Data.isPrintWithSignature,
					isPrintWithHeader:$scope.Data.isPrintWithHeader,
					indecatorNumber:$scope.Data.indecatorNumber,
				} ,isPrintMode);
			},
			getPdfUrlWithSearchParams: function (isPrintMode){
				return cartableKatebSrvc.getGeneratedPdfUrlWithSearchParams({letterUid:$scope.Data.letter.uid,isDraft:false},$scope.Func.getPdfSearchParams(isPrintMode));
			},
			getPdfFile: function () {
				$scope.Data.pdfFile = "api/letter/pdf/" + $scope.Data.letterUid + "?type=all";
				$timeout(function () {
					$scope.Controller.pdfFile.setPdfUrlWithInformation();
				}, 1);
			},
            getLastSearchQuery: function () {
                return secretariatSrvc.getLastSearchQuery();
            },
			setPdfUrl: function () {
                $scope.Data.pdfFile = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/api/letter/pdf/" + $scope.Data.letterUid + "?type=all");
            },
            trustSrc : function(src) {
                return $sce.trustAsResourceUrl(src);
            },
			getArchivedLetterList: function () {
				if ($scope.Data.archivedLetter.length == 0) {
					$scope.Controller.archivedLetterListApi.getArchivedLetterListFn = function () {
						return cartableKatebSrvc.getArchivedLetterList($scope.Data.letterUid).then(function (res) {
							$scope.Data.archivedLetter = res.data;
							return res;
						});
					};
					$scope.Controller.archivedLetterListApi.refreshArchivedLetterList();
				}
			},
			onFolderUploadFn: function () {
				cartableKatebSrvc.saveFolderChosen($scope.Data.letterUid, $scope.Data.selectedFolder).then(function (res) {
					$scope.Controller.archivedLetterListApi.refreshArchivedLetterList().then(function (resUploaded) {
						vtShowMessageSrvc.showMassage('success','', 'فولدر انتخاب شده با موفقیت آپلود شد.');
					});
				});
			}
		}

		$scope.Controller = {
			pdfFile: {
				onInit: function () {
					$scope.Func.getPdfFile();
				}
			},
			archivedLetterListApi: {
				getArchivedLetterListFn: null
			}
		}

		var Run = function(){
            $scope.Func.getTabList();
			$scope.Func.onTabClick($scope.Data.tabList[0]);
			$scope.Func.getLetter();
			// $scope.Func.setPdfUrl();
        }

		Run();
});
