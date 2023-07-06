angular.module('userModule').controller('userCtrl', function ($scope, $state, utils, userSrvc, userroleSrvc,cartableSrvc) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		userList: [],
		selecteduser: {
		},
		originaluser: {},
		validationClicked: false,
		userrolelist: [],
		selectedUserAuthorization: {
			accessToSignLetter: false,
			sendLetterToOut: false,
			seenByCooperatorInstitutions: false,
            accessToParaphOtherOrgLetter: false
		},
		extOrgList: [],
		selectedOrg: '',
		confirmDelete:false
	}
	
	$scope.Func = {
		onAdduserClick: function(){
			$scope.Data.mode = 'add';
			$scope.Data.selecteduser = {roles: $scope.Data.userroleList};
			$scope.Data.selecteduser.enabled = true;
			$scope.Data.selectedUserAuthorization.signIssuedLetterAccess = true;
		},
		onSelectuser: function(user){
			userSrvc.getuser(user.uid).then(function(response){
				$scope.Data.selecteduser = response.data.originalElement;
				$scope.Data.originaluser = angular.copy($scope.Data.selecteduser);
				$scope.Data.mode='view';
			});
			$scope.Func.getuserAuthentication(user.uid);
		},
		onEdituserClick: function(){
			$scope.Data.mode = 'edit';
		},
		onSaveuserClick: function(){
			if($scope.userForm.$valid){
				if ($scope.Data.selecteduser.password) {
					// $scope.Data.selecteduser.password = md5($scope.Data.selecteduser.password);
				} else {
					delete $scope.Data.selecteduser.password;
				}
				userSrvc.saveuser($scope.Data.selecteduser).then(function(response){
					$scope.Func.updateuserAuthentication(response.data.uid, $scope.Data.selectedUserAuthorization);
					$scope.Controller.userListController.refreshList()
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdateuserClick: function(){
			if($scope.userForm.$valid){
				if ($scope.Data.selecteduser.password) {
					// $scope.Data.selecteduser.password = md5($scope.Data.selecteduser.password);
				} else {
					delete $scope.Data.selecteduser.password;
				}
				if (!$scope.Data.selecteduser.signature) {
					$scope.Data.selecteduser.signature = null;
				}
				userSrvc.updateuser($scope.Data.selecteduser).then(function(response){
					$scope.Func.resetForm();
					$scope.Func.reset();
					$scope.Controller.userListController.refreshList();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
			$scope.Func.updateuserAuthentication($scope.Data.selecteduser.uid, $scope.Data.selectedUserAuthorization);
		},
		onDeleteuserClick: function(){
			utils.removeConfirmModal().then(function(res) {
				if(res) {
					userSrvc.deleteuser($scope.Data.selecteduser.uid).then(function(response) {
						$scope.Func.resetForm();
						$scope.Func.reset();
						$scope.Controller.userListController.refreshList();
					});
				}
			});
		},
		onLoginClick: function () {
			// TODO Uncomment and it must work
			$.ajax({
				type: "POST",
				url: '../Kateb/j_spring_security_switch_user',
				data: {
					j_username: $scope.Data.selecteduser.username,
				},
				contentType: "application/x-www-form-urlencoded",
				dataType: "JSON",
				success: function (strData) {
					window.location.href = "/";
				},
				error: function () {
					window.location.href = "./";
				}
			});
			/*userSrvc.getUserPass($scope.Data.selecteduser.uid).then(function (res) {
				$.ajax({
					type: "POST",
					url: '../Kateb/j_spring_security_check',
					data: {
						j_username: res.data.username,
						j_password: res.data.password
					},
					contentType: "application/x-www-form-urlencoded",
					dataType: "JSON",
					success: function (strData) {
						window.location.href = "/";
					},
					error: function () {
						window.location.href = "./";
					}
				});
			});*/
		},
		onCancelClick: function(){
			$scope.Data.selecteduser = angular.copy($scope.Data.originaluser);
			$scope.Func.resetForm();
		},
		onMoveClick: function () {
			userSrvc.moveUser($scope.Data.selecteduser.uid, $scope.Data.selectedOrg.uid).then(function () {
				$scope.Data.selectedOrg = null;
				$scope.Controller.userListController.refreshList();
				$scope.Data.confirmDelete = false;
			})

		},
		
		onConfirmClick: function () {
			$scope.Data.confirmDelete = !$scope.Data.confirmDelete;

		},
		getExternalOrganizationList: function () {
			cartableSrvc.getExternalOrganizationList().then(function (res) {
				$scope.Data.extOrgList = res.data.originalElement;
			})
		},
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		onSearchClick: function(advancedMode){
			if(advancedMode){
				$scope.Func.onChangeSearchModeClick('advanced');
				$scope.Controller.userListController.searchQuery = $scope.Controller.userAdvancedSearchController.searchQuery;
				$scope.Controller.userListController.searchableFieldInfo = $scope.Controller.userAdvancedSearchController.searchableFieldInfo;
			}else{
				$scope.Func.onChangeSearchModeClick('quick');
				$scope.Controller.userListController.searchQuery = $scope.Controller.userSearchController.searchQuery;
				$scope.Controller.userListController.searchableFieldInfo = $scope.Controller.userSearchController.searchableFieldInfo;			
			}
			$scope.Controller.userListController.refreshList(true);
		},
		onExitSearchModeClick: function(){
			$scope.Func.onChangeSearchModeClick('none');
			$scope.Controller.userAdvancedSearchController.searchQuery = {};
			$scope.Controller.userSearchController.searchQuery = {};
			$scope.Controller.userListController.exitSearchMode();
		},
		updateuserAuthentication: function (userUid, data) {
			delete data.originalElement;
			userSrvc.updateuserAuthentication(userUid, data).then(function (res) {

			});
		},
		getuserAuthentication: function (userUid) {
			userSrvc.getuserAuthentication(userUid).then(function (res) {
				$scope.Data.selectedUserAuthorization	=res.data;
			});
		},

		getuserroleList: function(){
			userroleSrvc.getExtenduserroleList().then(function(response){
				$scope.Data.userroleList = response.data.originalElement;
				_.map($scope.Data.userroleList, function(userrole) {
					userrole.active = false;
					return userrole;
				});
			});
		},
		
		reset: function(){
			$scope.Data.selecteduser = {};
		},
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
		}
	}
	
	$scope.Controller = {
		userListController: {
			headers: [
				{key:'username'},		
				{key:'firstName'},		
				{key:'lastName'},		
			],
			getList: userSrvc.getFulluserList,
			onListItemSelect: $scope.Func.onSelectuser,
			searchFunction: userSrvc.searchuser,
		},
		userSearchController: {
			advanced: false,
			searchableFieldInfo: [
				{key:"username", type:"string", label:"نام کاربری"},
				{key:"firstName", type:"string", label:"نام"},
				{key:"lastName", type:"string", label:"نام خانوادگی"},
				{key:"enabled", type:"bool", label:"فعال"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		},
		userAdvancedSearchController: {
			advanced: true,
			searchableFieldInfo: [
				{key:"username", type:"string", label:"نام کاربری"},
				{key:"firstName", type:"string", label:"نام"},
				{key:"lastName", type:"string", label:"نام خانوادگی"},
				{key:"enabled", type:"bool", label:"فعال بودن"},
			],
			onSearchClick: $scope.Func.onSearchClick,
			onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		}
	}
	
	var Run = function(){
		$scope.Func.getuserroleList();
		userSrvc.setOrgUid($state.params.orgUid);
		$scope.Func.getExternalOrganizationList()
	}
	
	Run();
});
