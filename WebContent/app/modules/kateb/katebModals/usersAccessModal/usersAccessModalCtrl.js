angular.module('katebModule').controller('usersAccessModalCtrl', function ($scope, $state, $modalInstance, userAccessModalSrvc, data) {

    var IAccessContainer = {
        users: [],
        positions: [],
        positionUserAssignemts: [],
        groups: [],
        all: false
    };

    $scope.Data = {
        selectedgroup: data.accessContainer || IAccessContainer,
        mode: data.mode
    };

    $scope.Func = {
        onSave: function () {
            $modalInstance.close($scope.Data.selectedgroup);
        },
        onCancel: function () {
            $modalInstance.dismiss();
        }
    };

    $scope.Controller = {
        userTypeaheadApi: {
            getList: userAccessModalSrvc.getUserList
        },
        positionsTypeaheadApi: {
            getList: userAccessModalSrvc.getPositionList
        },
        positionUserAssignemtsTypeaheadApi: {
            getList: userAccessModalSrvc.getpositionUserAssignemtsList
        },
        groupsTypeaheadApi: {
            getList: userAccessModalSrvc.getGroupsList
        }
    };

    var onInit = function () {
        userAccessModalSrvc.setOrgUid($state.params.orgUid);
    };

    onInit();
});

angular.module('katebModule').factory('userAccessModalSrvc', function (Restangular) {
    var ORG = '';
    return {
        setOrgUid: function(orgUid){
            ORG = 'org/'+orgUid;
        },
        getUserList: function(_query){
            return Restangular.all(ORG+'/user/actives').getList({query: _query});
        },
        getPositionList: function(_query){
            return Restangular.all(ORG+'/position/actives').getList({query: _query});
        },
        getpositionUserAssignemtsList: function(_query){
            return Restangular.all(ORG+'/pua/actives').getList({query: _query});
        },
        getGroupsList: function(_query){
            return Restangular.all(ORG+'/public-group/actives').getList({query: _query});
        }
    }
});