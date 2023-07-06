angular.module('ruleModule').controller('ruleCtrl', function($scope, $state, ruleSrvc, appConst, $filter) {

	$scope.Data = {
		mode: 'view',
		searchMode: 'none',
		ruleList: [],
        selectedrule: {},

		originalrule: {},
		validationClicked: false,
		rulerolelist: [],
		selectedruleAuthorization: {
			accessToSignLetter: false,
			sendLetterToOut: false,
			seenByCooperatorInstitutions: false
		},
//        ruleBetweenGroup: "ruleBetweenOneGroup",
		type: "inGroup",
		groupList: [],
		typeKeyList: ["SECRETARIAT_HEAD", "SECRETARIAT_POSITION", "SECURITY_HEAD", "ASSISTANT", "MANAGEMENT", "ADMINISTRATIVE", "EXPERT","INSPECTION"],
	}
	
	$scope.Func = {
		onAddModeClick: function(){
			$scope.Data.mode = 'add';
			// $scope.Data.selectedrule = {roles: $scope.Data.ruleroleList};
			$scope.Data.selectedrule = {
                    name: "",
                    rule: "",
                    groupOne: [],
                    groupTwo: []
            };
		},
		onSelectrule: function(rule) {
            if (rule.uid) {
                ruleSrvc.getrule(rule.uid).then(function (response) {
                    $scope.Data.selectedrule = response.data.originalElement;
                    $scope.Data.originalrule = angular.copy($scope.Data.selectedrule);
                    $scope.Data.mode = 'view';
//                    if ($scope.Data.selectedrule.groupTwo.length == 0) {
//                        $scope.Data.ruleBetweenGroup = "ruleBetweenOneGroup";
//                    } else $scope.Data.ruleBetweenGroup = "ruleBetweenTwoGroup";
                });
        }
		},
		onEditruleClick: function(){
			$scope.Data.mode = 'edit';
			var typeKey = {};
			typeKey.value = $filter('appEnum')($scope.Data.typeKeyOne);
			typeKey.key = $scope.Data.typeKeyOne;
			$scope.Data.typeKeyOne = typeKey;
		},
		onSaveruleClick: function(){
			// if($scope.Data.ruleBetweenGroup == 'ruleBetweenOneGroup'){
			// 	$scope.Data.selectedrule.groupTwo = [];
			// }
            // if($scope.Data.selectedrule.groupOne.length) {
            //     $scope.Data.selectedrule.groupOne = [];
            // }
            // if($scope.Data.selectedrule.rule) {
            //     $scope.Data.selectedrule.rule = "";
            // }
			if($scope.ruleForm.$valid){
				ruleSrvc.saverule($scope.Data.selectedrule).then(function(response){
					// $scope.Func.updateruleAuthentication(response.data.uid, $scope.Data.selectedruleAuthorization);
					// $scope.Controller.ruleListController.refreshList();
                    $scope.Func.refreshList();
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onUpdateruleClick: function(){
			if($scope.ruleForm.$valid){
				ruleSrvc.updaterule($scope.Data.selectedrule).then(function(response){
					// $scope.Controller.ruleListController.refreshList();
                    $scope.Func.refreshList();
					$scope.Func.resetForm();
				});
			}else{
				$scope.Data.validationClicked = true;
			}
		},
		onDeleteruleClick: function(){
			ruleSrvc.deleterule($scope.Data.selectedrule.uid).then(function(response){
				$scope.Func.resetForm();
                $scope.Func.reset();
				// $scope.Controller.ruleListController.refreshList();
                $scope.Func.refreshList();
			});
		},
		onCancelClick: function(){
			$scope.Data.selectedrule = angular.copy($scope.Data.originalrule);
			$scope.Func.resetForm();
		},
		
		onChangeSearchModeClick: function(mode){
			$scope.Data.searchMode = mode;
		},
		//onSearchClick: function(advancedMode){
		//	if(advancedMode){
		//		$scope.Func.onChangeSearchModeClick('advanced');
		//		$scope.Controller.ruleListController.searchQuery = $scope.Controller.ruleAdvancedSearchController.searchQuery;
		//		$scope.Controller.ruleListController.searchableFieldInfo = $scope.Controller.ruleAdvancedSearchController.searchableFieldInfo;
		//	}else{
		//		$scope.Func.onChangeSearchModeClick('quick');
		//		$scope.Controller.ruleListController.searconChangeSearchModeClickhQuery = $scope.Controller.ruleSearchController.searchQuery;
		//		$scope.Controller.ruleListController.searchableFieldInfo = $scope.Controller.ruleSearchController.searchableFieldInfo;
		//	}
		//	$scope.Controller.ruleListController.refreshList(true);
		//},
		//onExitSearchModeClick: function(){
		//	$scope.Func.onChangeSearchModeClick('none');
		//	$scope.Controller.ruleAdvancedSearchController.searchQuery = {};
		//	$scope.Controller.ruleSearchController.searchQuery = {};
		//	$scope.Controller.ruleListController.exitSearchMode();
		//},
		updateruleAuthentication: function (ruleUid, data) {
			delete data.originalElement;
			ruleSrvc.updateruleAuthentication(ruleUid, data).then(function (res) {

			});
		},
		getruleAuthentication: function (ruleUid) {
			ruleSrvc.getruleAuthentication(ruleUid).then(function (res) {
				$scope.Data.selectedruleAuthorization	=res.data;
			});
		},
        reset: function(){
            $scope.Data.selectedrule = {};
        },
		resetForm: function() {
			$scope.Data.mode = 'view';
			$scope.Data.validationClicked = false;
        },
		getGroupList: function () {
			ruleSrvc.getGroupList().then(function(response){
				for ( var int = 0; int < response.data.originalElement.length; int++) {
					$scope.Data.groupList.push(response.data.originalElement[int]);
				}
			});
		},
		getRuleList: function () {
            var tempRuleList = [];
			ruleSrvc.getruleList().then(function (response) {
				for( var i = 0; i < response.data.originalElement.length; i++) {
                    tempRuleList.push(response.data.originalElement[i]);
				}
				$scope.Func.addFakeRule(tempRuleList);
                $scope.Data.ruleList = angular.copy(tempRuleList);
			})
		},
		onSyncClick: function () {
			$scope.Func.removeFakeRule($scope.Data.ruleList);
            ruleSrvc.updateSortedList($scope.Data.ruleList).then(function () {
                $scope.Func.addFakeRule($scope.Data.ruleList);
            })
        },
		addFakeRule: function (list) {
			list.push({uid:'',title:''});
		},
		removeFakeRule: function (list) {
			list.pop();
		},
        refreshList: function () {
            $scope.Func.getRuleList();
        },
		onPositionTypeChange: function (type, typeKey) {
			if (type == "one") {
				if (!$scope.Data.selectedrule.groupOne.length) {
					$scope.Data.selectedrule.groupOne = [];
				}
				ruleSrvc.getPositionType(typeKey).then(function (res) {
					var indexDuplicate = -1;
					angular.forEach(res.data.originalElement, function (positionType) {
						indexDuplicate = _.findIndex($scope.Data.selectedrule.groupOne, function (item) {
							return item.uid == positionType.uid;
						});
						if (indexDuplicate == -1) {
							$scope.Data.selectedrule.groupOne.push({
								uid: positionType.uid,
								title: positionType.title
							});
						}
					});
				});
			} else if (type == "two") {
				if (!$scope.Data.selectedrule.groupTwo.length) {
					$scope.Data.selectedrule.groupTwo = [];
				}
				ruleSrvc.getPositionType(typeKey).then(function (res) {
					var indexDuplicate = -1;
					angular.forEach(res.data.originalElement, function (positionType) {
						indexDuplicate = _.findIndex($scope.Data.selectedrule.groupTwo, function (item) {
							return item.uid == positionType.uid;
						});
						if (indexDuplicate == -1) {
							$scope.Data.selectedrule.groupTwo.push({
								uid: positionType.uid,
								title: positionType.title
							});
						}
					});
				});
			}
		}
	}
	
	$scope.Controller = {
		//ruleListController: {
		//	headers: [
		//		{key:'rulename'},
		//		{key:'firstName'},
		//		{key:'lastName'},
		//	],
		//	getList: ruleSrvc.getFullruleList,
		//	onListItemSelect: $scope.Func.onSelectrule,
		//	searchFunction: ruleSrvc.searchrule,
		//},
		//ruleSearchController: {
		//	advanced: false,
		//	searchableFieldInfo: [
		//		{key:"rulename", type:"string", label:"نام کاربری"},
		//		{key:"firstName", type:"string", label:"نام"},
		//		{key:"lastName", type:"string", label:"نام خانوادگی"},
		//		{key:"enabled", type:"bool", label:"فعال"},
		//	],
		//	onSearchClick: $scope.Func.onSearchClick,
		//	onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		//},
		//ruleAdvancedSearchController: {
		//	advanced: true,
		//	searchableFieldInfo: [
		//		{key:"rulename", type:"string", label:"نام کاربری"},
		//		{key:"firstName", type:"string", label:"نام"},
		//		{key:"lastName", type:"string", label:"نام خانوادگی"},
		//		{key:"enabled", type:"bool", label:"فعال بودن"},
		//	],
		//	onSearchClick: $scope.Func.onSearchClick,
		//	onExitSearchModeClick: $scope.Func.onExitSearchModeClick
		//}
	}
	
	var Run = function(){
		ruleSrvc.setOrgUid($state.params.orgUid);
		$scope.Func.getRuleList();
		$scope.Func.getGroupList();
		$scope.appConst = appConst;
	}
	
	Run();
});