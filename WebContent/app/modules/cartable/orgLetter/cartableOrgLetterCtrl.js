angular.module('cartableModule').controller('cartableOrgLetterCtrl', 
		function($scope, $rootScope, $state, cartableKatebSrvc, katebSrvc, fileSrvc, $timeout, $sce,
                 vtShowMessageSrvc, configObj,cartableSrvc) {

	$scope.Data = {
			tabList: [],
			letterUid: $state.params.letterUid,
			isPrintWithSignature:false,
            isPrintWithHeader:false,
			query: cartableKatebSrvc.getSearchQeury(),
        archivedLetter: [],
        selectedFolder: "",
        hasExternalArchives: configObj.externalArchives.length,
        shamsQRCodeEnabled: configObj.shamsQRCodeEnabled,
        isShamsDisabled:false,
            vtFolderSelectorForm: "",
            lastCachedVisitedCartableFilterList:cartableSrvc.getLastCachedVisitedCartableFilterList($state.params.filter),
			isNextDisabled: false,
			isPrevDisabled: false
		}

		$scope.Func = {
            getTabList: function () {
                $scope.Data.tabList = [{
                    id: 1,
                    title: 'نامه',
                    uiSref: '',
                    feature: '*'
                }, {
                    id: 0,
                    title: 'اطلاعات نامه',
                    uiSref: '',
                    feature: '*'
                }/*, {
                    id: 2,
                    title: 'ضمیمه',
                    uiSref: '',
                    feature: '*'
                }*/, {
                    id: 3,
                    title: 'درخت ارجاع',
                    uiSref: '',
                    feature: '*'
                }/*, {
                    id: 4,
                    title: 'چاپ',
                    uiSref: '',
                    feature: '*'
                }, {
                    id: 5,
                    title: 'نامه های مرتبط',
                    uiSref: '',
                    feature: '*'
                }*/
                    , {
                    id: 6,
                    title: 'وقایع',
                    uiSref: '',
                    feature: 'SEE_LETTER_HISTORY_TAB'
                    }
                    ,
                    {
                    id: 7,
                    title: 'ارسال',
                    uiSref: '',
                    feature: 'SEND_TO_OTHER_ORG',
                    // feature: '*'
                },{
                    id: 8,
                    title: 'آرشیو',
                    uiSref: '',
                    feature: '*'
                }]
            },
            onTabClick: function (tab) {
                $scope.Data.selectedTab = tab;
                $scope.Func.deactiveTabs();
                tab.active = true;
                if ($scope.Data.selectedTab.id === 3) {
                    $scope.Func.getLetterForwardTree();
                } else if ($scope.Data.selectedTab.id === 5) {
                    // $scope.Func.getRelatedLetterList($scope.Data.letterUid, 'all');
                } else if ($scope.Data.selectedTab.id === 8) {
                    $scope.Func.getArchivedLetterList();
                }
            },
            deactiveTabs: function () {
                for (var int = 0; int < $scope.Data.tabList.length; int++) {
                    $scope.Data.tabList[int].active = false;
                }
            },
            getLetter: function () {
                cartableKatebSrvc.getOrgLetter($scope.Data.letterUid).then(function (res) {
                    $scope.Data.letter = res.data.originalElement;
                });
            },
            onNodeClick: function (node) {
                if(node.uid) {
                    cartableKatebSrvc.getDetailLetterForwardTree(node.uid).then(function (res) {
                        $scope.Data.selectedNode = res.data.originalElement;
                    });
                }
            },
            getLetterForwardTree: function () {
                cartableKatebSrvc.getLetterForwardTree($scope.Data.letterUid, '?type=all_letter').then(function (res) {
                    $scope.Data.letterForwardTreeData = res.data.originalElement;
                });
            },
            onPrintPDFClick: function () {
                cartableKatebSrvc.openPDFModal($scope.Func.getPdfUrlWithSearchParams(true));
            },
            getPdfSearchParams: function (isPrintMode) {
                return cartableKatebSrvc.createPrintDownloadSearchParams({
                    isPrintWithSignature:$scope.Data.isPrintWithSignature,
                    isPrintWithHeader:$scope.Data.isPrintWithHeader,
                    indecatorNumber:$scope.Data.indecatorNumber,
                    delivery_cc:$scope.Data.delivery_cc,
                    delivery_bcc:$scope.Data.delivery_bcc
                } ,isPrintMode);
            },
            getPdfUrlWithSearchParams: function (isPrintMode){
                return cartableKatebSrvc.getGeneratedPdfUrlWithSearchParams({letterUid:$scope.Data.letter.uid,isDraft:false},$scope.Func.getPdfSearchParams(isPrintMode));
            },
            onDownloadPDFClick: function () {
                var url = "api/letter/pdf/" + $scope.Data.letter.uid + "?signature=" + $scope.Data.isPrintWithSignature + "&header=" + $scope.Data.isPrintWithHeader + "&indicatorNumber=" + $scope.Data.indecatorNumber + "&delivery_cc=" + $scope.Data.delivery_cc + "&delivery_bcc=" + $scope.Data.delivery_bcc + "&download=true";
                katebSrvc.downloadByLink(url, "hello");
            },
            onShamsQrClick: function () {
                $scope.Data.isShamsDisabled = true;
            },
            onResetLPAs: function () {
            	katebSrvc.resetLPAs($scope.Data.letter.uid);
            },
            onResetDataCache: function () {
            	katebSrvc.resetDataCache($scope.Data.letter.uid);
            },
            onResetPdfCache: function () {
            	katebSrvc.resetPdfCache($scope.Data.letter.uid);
            },
            getRelatedLetterList: function (letterUid, type) {
                cartableKatebSrvc.getRelatedLettereList(letterUid, type).then(function (res) {
                    $scope.Data.relatedLetterList = res.data;
                });
            },
            onReception: function (file) {
                katebSrvc.downloadByLink(fileSrvc.getFileURLForViewByFile(file));
            },
            getPdfFile: function () {
                $scope.Data.pdfFile = "api/letter/pdf/" + $scope.Data.letterUid + "?type=all";
                $timeout(function () {
                    $scope.Controller.pdfFile.setPdfUrlWithInformation();
                }, 1);
            },
            getEvents: function (uid) {
                cartableKatebSrvc.getEvents(uid, "all").then(function (res) {
                    $scope.Data.events = res.data;
                    angular.forEach($scope.Data.events, function (event) {
                        var details = "";
                        try {
                            details = JSON.parse(event.details);
                            event.showProcessLink = true;
                            event.processUid = details._bpmsData.processInstance.uid;
                            event.details = details._bpmsData.processInstance.title;
                        }
                        catch (err) {
                            if (err == "SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data") {
                                event.showProcessLink = false;
                            }
                        }
                        event.showTooltip = false;
                        event.tooltipContent = null;
                    });
                });
            },
            onShowFullnameClick: function (event) {
                if (!event.tooltipContent) {
                    cartableKatebSrvc.getFullname(event.username).then(function (res) {
                        if (res.data[0]) {
                            event.tooltipContent = res.data[0].title;
                            event.showTooltip = true;
                        }
                    });
                } else {
                    event.showTooltip = !event.showTooltip;
                }

            },
            onGoToProcessClick: function (event) {
                $state.go("base.home.process.processInstanceInfo", {uid: event.object.uid});
            },
            onReturnClick: function () {
                if (!_.isEmpty($scope.Func.getLastSearchQuery()))
                    cartableKatebSrvc.setSearchMode(true);
                if ($state.current.name === "base.home.secretariat.orgLetter") {
                    $state.go('base.home.secretariat.orgLetterList'
                        // , {
                        // subject: $scope.Data.query.subject,
                        // letterNumber: $scope.Data.query.letterNumber,
                        // sender: $scope.Data.query.sender,
                        // pagination: $scope.Data.query.pagination,
                        // externalNumber: $scope.Data.query.externalNumber
                        // }
                    );
                } else {
                    $state.go('base.home.cartable.orgLetterList'
                        // , {
                        // subject: $scope.Data.query.subject,
                        // letterNumber: $scope.Data.query.letterNumber,
                        // sender: $scope.Data.query.sender,
                        // pagination: $scope.Data.query.pagination,
                        // externalNumber: $scope.Data.query.externalNumber
                        // }
                    );
                }
            },
            getLastSearchQuery: function () {
                return cartableKatebSrvc.getLastSearchQuery();
            },
            setPdfUrl: function () {
                $scope.Data.pdfFileforView = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/api/letter/pdf/" + $scope.Data.letterUid + "?type=all&contentType=text/html");
            },
            trustSrc : function(src) {
                return $sce.trustAsResourceUrl(src);
            },
            onGetNextLetterClick: function () {

                var currentLetterIndexObj = $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);

				if(currentLetterIndexObj.index<0 || currentLetterIndexObj.isLast){
					return;
				}


				$state.go('base.home.cartable.letter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index +1].uid });
                    if ($state.current.name === "home.secretariat.orgLetter") {
                    $state.go('base.home.secretariat.orgLetter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index +1].uid });;
                    } else {
                    $state.go('base.home.cartable.orgLetter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index +1].uid });;
                    }

                // cartableKatebSrvc.getNextLetter('next').then(function (res) {
                //     if ($state.current.name === "home.secretariat.orgLetter") {
                //         $state.go('home.secretariat.orgLetter', {letterUid: res.data.originalElement[0].uid});
                //     } else {
                //         $state.go('home.cartable.orgLetter', {letterUid: res.data.originalElement[0].uid});
                //     }
                // });

            },
            onGetPreviousLetterClick: function () {


                var currentLetterIndexObj = $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);

				if(currentLetterIndexObj.index<0 || currentLetterIndexObj.isFirst){
					return;
				}
				

				$state.go('base.home.cartable.letter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index-1].uid });
                if ($state.current.name === "home.secretariat.orgLetter") {
                    $state.go('base.home.secretariat.orgLetter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index-1].uid });
                    } else {
                    $state.go('base.home.cartable.orgLetter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index-1].uid });
                    }



                // cartableKatebSrvc.getNextLetter('previous').then(function (res) {
                //     if ($state.current.name === "home.secretariat.orgLetter") {
                //         $state.go('home.secretariat.orgLetter', {letterUid: res.data.originalElement[0].uid});
                //     } else {
                //         $state.go('home.cartable.orgLetter', {letterUid: res.data.originalElement[0].uid});
                //     }
                // });
            },
            //FIXME: duplicate in cartable draft and letter ctrl
			calcIndexOfLetterInCachedList: function(letterUid){
				if(!$scope.Data.lastCachedVisitedCartableFilterList && !angular.isArray($scope.Data.lastCachedVisitedCartableFilterList)){
					return {
						index:-1
					}
				}

				var letterIndex = $scope.Data.lastCachedVisitedCartableFilterList.findIndex((letter)=>letter.uid===$state.params.letterUid);

				return {
					index: letterIndex,
					isLast: letterIndex >= ($scope.Data.lastCachedVisitedCartableFilterList.length -1),
					isFirst: letterIndex<=0
				}
				
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
            },
            setNextPrevDisablity: function(){
				var indexObjInCachedList =  $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);
				$scope.Data.isNextDisabled = indexObjInCachedList.index <0 ||  indexObjInCachedList.isLast;
				$scope.Data.isPrevDisabled = indexObjInCachedList.index <0 || indexObjInCachedList.isFirst;
            }
        }

		$scope.Controller = {
            treeApi: {
				onGetTree: function(node){},
				onNodeClick: $scope.Func.onNodeClick
			},
			pdfFile: {
				onInit: function () {
					$scope.Func.getPdfFile();
				}
			},
            archivedLetterListApi: {
                getArchivedLetterListFn: null
            }
        }

        $scope.Apis= {};
		
		var Run = function(){
            $scope.Data.letterState = cartableKatebSrvc.getCurrentLetterState();
			$scope.Func.getTabList();
			$scope.Func.onTabClick($scope.Data.tabList[0]);
			$scope.Func.getLetter();
			$scope.Func.getEvents($scope.Data.letterUid);
			$scope.Func.setPdfUrl();
            $scope.Func.getRelatedLetterList($scope.Data.letterUid, 'all');
            $scope.Func.setNextPrevDisablity();
		}
		
		Run();
});
