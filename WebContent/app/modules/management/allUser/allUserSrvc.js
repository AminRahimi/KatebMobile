angular.module('allUserModule', []);
angular.module('allUserModule').factory('allUserSrvc', function (Restangular, $q) {

    return {
        getFullallUserList: function (startPage, pageLen) {
            return Restangular.all('global_user/items').getList(
                {start: startPage, len: pageLen, extent: "full"});
        },
        getallUser: function (uid) {
            return Restangular.one('global_user/items/' + uid).get();
        },
        saveallUser: function (data) {
            return Restangular.all('global_user/items').post(data);
        },
        updateallUser: function (data) {
            var uid = data.uid;
            delete data.allUsername;
            return Restangular.all('global_user/items/' + uid).post(data);
        },
        deleteallUser: function (uid) {
            return Restangular.one('global_user/items/' + uid).remove();
        },
        searchallUser: function (query, start, len) {
            return Restangular.all('global_user/items').customPOST(query, '',
                {start: start, len: len, extent: 'full'}, {'X-HTTP-Method-Override': 'GET'});
        },
        updateallUserAuthentication: function (allUserUid, data) {
            return Restangular.all('user_setting/items/' + allUserUid).post(data);
        },
        getallUserAuthentication: function (allUserUid) {
            return Restangular.one('user_setting/items/' + allUserUid).get();
        },
        getAllUserPass: function (allUserUid) {
            return Restangular.one('user/auth/' + allUserUid).get();
        },
        getOrganizationList: function () {
            return Restangular.all('organization/items').getList({len: -1});
        }
    }

});