angular.module('messageModule').controller('messageInboxCtrl', function($scope, messageSrvc, $rootScope) {

	$scope.Data = {
		searchMode: 'none',
		messageInfo: "",
		showMessageInfo: false
	}

	$scope.Func = {
		onSearchClick : function(){
			$scope.Func.onChangeSearchModeClick('quick');
      $scope.Controller.listController.searchQuery = $scope.Controller.searchController.searchQuery;
            $scope.Controller.listController.searchableFieldInfo = $scope.Controller.searchController.searchableFieldInfo;
            $scope.Controller.listController.refreshList(true);
		},
		onExitSearchModeClick : function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.searchController.searchQuery = {};
			$scope.Controller.listController.exitSearchMode();
		},
		onInboxListItemClick : function(message){
			messageSrvc.getOneMessage(message.uid).then(function (response) {
				$scope.Data.messageInfo = response.data;
				$scope.Data.showMessageInfo = true;
				$scope.Controller.listController.refreshList();
				$rootScope.$broadcast("getUnreadMessagesCount");
			});
		},
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		//onDownloadAllFilesClick: function () {
		//	var fileSelected = angular.copy($scope.Data.messageInfo.attachments);
		//	fileSelected = _.map(fileSelected, function (item) {
		//		return item.hash;
		//	});
		//	messageSrvc.downloadFiles(fileSelected);
		//},
		//onDownloadSelectedFilesClick: function () {
		//	var fileSelected = angular.copy($scope.Data.messageInfo.attachments);
		//	fileSelected = _.filter(fileSelected, function (item) {
		//		return item.active;
		//	});
		//	if (fileSelected.length > 0) {
		//		fileSelected = _.map(fileSelected, function (item) {
		//			return item.hash;
		//		});
		//		messageSrvc.downloadFiles(fileSelected);
		//	}
		//}
	}

	$scope.Controller = {
			searchController:{
			advanced: false,
			searchableFieldInfo:[
				{key:"uid",type:"string",label:"گیرنده"}
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		listController:{
			headers:[
				{key:'creationDate'},
				{key:'sender.title'},
				{key:'receivers'},
				{key:'subject'},
				{key: 'readingDate'},
				{
					type:'img',
					label:'',
					key: 'attachments',
					if: 'item[field.key].length > 0',
					trueIcon:'fa fa-paperclip',
					falseIcon:'fa'
				}
			],
			getList: function(start, pageLen){
				return messageSrvc.getInboxList(start, pageLen);
			},
			onListItemSelect: $scope.Func.onInboxListItemClick,
			searchFunction: messageSrvc.searchInboxList,
			setRowClass: function(item){
				var classList = [];
				if (!item.read) {
					classList.push('unread-messages-inbox');
				}
				return _.map(classList).join(' ');
			}
		},
		attachment: {}
	}

	var Run = function(){
	}

	Run();
});
