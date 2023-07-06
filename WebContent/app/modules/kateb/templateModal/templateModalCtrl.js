angular.module('katebModule').controller('templateModalCtrl', function ($scope, $modalInstance, templateModalSrvc, $state, orgUid, katebSrvc) {

	$scope.Data = {
		orgUid: orgUid,
		orgList: [],
        selectedTemplate: null,
        query:''
	}
	
	$scope.Func = {
		onSelectTemplate: function(template, model){
		    if($scope.Data.orgUid === 'EXTERNAL'){
                if($scope.Data.selectedOrg) {
                    $modalInstance.close({selectedTemplate: template, orgUid: $scope.Data.selectedOrg.uid});
                    $scope.Data.validationClicked = false;
                }
                else{
                    $scope.Data.validationClicked = true;
                    katebSrvc.showNotification('organizationNotSelected');
                }
            } else if ($scope.Data.orgUid === 'CURRENT') {
                $modalInstance.close({selectedTemplate: template, orgUid: $scope.Data.orgUid});
            }
		},
		onCancelClick: function() {
			$modalInstance.dismiss('cancel');
			$state.go('home.cartable.cartableList');
        },
        searchTemplateList: function (query) {
            console.log(query)
            templateModalSrvc.searchTemplateList(query).then(function (response) {
                $scope.Data.letterList = response.data;
            })
        },
        searchGlobalsTemplateList: function (query) {
            templateModalSrvc.searchGlobalsTemplateList(query).then(function (response) {
                $scope.Data.letterList = response.data;
                console.log($scope.Data.letterList)
            })
        },
        getOrgList: function () {
            templateModalSrvc.getOrgList().then(function (res) {
				$scope.Data.orgList = res.data.originalElement;
            })
        },
        onRefresh: function (item) {
            if (item.length > 2) {
                templateModalSrvc.searchOrgList(item).then(function (res) {
                    $scope.Data.orgList = res.data.originalElement;
                })
            }
        },
        onSelectOrg: function (item, model) {
		    if($scope.Data.selectedTemplate) {
                $modalInstance.close({selectedTemplate: $scope.Data.selectedTemplate, orgUid: model.uid});
            }
            /*if(item.uid == configObj.userConfig.organization.uid){
                $state.go('home.cartable.draft', {orgUid: "CURRENT"});
            }*/
        },
	}

	$scope.Controller = {
        multiselectRecieverSearch: templateModalSrvc.searchOrgList
	}

    var run = function () {
        if ($scope.Data.orgUid === 'CURRENT') {
            templateModalSrvc.getTemplateList().then(function (res) {
                $scope.Data.clientTemplate = {
                    "uid": "clientTemplate",
                    "name": "قالب خالی",
                    "thumnail": {
                        "id": 0,
                        "name": null,
                        "hash": null,
                        "size": 0
                    }
                };
                $scope.Data.letterList = res.data;
                // $scope.Data.letterList.push(clientTemplate);
            });
        } else if($scope.Data.orgUid === 'EXTERNAL'){
            $scope.Func.getOrgList();
            templateModalSrvc.getGlobalsTemplateList().then(function (res) {
                $scope.Data.clientTemplate = {
                    "uid": "clientTemplate",
                    "name": "قالب خالی",
                    "thumnail": {
                        "id": 0,
                        "name": null,
                        "hash": null,
                        "size": 0
                    }
                };
                $scope.Data.letterList = res.data;
                // $scope.Data.letterList.push(clientTemplate);
            });
        }

	}

	run();

});
angular.module('katebModule').factory('templateModalSrvc', function (Restangular) {
	return {
		getTemplateList: function () {
			return Restangular.all('letter_template/actives').getList();
        },
        searchTemplateList: function (query) {
			return Restangular.all('letter_template/actives?q='+query).getList();
        },
        searchGlobalsTemplateList: function (query) {
            return Restangular.all('letter_template/globals?q='+query).getList();
        },
        getGlobalsTemplateList: function () {
            return Restangular.all('letter_template/globals').getList();
        },
		getOrgList: function () {
			return Restangular.all('organization/externals').getList({len: -1});
        },
        searchOrgList: function(query){
            return Restangular.all('organization/externals').getList({query: query});
        }
	}
});