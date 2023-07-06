angular.module('katebModule').controller('allLetterModalCtrl', function($scope, $modalInstance,$rootScope, searchSrvc) {

	var getAllLetterList = function (start, len) {
		return $scope.Func.search({}, start, len);
	}

	$scope.Data = {
			searchMode : 'none',
			orgUid: $rootScope.currentUserOrg.uid
	}
	
	$scope.Func = {
		search: function(query,start, len){
			var query = searchSrvc.prepareSearchQuery(query);
			return searchSrvc.search(query, start, len,{type:"olc",extent:"full"});
		},
		onSelectLetter : function(item){
			item.source.letter.uid = item.source.uid;
			$modalInstance.close(item.source.letter);
		},
		onCancelClick: function() {
			$modalInstance.dismiss('cancel');
		},
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick : function(advancedMode){
			$scope.Func.onChangeSearchModeClick('quick');
			$scope.Controller.allLettersListController.searchQuery = $scope.Controller.allLettersSearchController.searchQuery;
			$scope.Controller.allLettersListController.searchableFieldInfo = $scope.Controller.allLettersSearchController.searchableFieldInfo;			
        	$scope.Controller.allLettersListController.getList = (start, len)=> $scope.Func.search($scope.Controller.allLettersSearchController.searchQuery, start, len);;
        	$scope.Controller.allLettersListController.refreshList();
		},
		onExitSearchModeClick : function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.allLettersSearchController.searchQuery = {};
			$scope.Controller.allLettersListController.exitSearchMode();
			$scope.Controller.allLettersListController.getList = getAllLetterList;
            $scope.Controller.allLettersListController.refreshList();
		}
	}
	
	$scope.Controller = {
			allLettersListController : {
				headers : [
		            {key:'source.letter.internalNumber', label:'شماره نامه'},
					{key:'source.letter.subject', label:'موضوع'},		
					{key:'source.letter.sender.title', label:'فرستنده'},	
					{key:'source.letter.officialDate', type:'date', label:'تاریخ رسمی', format:'jDD-jMMMM-jYYYY'},
					{key:'source.letter.externalNumber', type:'string', label:'شماره خارجی'},
				],
				getList : getAllLetterList,
				onListItemSelect : $scope.Func.onSelectLetter,
				// searchFunction : searchAllLettersList,
			},
			allLettersSearchController : {
				advanced : false,
				searchableFieldInfo : [
					{key:"number", type:"string", label:"شماره نامه"},
					{key:"subject", type:"string", label:"موضوع"},
					{key:"sender", type:"string", label:"فرستنده"},
					{key:'externalNumber', type:'string', label:'شماره خارجی'},
				],
				onSearchClick : $scope.Func.onSearchClick,
				onExitSearchModeClick : $scope.Func.onExitSearchModeClick
			}
		}
});