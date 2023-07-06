angular.module('departmentModule', []).factory('departmentSrvc', ['Restangular',
    function (Restangular) {
        var ORG;
        var stripRestangular = function (data) {
            if (data.data) {
                return Restangular.stripRestangular(data.data);
            }
            return Restangular.stripRestangular(data);
        };
        return {
            setOrgUid: function (orgUid) {
                ORG = '/org/' + orgUid;
            },
            getDepartmentsList: function (startPage, pageLen) {
                return Restangular.all(ORG + '/department/items').getList({start:startPage, len:pageLen, extent:"full"});
            },
            getDepartment: function (uid) {
                return Restangular.one(ORG + '/department/items/' + uid).get();
            },
            saveDepartment: function (data) {
                return Restangular.all(ORG + '/department/items').post(data);
            },
            updateDepartment: function (data) {
                return Restangular.all(ORG + '/department/items/' + data.uid).post(stripRestangular(data));
            },
            deleteDepartment: function (uid) {
                return Restangular.one(ORG + '/department/items/' + uid).remove();
            },
            getDepartmentRoots: function () {
                return Restangular.one(ORG + '/position/items/').get({len: -1, extend: 'brief'})
            },
            searchDepartment: function (query, startPage, pageLen) {
                return Restangular.all(ORG + '/department/items/').customPOST(query, '',
                    {start: startPage, len: pageLen, extent: 'full'}, {'X-HTTP-Method-Override': 'GET'});
            }
        }

    }]);