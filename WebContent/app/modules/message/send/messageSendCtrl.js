angular.module('messageModule').controller('messageSendCtrl', function($scope, messageSrvc) {

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
			messageSrvc.getOneSendMessages(message.uid).then(function (response) {
				$scope.Data.messageInfo = response.data;
				$scope.Data.showMessageInfo = true;
			});
		},
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		//onDownloadAllFilesClick: function () {
        //
		//},
		//onDownloadSelectedFilesClick: function () {
        //
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
				{key:'receivers'},
				{key:'subject'},
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
				return messageSrvc.getSendMessages(start, pageLen);
			},
			onListItemSelect: $scope.Func.onInboxListItemClick,
			searchFunction: messageSrvc.searchSendMessageList
		},
		attachment: {}
	}

	var Run = function(){
	}

	Run();
});