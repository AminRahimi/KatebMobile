angular.module('processManagementModule').factory('processManagementSrvc', ['Restangular', function (Restangular) {
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
        getProcessItemsList: function (startPage, pageLen) {
            return Restangular.all(ORG + '/process_model/items').getList({start: startPage, len: pageLen, extent: 'full'});
        },
        getProcessItem: function (uid) {
            return Restangular.one(ORG + '/process_model/items/' + uid).get();
        },
        getAccessGroups: function () {
            return Restangular.all(ORG + '/public_group/items/').getList({len: -1, extend: 'brief'})
                .then(stripRestangular);
        },
        getIndicators: function () {
            return Restangular.all(ORG + '/indicator_book/items').getList({len: -1, extend: 'brief'})
                .then(stripRestangular);
        },
        saveProcess: function (process) {
            return Restangular.all(ORG + '/process_model/items/').post(stripRestangular(process));
        },
        updateProcess: function (process) {
            return Restangular.all(ORG + '/process_model/items/' + process.uid).post(stripRestangular(process));
        },
        searchProcess: function (query, startPage, pageLen) {
            return Restangular.all(ORG + '/process_model/items/').customPOST(query, '',
                {start: startPage, len: pageLen, extent: 'full'}, {'X-HTTP-Method-Override': 'GET'});
        },
        removeProcess: function (uid) {
            return Restangular.one(ORG + '/process_model/items/' + uid).remove();
        },
        deployProcess: function (uid) {
            return Restangular.all('vira_bpms/process/deploy/'+uid).post();
        }
    }
}]);