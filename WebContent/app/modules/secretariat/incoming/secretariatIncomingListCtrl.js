angular.module('secretariatModule').controller('secretariatIncomingListCtrl', function($scope, $state, secretariatSrvc,$modal) {

	$scope.Data = {
		secUid: $state.params.secUid,
		featuresList: secretariatSrvc.getFeatureList($state.params.secUid)
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
			headers: [
			    {key:'creationDate', label:'تاریخ ذخیره‌سازی', type:'date', format:'jDD-jMMMM-jYYYY'},
			    {key:'creatorUser.title', label:'کاربر سازنده'},
			    {key:'creatorSecretariat.title', label:'دبیرخانه'},
//			    {key:'state', type:'enum', label:'وضعیت', filter:'state'},
				{key:'externalNumber', label:'شماره خارجی'},		
				{key:'subject', label:'موضوع'},		
				{key:'officialDate', label:'تاریخ رسمی', type:'date', format:'jDD-jMMMM-jYYYY'},
                {type:'action',label:'', icon:'flaticon-close-button',action:$scope.Func.onIncomingDeleteClick}
			],
			getList : function(start, pageLen){
				return secretariatSrvc.getIncomingList($scope.Data.secUid, start, pageLen);
			},
			onListItemSelect : $scope.Func.onIncomingClick
		}
	}
	
	var Run = function(){
	}
	
	Run();
});