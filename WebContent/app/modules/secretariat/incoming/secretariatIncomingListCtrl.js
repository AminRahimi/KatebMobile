angular.module('secretariatModule').controller('secretariatIncomingListCtrl', function($scope, $state, secretariatSrvc,$modal,homeSrvc) {

	$scope.Data = {
		secUid: $state.params.secUid,
		featuresList: [],
		// FIXME:pace in rootscope
		isMobileView: homeSrvc.screenSizeDetector.isMobile()
	}

	$scope.Func = {
		onAddClick: function(){
			
			
			
			
			//$state.go('base.home.secretariat.incoming', {secUid: $scope.Data.secUid});
			
			
			
			
			
			var modalInstance = $modal.open({
				templateUrl: 'app/modules/secretariat/incoming/incommingLetterTemplateList.html',
				controller: 'incommingLetterTemplateListCtrl',
				size: 'md'
			});
			modalInstance.result.then(function (incommingLetterTemplate) {
					$state.go('base.home.secretariat.incoming', {secUid: $scope.Data.secUid, tmpUid: incommingLetterTemplate.uid});
			});
			
			
			
			
			
			
			
		},
		
		onIncomingClick: function(incoming){
			$state.go('base.home.secretariat.incoming', {secUid: $scope.Data.secUid, incUid: incoming.uid});
		},
        onIncomingDeleteClick: function (incoming) {
            secretariatSrvc.deleteIncoming($scope.Data.secUid, incoming.uid).then(function (res) {
                $scope.Controller.listController.refreshList();
            });
        }
	}
	
	$scope.Controller = {
		listController : {
			headers:{
				desktop:[
					{key:'creationDate', label:'تاریخ ذخیره‌سازی', type:'date', format:'jDD-jMMMM-jYYYY'},
					{key:'creatorUser.title', label:'کاربر سازنده'},
					{key:'creatorSecretariat.title', label:'دبیرخانه'},
	//			    {key:'state', type:'enum', label:'وضعیت', filter:'state'},
					{key:'externalNumber', label:'شماره خارجی'},		
					{key:'subject', label:'موضوع'},		
					{key:'officialDate', label:'تاریخ رسمی', type:'date', format:'jDD-jMMMM-jYYYY'},
					{type:'action',label:'', icon:'flaticon-close-button',action:$scope.Func.onIncomingDeleteClick}
				],
				mobile:[
					{key:'subject', label: '',styleClass:"kateb-text-2 tw-text-black "},
					{key:'creatorUser.title', label:'کاربر سازنده',styleClass:"kateb-text-2 tw-text-gray",
						labelClass:""},
					{key:'externalNumber', label:'شماره خارجی',styleClass:"kateb-text-2 tw-float-right  tw-text-primary-light",
						labelClass:"tw-text-black"},
					{key:'officialDate', label:'تاریخ رسمی', type:'date', "format": "jDD jMMMM jYYYY",
						styleClass:"kateb-text-2 tw-w-[10em] tw-float-left  tw-text-primary-light",
						labelClass:"tw-text-black"}
				]
			} ,
			getList : function(start, pageLen){
				return secretariatSrvc.getIncomingList($scope.Data.secUid, start, pageLen);
			},
			onListItemSelect : $scope.Func.onIncomingClick
		}
	}
	
	var Run = function(){
		secretariatSrvc.getFeatureList($state.params.secUid).then(function(featuresList) {
            $scope.Data.featuresList = featuresList;
        });
	}
	
	Run();
});