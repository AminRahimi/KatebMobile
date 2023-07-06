angular.module('cartableModule').controller('cartableLetterCtrl', function($scope, $modal, $rootScope, $state, $timeout,
																		   $sce, cartableKatebSrvc, fileSrvc, katebSrvc,
																		   cartableSrvc, vtShowMessageSrvc,
																		   Restangular, configObj) {

	$scope.Data = {
        	orgUid: $rootScope.currentUserOrg.uid,
			tabList: [],
			letterUid: $state.params.letterUid,
            forward: {
                deliveryTo: [],
                attachments: [],
                priority: 'Normal',
                requestResponseDate: ""
            },
            isPrintWithSignature:false,
            isPrintWithHeader:false,
			hamesh: {},
			hameshList: [],
			validationClicked: false,
			treeView: true,
			listView: false,
			listViewInfo: [],
			events: [],
		referenceTabSelected: false,
		logTabSelected: false,
		followTagUid: "",
		isFollow: false,
        organizationList: [],
        currentDate: new Date(),
        isLoadingSaveClick: false,
		treeMode: 'full',
		selectedFolder: "",
		archivedLetter: [],
		hasExternalArchives: configObj.externalArchives.length,
		vtFolderSelectorForm: "",
		shamsQRCodeEnabled: configObj.shamsQRCodeEnabled,
		isShamsDisabled:false,
		forwardIsDisabled: false,
			lastCachedVisitedCartableFilterList: cartableSrvc.getLastCachedVisitedCartableFilterList($state.params.cartableUid + $state.params.filter),
			isNextDisabled: false,
			isPrevDisabled: false,
			isNextPrevFeaturePossible:true,
			actionButtons: cartableSrvc.getActionButtons($state.params.cartableType),
			letterFeatures: cartableSrvc.getLetterDraftFeatures($state.params.cartableType),
		};

		$scope.Func = {
			// FIXME:refactor this code that is from a.najafvand
			exchangeDelete: {
                closeModalConfirm: function (resp) {
                    if (resp) {
                        cartableKatebSrvc.removeFromUserArchive([$state.params.userArchiveUid]).then(function () {
                            katebSrvc.showNotification('removeFromUserArchiveSuccess');
                            $scope.Func.returnToCartableList();

                        });
                    }
                }
            },
			
			getTabList: function(){
				$scope.Data.tabList = [{
					id: 1,
					title: 'نامه',
					uiSref: '',
					feature: '*'
				},{
					id: 0,
					title: 'اطلاعات نامه',
					uiSref: '',
                    feature: '*'
				}/*,{
					id: 2,
					title: 'ضمیمه',
					uiSref: '',
                    feature: '*'
				}*/,{
					id: 3,
					title: 'ارجاع',
					uiSref: '',
                    feature: '*'
				}/*,{
                    id: 4,
                    title: 'درخت ارجاع',
                    uiSref: '',
                    feature: '*'
                }*//*,{
					id: 4,
					title: 'چاپ',
					uiSref: '',
                    feature: '*'
				}*//*,{
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
					, {
                    id: 7,
                    title: 'ارسال',
                    uiSref: '',
					feature: 'SEND_TO_OTHER_ORG'
					// feature: '*'
                },{
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
				if($scope.Data.selectedTab.id === 3){
					if (!$scope.Data.referenceTabSelected) {
						$scope.Data.referenceTabSelected = true;
						$scope.Func.getLetterForwardTree();
                    }
                    //followScroll();
				} else if($scope.Data.selectedTab.id === 5){
					$scope.Func.getRelatedLetterList();
				} else if($scope.Data.selectedTab.id === 6){
					if (!$scope.Data.logTabSelected) {
						$scope.Data.logTabSelected = true;
						$scope.Func.getEvents();
					}
				} else if($scope.Data.selectedTab.id === 8){
					$scope.Func.getArchivedLetterList();
				}
			},
			deactiveTabs: function(){
				for ( var int = 0; int < $scope.Data.tabList.length; int++) {
					$scope.Data.tabList[int].active = false;
				}
			},

			getLpaOrJustLetter: function(){
				var getLpaOrJustLetter;

				if($state.params.cartableType==='letter'){
					getLpaOrJustLetter = $scope.Func.getLpa;
				}else{
					getLpaOrJustLetter = $scope.Func.getLetter;
				}

				getLpaOrJustLetter().then(function(){
					cartableSrvc.publishTo("updateCartableMenu");
					$scope.Func.checkHasFollow();
					$scope.Data.isLoadingSaveClick = false;
				},function(){
					$scope.Data.isLoadingSaveClick = false;
				});
			},
			
			getLpa: function(){
				return cartableKatebSrvc.getLpa($scope.Data.letterUid).then(function(res) {
					$scope.Data.letter = res.data.originalElement.letter;
					$scope.Data.lpa = res.data.originalElement;
					$scope.Data.tagInputExternalData = [{uid: $scope.Data.lpa.uid}];
					$scope.Data.archiveInputExternalData = [{uid: $scope.Data.lpa.uid}];
					return res
				});
			},
			getLetter: function() {
				return cartableKatebSrvc.getLetter($scope.Data.letterUid).then(function(res) {
					$scope.Data.letter = res.data.originalElement;
					return res
				});
			},
			checkHasFollow: function () {
				angular.forEach($scope.Data.letter.tags, function (tag) {
					if (tag.title.startsWith("نیاز به پیگیری")) {
						$scope.Data.isFollow = true;
						$scope.Data.followTagUid = tag.uid;
					}
				});
			},
			onReception: function(file){
				katebSrvc.downloadByLink(fileSrvc.getFileURLForViewByFile(file));
			},
            onForwardClick: function () {
				$scope.Data.validationClicked = true;
				if (!$scope.Data.form.$valid) {
					return 
				}
				$scope.Data.forwardIsDisabled = true;

				cartableKatebSrvc.sendForward($scope.Data.letterUid, $scope.Data.forward).then(function (res) {
					$scope.Data.forwardIsDisabled = false;
					$scope.Data.validationClicked = false;
					katebSrvc.showNotification('forwardSucceded');
					$scope.Func.getLetterForwardTree();
					$scope.Func.reset();
					cartableSrvc.setSelectedItems([]);
					// $state.go('base.home.cartable.cartableList');
				});
            	
            },
			onForwardAndArchiveClick: function () {
				$scope.Data.validationClicked = true;
				if (!$scope.Data.form.$valid) {
					return 
				}
					$scope.Data.forwardIsDisabled = true;

					cartableKatebSrvc.sendForward($scope.Data.letterUid, $scope.Data.forward).then(function (res) {
						var uidList = [$scope.Data.letterUid];
						$scope.Data.forwardIsDisabled = false;
						$scope.Data.validationClicked = false;
						cartableKatebSrvc.archiveLetter(uidList).then(function () {
							katebSrvc.showNotification('forwardSucceded');
							$scope.Func.getLetterForwardTree();
							$scope.Func.reset();
						$scope.Func.returnToCartableList();
                            cartableSrvc.setSelectedItems([]);
						});
				});
			},
			onAddToUserArchive: function () {
				var uidList = [$scope.Data.letterUid];

				cartableKatebSrvc.addToUserArchive(uidList).then(
					function (res) {
						katebSrvc.showNotification('addToUserArchiveSuccess');
					}
				)
			},
            onForwardAndNextClick: function () {
				$scope.Data.validationClicked = true;
				if (!$scope.Data.form.$valid) {
					return 
				}
					$scope.Data.forwardIsDisabled = true;

					cartableKatebSrvc.sendForward($scope.Data.letterUid, $scope.Data.forward).then(function (res) {
						$scope.Data.forwardIsDisabled = false;
						$scope.Data.validationClicked = false;
						$scope.Func.onGetNextLetterClick();
                        cartableSrvc.setSelectedItems([]);
                    });
            },
			onReturnClick: function(){

				$scope.Func.returnToCartableList();
                
            },
			returnToCartableList: function(){
                if (!_.isEmpty($scope.Func.getLastSearchQuery()))
                    cartableKatebSrvc.setSearchMode(true);
				$state.go('base.home.cartable.cartableList');
			},
			onPrintPDFClick: function(){
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
			 onShamsQrClick: function () {
                $scope.Data.isShamsDisabled = true;
            },
			onDownloadPDFClick: function(){
				var url = "api/letter/pdf/"+$scope.Data.letter.uid +"?signature="+$scope.Data.isPrintWithSignature+"&header="+$scope.Data.isPrintWithHeader+"&indicatorNumber="+$scope.Data.indecatorNumber+"&delivery_cc="+$scope.Data.delivery_cc+"&delivery_bcc="+$scope.Data.delivery_bcc+"&download=true";
				katebSrvc.downloadByLink(url,"hello");
			},
			onNodeClick: function (node) {
                if(node.uid) {
                    return cartableKatebSrvc.getDetailLetterForwardTree(node.uid).then(function (res) {
                        $scope.Data.selectedNode = res.data.originalElement;
                        return $scope.Data.selectedNode;
                    });
                }
			},
			getLetterForwardTree: function (treeMode) {
				if(treeMode == 'full' || treeMode == null) {
                    cartableKatebSrvc.getLetterForwardTree($scope.Data.letterUid,`?type=${$state.params.cartableType==='letter'?'lpa':'all'}`).then(function (res) {
                        $scope.Data.letterForwardTreeData = res.data.originalElement;
                        $scope.Data.selectedNode = {};
                        $scope.Data.listViewInfo = [];
                        $scope.Func.initListViewData($scope.Data.letterForwardTreeData);
                        $scope.Data.listViewInfo.shift();
                    });
                }
                if(treeMode == 'brief'){
                    cartableKatebSrvc.getLetterForwardTreeBrief($scope.Data.letterUid,`?type=${$state.params.cartableType==='letter'?'lpa':'all'}`).then(function (res) {
                        $scope.Data.letterForwardTreeData = res.data.originalElement;
                        $scope.Data.selectedNode = {};
                        $scope.Data.listViewInfo = [];
                        $scope.Func.initListViewData($scope.Data.letterForwardTreeData);
                        $scope.Data.listViewInfo.shift();
                    });
				}
			},
			initListViewData: function (data) {
				angular.forEach(data.children, function (item) {
					$scope.Data.listViewInfo.push(item.item);
					$scope.Func.initListViewData(item);
				});
			},
			onHameshSelect: function (item, model) {
				$scope.Data.forward.hamesh = item.content;
			},
			getFullhameshhotkeyList: function () {
				cartableKatebSrvc.getFullhameshhotkeyList().then(function (response) {
					$scope.Data.hameshList = response.data;
				});
			},
			onRemoveTagClick: function (index, selectedTag) {
				// FIXME what should be send when tag has not uid @hashemi
				// if(selectedTag.uid){
				// 	throw new Error('selected tag has not uid');
				// }
				var data = {
					letters: [{"uid":$scope.Data.lpa.uid}],
					tags: [{"uid":selectedTag.uid}]
				};
				cartableKatebSrvc.removeTag(data).then(function (res) {
					$scope.Data.letter.tags.splice(index, 1);
				});
			},
			onArchiveCb: function () {
				$state.go('base.home.cartable.cartableList');
                cartableSrvc.setSelectedItems([]);
			},
			reset: function () {
				$scope.Data.forward = {
	                deliveryTo: [],
	                attachments: [],
	                priority: 'Normal',
	                requestResponseDate: "",
	                hamesh: ''
            	};
            	$scope.Data.hamesh = {};
            	$scope.Data.responseNeeded = undefined;
            	$scope.Data.attachmentNeeded = undefined;
			},

			onSendNodeForwardCommentClick:function(){
				cartableKatebSrvc.forwardComment($scope.Data.selectedNode.uid, $scope.Data.forwardRespond).then(function () {
					$scope.Data.selectedNode.respond = $scope.Data.forwardRespond;
					$scope.Data.selectedNode.canRespond = false;
				});
				//$scope.Data.selectedNode.letter.forwardComment = $scope.Data.tmp.forwardComment;
			},
			onShowLetterModalClick: function(letterBody) {
                var modalInstance = $modal.open({
                    templateUrl : 'app/assets/js/directives/letterTab/letterAttachedPreviewModal.html',
                    controller : 'letterAttachedPreviewCtrlModal',
                    size : 'lg',
                    resolve : {
                        pdfUrl: function() {
                            return "api/letter/pdf/"+letterBody.uid;
                        }
                    }
                });
                modalInstance.result.then(function() {

                });
            },
			getRelatedLetterList: function () {
				cartableKatebSrvc.getRelatedLettereList($scope.Data.letterUid,$state.params.cartableType==='letter'?'lpa':'all').then(function (res) {
					$scope.Data.relatedLetterList = res.data;
				});
			},
			getPdfFile: function () {
				$scope.Data.pdfFile = `api/letter/pdf/${$scope.Data.letterUid}?type=${$state.params.cartableType==='letter'?'lpa':'all'}`;
				$timeout(function () {
					$scope.Controller.pdfFile.setPdfUrlWithInformation();
				}, 1);
			},
			onShowTreeOrListClick: function (typeOfShow) {
				if (typeOfShow == "tree") {
					$scope.Data.treeView = true;
					$scope.Data.listView = false;
				} else if (typeOfShow == "list") {
					$scope.Data.treeView = false;
					$scope.Data.listView = true;
                }
			},
			onPrintClick: function (elem) {
                var numberOfimageRepeat = Math.ceil($('.print-tree-wrapper').outerHeight() / 695);
                var imageElement = $("#letter-image");
                for (var i = 1; i < numberOfimageRepeat; i++)
                    imageElement.after(imageElement.clone());
				//window.print();
				$scope.Func.Print($(elem).html());
			},
			Print: function (data) {
				var mywindow = window.open();
				mywindow.document.write('<html><head>');
				angular.forEach($("link"), function (a) {
					mywindow.document.write($('<div>').append($(a).clone()).html());
				});
				mywindow.document.write('<style>@page { size: A4 landscape }  * {font-size: 7px;}</style></head><body class="A4 landscape"><section class="sheet padding-10mm">');
				mywindow.document.write('<div class="hidden-print text-center"><button type="button" style="width:120px" class="btn btn-primary" onclick="window.print();">چاپ</button></div>');
				mywindow.document.write(data);
				mywindow.document.write('</section></body></html>');
				mywindow.document.close(); // necessary for IE >= 10
				mywindow.focus(); // necessary for IE >= 10
				return true;
			},
			getEvents: function () {
				cartableKatebSrvc.getEvents($scope.Data.letterUid,$state.params.cartableType==='letter'?'lpa':'all').then(function (res) {
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
			onTagInputListChanged: function (tagList) {
				$scope.Data.letter.tags = $scope.Data.letter.tags.concat(tagList);
			},
            onReplyClick: function () {
                $state.go('base.home.cartable.draft', {replyFromUid: $scope.Data.letterUid,orgUid:'CURRENT'});
            },
			onGoToProcessClick: function (event) {
				$state.go("base.home.process.processInstanceInfo", {uid: event.object.uid});
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

            getLastSearchQuery: function () {
                return cartableKatebSrvc.getLastSearchQuery();
            },
            setPdfUrl: function (uid) {
                // var fileUrl = secretariatSrvc.getFileURLForViewByFile({name:'letterPdf.html', hash:model.hash});
                // var encodedUrl =  encodeURIComponent("/Kateb/files/letterPdf.html?mode=view&fcode=" + model.hash + "&contentType=text/html");
                $scope.Data.pdfFile = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/api/letter/pdf/" + uid + "?type=lpa&contentType=text/html");
            },
            trustSrc : function(src) {
                return $sce.trustAsResourceUrl(src);
            },
			onFollowClick: function () {


				var follow = function (){
					var sendData = {
						letters: [{"uid":$scope.Data.lpa.uid}],
						tags: [{title: "نیاز به پیگیری"}]
					};
					return cartableKatebSrvc.follow(sendData).then(function (res) {
						$scope.Data.isFollow = true;
						return res;
					});
				};


				$scope.Func.doJobAndUpdateMenu(follow);
			},
			onUnfollowClick: function () {

				var unfollow = function (){
					var sendData = {
						letters: [{"uid":$scope.Data.lpa.uid}],
						tags: [{title: "نیاز به پیگیری"}]
					};
					return cartableKatebSrvc.unFollow(sendData).then(function (res) {
						$scope.Data.isFollow = false;
						return res;
					});
				};

				$scope.Func.doJobAndUpdateMenu(unfollow);
			},
            onGetNextLetterClick: function () {



				var currentLetterIndexObj = $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);

				if(currentLetterIndexObj.index<0 || currentLetterIndexObj.isLast){
					return;
				}


				$state.go('base.home.cartable.letter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index +1].uid });




                // cartableSrvc.getTask('next').then(function (res) {
                // 	if (res.data.originalElement[0].itemUid === $scope.Data.letterUid)
                // 		$scope.Func.onGetNextLetterClick();
                //     else
                //         $state.go('home.cartable.letter', {letterUid: res.data.originalElement[0].itemUid});
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
            onGetPreviousLetterClick: function () {


				var currentLetterIndexObj = $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);

				if(currentLetterIndexObj.index<0 || currentLetterIndexObj.isFirst){
					return;
				}
				

				$state.go('base.home.cartable.letter', { letterUid: $scope.Data.lastCachedVisitedCartableFilterList[currentLetterIndexObj.index-1].uid });


                // cartableSrvc.getTask('previous').then(function (res) {
                //     $state.go('home.cartable.letter', {letterUid: res.data.originalElement[0].itemUid});
                // });
            },
            getLetterImage: function () {
				return $scope.Func.trustSrc('/Kateb/api/letter/snapshot/' + $scope.Data.letter.uid);
            },
            onOrganiztionChange: function (data) {
                cartableSrvc.getSenderList($scope.Data.orgUid, data.uid).then(function (res) {
                    $scope.Data.members = res.data;
                });
            },
            onLetterDownloadClick: function () {
                var link = document.createElement("a");
                link.setAttribute("href", "api/letter/ecep/"+ $scope.Data.letter.uid );
                link.setAttribute("download", "FileName");
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
            },
            onSaveClick: function(){
				$scope.Data.isLoadingSaveClick = true;
                var sendData = $scope.Func.prepareSendData($scope.Data.letter);
                cartableSrvc.saveIssued($scope.Data.letter.blankUid, sendData).then(function(){
                    // $state.go('base.home.secretariat.issuedLetterList', {secUid: $scope.Data.secUid});
					$scope.Func.getLpaOrJustLetter();
                    vtShowMessageSrvc.showMassage('success','', 'نامه با موفقیت ارسال شد.');
                }, function () {
                    $scope.Data.isLoadingSaveClick = false;
                });
            },
            getExternalOrganizationList: function () {
                cartableSrvc.getExternalOrganizationList($scope.Data.orgUid).then(function (res) {
                    $scope.Data.organizationList = res.data;
                });
            },
            prepareSendData: function(data){
                switch (data.type) {
                    case "Post":
                        var sendData = {
                            postalCode: data.postalCode,
                            boxNumber: data.boxNumber
                        }
                        break;
                    case "Fax":
                        var sendData = {
                            faxNumber: data.faxNumber
                        }
                        break;
                    case "Courier":
                        var sendData = {
                            courierName: data.courierName
                        }
                        break;
                    case "Org":
                        var sendData = {
                            reciverPostionUserAssignment: Restangular.stripRestangular(data.reciverPostionUserAssignment)
                        }
                        break;
                    case "Ece":
                        var sendData = {
                            //position: data.position
                        }
                        break;
                }
                sendData.uid = data.uid;
                sendData.type = data.type.toUpperCase();
                sendData.description = data.description;
                return sendData;
            },
            onChangeTreeMode: function (treeMode) {
				if(treeMode == 'full'){
                    $scope.Data.treeMode = 'full';
				}
				if(treeMode == 'brief') {
                    $scope.Data.treeMode = 'brief';
				}
                $scope.Func.getLetterForwardTree($scope.Data.treeMode);

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
			doJobAndUpdateMenu: function (job){
				job().then(function (){
					cartableSrvc.publishTo("updateCartableMenu");
				});
			},
			setNextPrevDisablity: function(){
				var indexObjInCachedList =  $scope.Func.calcIndexOfLetterInCachedList($state.params.letterUid);
				$scope.Data.isNextDisabled = indexObjInCachedList.index <0 ||  indexObjInCachedList.isLast;
				$scope.Data.isPrevDisabled = indexObjInCachedList.index <0 || indexObjInCachedList.isFirst;
				if($scope.Data.isNextDisabled && $scope.Data.isPrevDisabled){
					$scope.Data.isNextPrevFeaturePossible = false;
				}
			}
		}
				

  	$scope.Controller = {
      multiSelectorsController: {
          multiSelectTranslate: new katebSrvc.MultiselectTranslate('انتخاب گیرندگان'),
          multiSelectSettings: {
              externalIdProp: '',
              displayProp: 'title',
              enableSearch: true,
              scrollableHeight: '300px',
              scrollable: true,
              idProp: 'uid',
              showCheckAll: true,
              showUncheckAll: true
          }
      },
		treeApi: {
				onGetTree: function(node){},
				onNodeClick: function (node) {
					return $scope.Func.onNodeClick(node);
				}
			},
			pdfFile: {
				onInit: function () {
					$scope.Func.getPdfFile();
				}
			},

			multiselectRecieverSearch: cartableKatebSrvc.getPuaListSEPFalse,
		archivedLetterListApi: {
			getArchivedLetterListFn: null
		}
    }

	$scope.Apis={};

		var Run = function(){
            $scope.Data.letterState = cartableSrvc.getCurrentTaskState();
			$scope.Func.getTabList();
			$scope.Func.onTabClick($scope.Data.tabList[0]);

			$scope.Func.getLpaOrJustLetter();

			$scope.Func.getFullhameshhotkeyList();
			$scope.Func.getExternalOrganizationList();
			$scope.Func.getRelatedLetterList();

			$scope.Func.setNextPrevDisablity();

			// $scope.Func.setPdfUrl($scope.Data.letterUid);
			// $scope.Func.followScroll(jQuery);
		}

//		 var followScroll = function() {
//		 		    var element = $('.follow'),
//		 		        originalY = element.offset().top;
//				    
//		 		    // Space between element and top of screen (when scrolling)
//		 		    var topMargin = 20;
//				    
//		 		    // Should probably be set in CSS; but here just for emphasis
//		 		    element.css('position', 'relative');
//				    
//		 		    $(window).on('scroll', function(event) {
//		 		        var scrollTop = $(window).scrollTop();
//				        
//		 		        element.stop(false, false).animate({
//		 		            top: scrollTop < originalY
//		 		                    ? 0
//		 		                    : scrollTop - originalY + topMargin
//		 		        }, 300);
//		 		    });
//		 		}

		// followScroll(jQuery);		
		Run();
});
