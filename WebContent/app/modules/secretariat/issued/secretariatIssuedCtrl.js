angular.module('secretariatModule').controller('secretariatIssuedCtrl',
	function($scope, $state, $rootScope, $sce, secretariatSrvc, katebSrvc, cartableKatebSrvc, Restangular,
			 vtShowMessageSrvc, configObj, $timeout) {
	$scope.Data = {
			tabList: [],
			secUid: $state.params.secUid,
			orgUid: $rootScope.currentUserOrg.uid,
			incUid: $state.params.incUid,
		letterUid: $state.params.letterUid,
			indicatorBookList: [],
			tagList: [],
			letter: {},
			issuedLetter: {},
			featuresList: secretariatSrvc.getFeatureList($state.params.secUid),
			organizationList: [],
			members: [],
            pdfUrl: "",
			selectedDstOrgList: [],
        	isLoadingSaveClick: false,
			showRecepiantForms: [],
			isEditForms: [],
			editedRecepiant:[],
			deliverys: [],
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
					id: 4,
					title: 'ارسال',
					uiSref: ''
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
				if ($scope.Data.selectedTab.id === 8) {
					$scope.Func.getArchivedLetterList();
				}
			},
			deactiveTabs: function(){
				for ( var int = 0; int < $scope.Data.tabList.length; int++) {
					$scope.Data.tabList[int].active = false;
				}
			},

			getIssuedLetter: function(){
				secretariatSrvc.getIssued($scope.Data.secUid, $scope.Data.incUid).then(function(response){
					$scope.Data.issuedLetter = response.data.originalElement;
					$scope.Data.letter = $scope.Data.issuedLetter.letter;
					$scope.Data.issuedLetter.type = $scope.Data.letter.type || 'Courier';
					$scope.Data.issuedLetter.description = $scope.Data.letter.description;
					$scope.Data.issuedLetter.indicatorBook = $scope.Data.letter.indicatorBook;
					if($scope.Data.letter.fileBody){
						
						try {
							$scope.loadPdfFn($scope.Data.letter.fileBody);
						} catch (error) {
							console.error('error on loadPdfFn')
						}
                    	
					}
                    	// $scope.Func.setPdfUrl($scope.Data.letter.fileBody);
                    $scope.Data.deliverys = $scope.Data.issuedLetter.letter.deliveryTo.concat($scope.Data.issuedLetter.letter.deliveryCc, $scope.Data.issuedLetter.letter.deliveryBcc);
					$scope.Data.mode = 'view';

				});
			},
			onSaveClick: function(recepiant){
				$scope.Data.isLoadingSaveClick = true;
                var sendData = $scope.Func.prepareSendData(recepiant);
				secretariatSrvc.saveIssued($scope.Data.secUid, sendData).then(function(){
					//$state.go('home.secretariat.issued', {secUid: $scope.Data.secUid, incUid: $scope.Data.incUid});
                    $scope.Func.getIssuedLetter();
                    $scope.Data.isLoadingSaveClick = false;
					if(recepiant.dispatches.type === 'Fax'){
						$scope.Func.onTabClick($scope.Data.tabList[0]);
						$timeout(function () {
							var text = recepiant.faxNumber;
							var input = document.createElement('input');
							input.setAttribute('value', text);
							document.body.appendChild(input);
							input.select();
							document.execCommand('copy');
							document.body.removeChild(input);
							var btn = document.getElementById('letter-body-iframe').contentDocument.getElementById("print");
							btn.click(function(e){
								e.stopPropagation();
							});
						}, 100);
						vtShowMessageSrvc.showMassage('info','', 'در حال انتقال به ارسال کننده فکس...');
					} else {
						vtShowMessageSrvc.showMassage('success','', 'نامه با موفقیت ارسال شد.');
					}
                }, function () {
                    $scope.Data.isLoadingSaveClick = false;
                });
			},
			getRecepiantDispatches: function ( index,dispatches) {
				$scope.Data.isEditForms[index] = true;
				//to prevent binding 
				$scope.Data.editedRecepiant[index] = angular.copy(dispatches);

			},
			onSaveEditClick: function (index, uid, type) {
				secretariatSrvc.editDispatches(
					type,
					uid,
					$scope.Data.editedRecepiant[index].courierName,
					$scope.Data.editedRecepiant[index].description,
					$scope.Data.editedRecepiant[index].boxNumber,
					$scope.Data.editedRecepiant[index].postalCode).then(function (res) {
						$scope.Func.getIssuedLetter();
						$scope.Data.recepiant = null;
						$scope.Data.isEditForms[index]= false;
					});
			},
			onCancelEditClick: function (index) {
				$scope.Data.isEditForms[index] = false;
				$scope.Data.recepiant = null;
					
			},

			onReturnClick: function(){
                if (!_.isEmpty($scope.Func.getLastSearchQuery()))
                    secretariatSrvc.setSearchMode(true);
				$state.go(secretariatSrvc.getBackButton(), {secUid: $scope.Data.secUid});
			},

			prepareSendData: function(data){
				switch (data.dispatches.type) {
					case "Post":
						var sendData = {
							postalCode: data.postalCode,
							boxNumber: data.boxNumber,
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
							// eceEmails: _.map($scope.Data.selectedDstOrgList, function (dstOrg) {
							// 	return dstOrg.eceEmail
							// })
							destEceExternalOrganizationUids: _.map($scope.Data.selectedDstOrgList, function (dstOrg) {
								return dstOrg.uid
							})
						}
						break;
				}
				sendData.uid = data.uid;
				sendData.deliveryUid = data.deliveryUid;
				sendData.type = data.dispatches.type.toUpperCase();
				sendData.description = data.description;
				return sendData;
			},

			// getIndicatorBookList: function(){
			// 	secretariatSrvc.getIssuedIndicatorBookList($scope.Data.secUid).then(function(response){
			// 		for ( var int = 0; int < response.data.originalElement.length; int++) {
			// 			$scope.Data.indicatorBookList.push(response.data.originalElement[int]);
			// 		}
			// 	});
			// },
			onSelectIndicatorBook: function(indicatorBook){
				$scope.Data.indicatorBook = indicatorBook;
				$scope.Data.issuedLetter.indicatorBook = {
					uid:$scope.Data.indicatorBook.uid,
					title:$scope.Data.indicatorBook.title
				};
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
			onDownloadPDFClick: function(){
				var url = "api/letter/pdf/"+$scope.Data.letter.uid +"?signature="+$scope.Data.isPrintWithSignature+"&header="+$scope.Data.isPrintWithHeader+"&indicatorNumber="+$scope.Data.indecatorNumber+"&delivery_cc="+$scope.Data.delivery_cc+"&delivery_bcc="+$scope.Data.delivery_bcc+"&download=true";
				katebSrvc.downloadByLink(url,"hello");
			},
			getExternalOrganizationList: function () {
				secretariatSrvc.getExternalOrganizationList($scope.Data.orgUid).then(function (res) {
					$scope.Data.organizationList = res.data;
				});
			},
			onOrganiztionChange: function (data) {
				secretariatSrvc.getSenderList($scope.Data.orgUid, data.uid).then(function (res) {
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
			setPdfUrl: function (model) {
                // var fileUrl = secretariatSrvc.getFileURLForViewByFile({name:'letterPdf.html', hash:model.hash});
                // var encodedUrl =  encodeURIComponent("/Kateb/files/letterPdf.html?mode=view&fcode=" + model.hash + "&contentType=text/html");
                $scope.Data.pdfUrl = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/files/letterPdf.html?mode=view&fcode=" + model.hash + "&contentType=text/html");
            },
            trustSrc : function(src) {
                return $sce.trustAsResourceUrl(src);
            },
            getLastSearchQuery: function () {
                return secretariatSrvc.getLastSearchQuery();
            },
			searchDstOrg: function (item) {
				if (item) {
					secretariatSrvc.getDstOrgList(item).then(function (res) {
						$scope.Data.dstOrgList = res.data;
					});
				}
			},
			onAddDstOrg: function (model) {
				// var tempModel = angular.copy(model);
				$scope.Data.selectedDstOrgList.push(model);
				// $scope.Data.selectedDstOrg = undefined;
				// $scope.Data.dstOrgList = [];
			},
			removeSelectedDstOrg: function (index) {
				$scope.Data.selectedDstOrgList.splice(index, 1);
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
			multiSelectorsController: {
				multiSelectTagTranslate : new katebSrvc.MultiselectTranslate('انتخاب برچسب'),
				multiSelectSettings : {
					externalIdProp : '',
					displayProp : 'title',
					enableSearch : true,
					scrollableHeight : '300px',
					scrollable : true,
					idProp : 'uid',
					showCheckAll : true,
					showUncheckAll : true
				}
			},
			archivedLetterListApi: {
				getArchivedLetterListFn: null
			}
		}

		var Run = function(){
			$scope.Func.getTabList();
			//$scope.Func.getIndicatorBookList();
			$scope.Func.onTabClick($scope.Data.tabList[0]);
			if($scope.Data.incUid)
				$scope.Func.getIssuedLetter();
			$scope.Func.getExternalOrganizationList();
		}

		Run();

});
