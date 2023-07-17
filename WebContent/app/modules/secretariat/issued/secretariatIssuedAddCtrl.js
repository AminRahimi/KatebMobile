angular.module('secretariatModule').controller('secretariatIssuedAddCtrl',
		function($scope, $rootScope, $state, $modal, secretariatSrvc, vtShowMessageSrvc, hotkeys,$timeout, configObj,homeSrvc) {
///////////////////////////////////FIXME rahimi
	$scope.doAoutoSizeInput=function(){
		$timeout(function(){
			
			$('.auto-size-input').on('keydown',function(e) {
				
				$("#hidden_span").html("");
				$("#hidden_span").append("<p>"+$(this).val()+"</p>");
				
				var hidden_span_scroll_width=$("#hidden_span")[0].scrollWidth+120;
				
				if(hidden_span_scroll_width> 100||hidden_span_scroll_width< 600){
					$(this).css("width",hidden_span_scroll_width);
				}
				
			});
		},1);
	}
	/////////////////////////////////////
	$scope.Data = {
		mode: 'view',
		draftUid: $state.params.draftUid,
		secUid: $state.params.secUid,
		tabList: [],
		tagList: [],
		senderList: [],
		secretariatList: [],
		letterLayoutList: [],
		indicatorBookList: [],
		orgUid: $rootScope.currentUserOrg.uid,
		draft: {
			deliveryTo: [],
			deliveryCc: [],
			deliveryBcc: [],
            attachments: [],
            priority: 'Normal',
			officialDate: new Date(),
			pageSize: 'A4'
		},
		disableSendBtn: false,
        currentDate: new Date(),
		officialDateMax: new Date(),
		hasExternalArchives: configObj.externalArchives.length,
		vtFolderSelectorForm: ""
	}

	var shape;

	$scope.Func = {
		getStateName: function (stateName) {
			return homeSrvc.getStateName(stateName);
		},
		getTabList: function(){
			$scope.Data.tabList = [{
				id: 0,
				title: 'اطلاعات نامه',
				uiSref: ''
			},{
				id: 1,
				title: 'نامه',
				uiSref: ''
			},{
				id: 2,
				title: 'ضمیمه',
				uiSref: ''
			}]
		},
		onTabClick: function(tab){
			$scope.Data.selectedTab = tab;
			$scope.Func.deactiveTabs();
			tab.active = true;
		},
		deactiveTabs: function(){
			for ( var int = 0; int < $scope.Data.tabList.length; int++) {
				$scope.Data.tabList[int].active = false;
			}
		},

		onSendClick: function(){
			if($scope.form.$invalid){
				$scope.Data.validationClicked=true;
			}else{
				$scope.Data.disableSendBtn = true;
				if(_.isObject($scope.Data.scanedFile)){
					$scope.Data.draft.fileBody = $scope.Data.scanedFile;
				}
				if($scope.Apis && $scope.Apis.schemaFormApi) {
					$scope.Apis.schemaFormApi.prepareLetterFormTypeForSave();
				}
                var sendData = $scope.Func.removeExtraFields($scope.Data.draft);
                sendDataCp = angular.copy(sendData);
				secretariatSrvc.sendIssued($scope.Data.secUid, sendDataCp).then(function(response){
					vtShowMessageSrvc.showMassage('success', 'نامه شماره '+response.data.internalNumber , 'نامه با موفقیت ثبت شد.',20000);
					$scope.Func.onReturnClick();
					$scope.Data.validationClicked=false;
				});
			}
		},
		onReturnClick: function(){
			$state.go($scope.Func.getStateName('base.home.secretariat.issuedList'),{secUid:$scope.Data.secUid});
		},

		onSenderRefresh: function(query){
			if (query.length > 2) {
				secretariatSrvc.getIssuedSenderSearchList(query).then(function (response) {
					$scope.Data.senderList.length = 0;
					for ( var int = 0; int < response.data.originalElement.length; int++) {
						$scope.Data.senderList.push(response.data.originalElement[int]);
					}
				})
			}
		},
		onRemoveSenderClick: function (item) {
			if (item == "sender") {
				$scope.Data.draft.sender = null;
			} else if (item == "actor") {
				$scope.Data.draft.actor = null;
			} else if(item == "topicCategory") {
				$scope.Data.topicCategory = null;
			}
		},
		getTagList: function(){
			secretariatSrvc.getPublicTagList($scope.Data.orgUid).then(function(response){
				$scope.Data.tagList = response.data.originalElement;
			});
		},
        searchTagList: function(query, type){
            if (query.length > 1) {
                secretariatSrvc.searchPublicTagList($scope.Data.orgUid, query).then(function(response){
                    $scope.Data.tagList = response.data.originalElement;
                });
            }
        },
		getIndicatorBookList: function(){
			secretariatSrvc.getIndicatorBookList($scope.Data.secUid).then(function(response){
				for ( var int = 0; int < response.data.originalElement.length; int++) {
					$scope.Data.indicatorBookList.push(response.data.originalElement[int]);
				}
				if($scope.Data.indicatorBookList.length)
					$scope.Func.onSelectIndicatorBook($scope.Data.indicatorBookList[0]);
			});
		},
		onSelectIndicatorBook: function(indicatorBook){
			$scope.Data.indicatorBook = indicatorBook;
			$scope.Data.draft.indicatorBook = {
				uid:$scope.Data.indicatorBook.uid,
				title:$scope.Data.indicatorBook.title
			};
		},
		onSelectTopicCategory: function(topicCategory){
			$scope.Data.topicCategory = topicCategory;
			$scope.Data.draft.topicCategory = {
				uid:$scope.Data.topicCategory.uid,
				title:$scope.Data.topicCategory.title
			};
			$scope.Data.draft.subject = topicCategory.title;
			$timeout(function(){
            	$('.auto-size-input').keydown();
            },100);
		},
		initiateSender: function(){
			$scope.Data.sender = null;
			if($scope.Data.draft.sender){
				for ( var int = 0; int < $scope.Data.senderList.length; int++) {
					if($scope.Data.senderList[int].uid==$scope.Data.letter.sender.uid)
						$scope.Data.sender = $scope.Data.senderList[int];
				}
			}
		},

		onResetClick: function(){
			$scope.Data.draft = {
				deliveryTo: [],
				deliveryCc: [],
				deliveryBcc: []
			};
			$scope.Data.responseNeeded = false;
		},
        removeExtraFields: function (data, shouldChange) {
            var result = angular.copy(data);
            if (result.tags) {
                angular.forEach(result.tags, function (value, key) {
                    delete value.name;
                    delete value.parent;
                })
            }
			if(result.deliveryCc) {
				angular.forEach(result.deliveryCc, function (cc) {
					if(cc.descEditMode) {
						delete cc.descEditMode
					}
				});
			}
			if(result.deliveryBcc) {
				angular.forEach(result.deliveryBcc, function (bcc) {
					if(bcc.descEditMode) {
						delete bcc.descEditMode
					}
				});
			}
			$scope.Data.draft = angular.copy(data);
            return result;
        },
	}
	$scope.controller={
		scanner:{
			// onFileScanned:function(hashNameObj){
			// 	$scope.controller.letterBody.setPdfUrl(hashNameObj);
			// }
			onCreatedpdfUploaded : function (hashNameObj) {
				$scope.controller.letterBody.setPdfUrl(hashNameObj);
				// $scope.controller.vtPDF.pdfUrl = fileSrvc.getFileURLForViewByFile({name: hashNameObj.name, hash: hashNameObj.hash});

			}
		},
		letterBody:{},

		multiselectRecieverSearch: function(query){
			return secretariatSrvc.getpositionUserAssignemtsList({secretariat: true, query: query});
		},
        multiselectRecieverSearchTags: function (query) {
            return secretariatSrvc.searchPublicTagList($scope.Data.orgUid, query);
        }
	}

	$scope.Apis= {};

	var Run = function(){
		$scope.Func.getTabList();
		// $scope.Func.getTagList();
		// $scope.Func.getSenderList();
		//$scope.Func.getIndicatorBookList();
		$scope.Func.onTabClick($scope.Data.tabList[0]);
		$scope.Data.mode = 'add';
		$scope.controller.scanner.onScanClick = function () {
			$scope.controller.letterBody.setPdfUrl(undefined);
		}
		
	}

	Run();

	//***** hotKeys *****//

	hotkeys.bindTo($scope)
	.add({
		      combo: 'alt+c',
		      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
		      callback: function(){
		      	$scope.Func.onSendClick()
		      }
	})
	.add({
		      combo: 'esc',
		      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
		      callback: function(){
		      	$scope.Func.onResetClick()
		      }
	});

});
