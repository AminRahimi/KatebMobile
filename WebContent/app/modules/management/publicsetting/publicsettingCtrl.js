angular.module('publicsettingModule').controller('publicsettingCtrl', function($scope, $state, publicsettingSrvc) {

	$scope.Data = {
		mode: 'view',
		selectedpublicsetting: {},
		defaultSecretariat:{},
		originalpublicsetting: {},
		indicatorBookList: [],
		validationClicked: false,
		fontList: [{
			title: 'فونت پیش‌فرض',
		}],
		selectedFont:''
	}
	
	$scope.Func = {
		getpublicsetting: function(){
			publicsettingSrvc.getpublicsetting().then(function(response){
				$scope.Data.selectedpublicsetting = response.data.originalElement;
				$scope.Data.originalpublicsetting = angular.copy($scope.Data.selectedpublicsetting);
				$scope.Func.initiateinternalIndicatorBook();
				$scope.Func.initiatedraftIndicatorBook();
				$scope.Func.initiatedefaultSecretariatBook();
				$scope.Data.mode='view';
			});
		},
		initiatedefaultSecretariatBook: function(){
			if($scope.Data.selectedpublicsetting.defaultSecretariat){
				for ( var int = 0; int < $scope.Data.secretariatList.length; int++) {
					if($scope.Data.secretariatList[int].uid==$scope.Data.selectedpublicsetting.defaultSecretariat.uid)
						$scope.Data.defaultSecretariat = $scope.Data.secretariatList[int];
				}
			}
		},
		onEditpublicsettingClick: function(){
			$scope.Data.mode = 'edit';
		},
		onUpdatepublicsettingClick: function () {
			if ($scope.Data.selectedFont && $scope.Data.selectedFont.uid) {
				$scope.Data.selectedpublicsetting.defaultFont = {
					"uid": $scope.Data.selectedFont.uid
				};
			} else {
				$scope.Data.selectedpublicsetting.defaultFont = null;
			}
			if($scope.publicsettingForm.$valid){
				console.log($scope.Data.selectedpublicsetting);
				publicsettingSrvc.savepublicsetting($scope.Data.selectedpublicsetting).then(function(response){
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onCancelClick: function(){
			$scope.Data.selectedpublicsetting = angular.copy($scope.Data.originalpublicsetting);
			$scope.Func.initiateinternalIndicatorBook();
			$scope.Func.initiatedraftIndicatorBook();
			$scope.Func.resetForm();
		},
		
		getIndicatorBookList: function(){
			publicsettingSrvc.getinternalIndicatorBookList().then(function(response){
				$scope.Func.getpublicsetting();
				for ( var int = 0; int < response.data.originalElement.length; int++) {
					$scope.Data.indicatorBookList.push(response.data.originalElement[int]);					
				}
			});
		},
		getFontList: function () {
			publicsettingSrvc.getFontList().then(function (res) {
				$scope.Data.fontList = $scope.Data.fontList.concat(res.data.originalElement);
			});
		},
		onSelectinternalIndicatorBook: function(internalIndicatorBook){
			$scope.Data.internalIndicatorBook = internalIndicatorBook;
			$scope.Data.selectedpublicsetting.internalIndicatorBook = {
				uid:$scope.Data.internalIndicatorBook.uid,
				title:$scope.Data.internalIndicatorBook.title
			};
		},
		initiateinternalIndicatorBook: function(){
			$scope.Data.internalIndicatorBook = null;
			if($scope.Data.selectedpublicsetting.internalIndicatorBook){
				for ( var int = 0; int < $scope.Data.indicatorBookList.length; int++) {
					if($scope.Data.indicatorBookList[int].uid==$scope.Data.selectedpublicsetting.internalIndicatorBook.uid)
						$scope.Data.internalIndicatorBook = $scope.Data.indicatorBookList[int];
				}
			}
		},
		onSelectdraftIndicatorBook: function(draftIndicatorBook){
			$scope.Data.draftIndicatorBook = draftIndicatorBook;
			$scope.Data.selectedpublicsetting.draftIndicatorBook = {
				uid:$scope.Data.draftIndicatorBook.uid,
				title:$scope.Data.draftIndicatorBook.title
			};
		},
		initiatedraftIndicatorBook: function(){
			$scope.Data.draftIndicatorBook = null;
			if($scope.Data.selectedpublicsetting.draftIndicatorBook){
				for ( var int = 0; int < $scope.Data.indicatorBookList.length; int++) {
					if($scope.Data.indicatorBookList[int].uid==$scope.Data.selectedpublicsetting.draftIndicatorBook.uid)
						$scope.Data.draftIndicatorBook = $scope.Data.indicatorBookList[int];
				}
			}
		},
		getSecretariatList : function () {
			publicsettingSrvc.getSecretariatList().then(function (response){
				$scope.Data.secretariatList = response.data;
			});
		},
		onSecratariatChange : function (selected) {
			$scope.Data.defaultSecretariat = selected;
			$scope.Data.selectedpublicsetting.defaultSecretariat = selected;
		},
		
		reset: function(){
			$scope.Data.selectedpublicsetting = {};
			$scope.Data.internalIndicatorBook = null;
			$scope.Data.draftIndicatorBook = null;
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
		
	}
	
	var Run = function(){
		publicsettingSrvc.setOrgUid($state.params.orgUid);
		$scope.Func.getIndicatorBookList();
		$scope.Func.getFontList();
		$scope.Func.getSecretariatList();
	}
	
	Run();
});