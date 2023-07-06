angular.module('cartableModule').controller('archiveLetterCtrl',
    function ($scope, $rootScope, $state, cartableKatebSrvc, katebSrvc, fileSrvc, $timeout, $sce) {

        $scope.Data = {
            tabList: [],
            letterUid: $state.params.letterUid,
            isPrintWithSignature: false,
            isPrintWithHeader: false,
            query: cartableKatebSrvc.getArchiveSearchQeury(),
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
                    id: 3,
                    title: 'درخت ارجاع',
                    uiSref: '',
                    feature: '*'
                }*/]
            },
            onTabClick: function (tab) {
                $scope.Data.selectedTab = tab;
                $scope.Func.deactiveTabs();
                tab.active = true;
                if ($scope.Data.selectedTab.id === 3) {
                    $scope.Func.getLetterForwardTree();
                } else if ($scope.Data.selectedTab.id === 5) {
                }
            },
            deactiveTabs: function () {
                for (var int = 0; int < $scope.Data.tabList.length; int++) {
                    $scope.Data.tabList[int].active = false;
                }
            },
            getLetter: function () {
                cartableKatebSrvc.getArchiveLetter($scope.Data.letterUid).then(function (res) {
                    $scope.Data.letter = res.data.originalElement;
                    $scope.Func.getPdfFile();
                });
            },
            onNodeClick: function (node) {
                if (node.uid) {
                    cartableKatebSrvc.getDetailLetterForwardTree(node.uid).then(function (res) {
                        $scope.Data.selectedNode = res.data.originalElement;
                    });
                }
            },
            getLetterForwardTree: function () {
                cartableKatebSrvc.getLetterForwardTree($scope.Data.letterUid, '?tFype=all_letter').then(function (res) {
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
            onResetLPAs: function () {
                katebSrvc.resetLPAs($scope.Data.letter.uid);
            },
            onResetDataCache: function () {
                katebSrvc.resetDataCache($scope.Data.letter.uid);
            },
            onResetPdfCache: function () {
                katebSrvc.resetPdfCache($scope.Data.letter.uid);
            },
            // getRelatedLetterList: function (letterUid, type) {
            //     cartableKatebSrvc.getRelatedLettereList(letterUid, type).then(function (res) {
            //         $scope.Data.relatedLetterList = res.data;
            //     });
            // },
            onReception: function (file) {
                katebSrvc.downloadByLink(fileSrvc.getFileURLForViewByFile(file));
            },
            getPdfFile: function () {
                // $scope.Data.pdfFile = "api/letter/pdf/" + $scope.Data.letterUid + "?type=all";
                $scope.Data.pdfFile = "files/letterPdf.pdf?fcode=" + $scope.Data.letter.fileBody.hash;
                $timeout(function () {
                    $scope.Controller.pdfFile.setPdfUrlWithInformation();
                }, 1);
            },
            // getEvents: function (uid) {
            //     cartableKatebSrvc.getEvents(uid, "all").then(function (res) {
            //         $scope.Data.events = res.data;
            //         angular.forEach($scope.Data.events, function (event) {
            //             var details = "";
            //             try {
            //                 details = JSON.parse(event.details);
            //                 event.showProcessLink = true;
            //                 event.processUid = details._bpmsData.processInstance.uid;
            //                 event.details = details._bpmsData.processInstance.title;
            //             }
            //             catch (err) {
            //                 if (err == "SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data") {
            //                     event.showProcessLink = false;
            //                 }
            //             }
            //             event.showTooltip = false;
            //             event.tooltipContent = null;
            //         });
            //     });
            // },
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
                    cartableKatebSrvc.setArchiveSearchMode(true);
                // if ($state.current.name === "base.home.secretariat.orgLetter") {
                $state.go('base.home.cartable.archiveLetterList');
                // } else {
                //     $state.go('base.home.cartable.orgLetterList');
                // }
            },
            getLastSearchQuery: function () {
                return cartableKatebSrvc.getArchiveLastSearchQuery();
            },
            setPdfUrl: function () {
                $scope.Data.pdfFileforView = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/files/letterPdf.pdf/?fcode=" + $scope.Data.letterUid);
            },
            trustSrc: function (src) {
                return $sce.trustAsResourceUrl(src);
            },
            onGetNextLetterClick: function () {



				var currentLetterIndexObj = $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);

				if(currentLetterIndexObj.index<0 || currentLetterIndexObj.isLast){
					return;
				}


				$state.go('base.home.cartable.archiveLetter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index +1].uid });



                // cartableKatebSrvc.getNextArchiveLetter('next').then(function (res) {
                //     $state.go('home.cartable.archiveLetter', {letterUid: res.data.originalElement[0].uid});
                // });

            },
            onGetPreviousLetterClick: function () {

                var currentLetterIndexObj = $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);

				if(currentLetterIndexObj.index<0 || currentLetterIndexObj.isFirst){
					return;
				}
				

				$state.go('base.home.cartable.archiveLetter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index-1].uid });


                // cartableKatebSrvc.getNextArchiveLetter('previous').then(function (res) {
                //     $state.go('home.cartable.archiveLetter', {letterUid: res.data.originalElement[0].uid});
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
            setNextPrevDisablity: function(){
				var indexObjInCachedList =  $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);
				$scope.Data.isNextDisabled = indexObjInCachedList.index <0 ||  indexObjInCachedList.isLast;
				$scope.Data.isPrevDisabled = indexObjInCachedList.index <0 || indexObjInCachedList.isFirst;
			}
        }

        $scope.Controller = {
            // treeApi: {
            //     onGetTree: function (node) {
            //     },
            //     onNodeClick: $scope.Func.onNodeClick
            // },
            pdfFile: {
                onInit: function () {
                    // $scope.Func.getPdfFile();
                }
            }
        }

        var Run = function () {
            $scope.Data.letterState = cartableKatebSrvc.getCurrentArchiveLetterState();
            $scope.Func.getTabList();
            $scope.Func.onTabClick($scope.Data.tabList[0]);
            $scope.Func.getLetter();
            // $scope.Func.getEvents($scope.Data.letterUid);
            $scope.Func.setPdfUrl();
            $scope.Func.setNextPrevDisablity();
            // $scope.Func.getRelatedLetterList($scope.Data.letterUid, 'all');
        }

        Run();
    });
