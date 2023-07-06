angular.module('intelcartableModule', []).factory('intelcartableSrvc', function (Restangular) {
        var URL = '/filter/items/';
        return {
            saveIntelcartableFilter: function (intelCartable) {
                return Restangular.all('cartable_rule/items/').post(intelCartable);
            },
            deleteIntelcartableFilter: function (uid) {
                return Restangular.all('cartable_rule/items/'+uid).remove();
            },
            updateIntelcartableFilter: function (intelCartable,uid) {
                return Restangular.all('cartable_rule/items/' + uid).post(intelCartable);
            },
            getAllIntelcartableFilters: function () {
                return Restangular.all(URL).getList({len: -1, extend: 'brief'});
            },
            getIntelcartableFilter: function (uid) {
                return Restangular.one('cartable_rule/items/' + uid).get();
            },
            getIntelcartableFilterReferenceToList: function (orgId) {
                return Restangular.all('/org/' + orgId + '/pua/actives').getList();
            },
            getIntelcartablePuaList: function (positionUid) {
                return Restangular.all('/cartable_rule/pua/' + positionUid ).getList();
            },
            getIntelcartablesearch: function (orgId, query) {
                return Restangular.all('/org/' + orgId + '/position/actives?query='+query).getList();
            },
            deleteIntelcartable: function (uid) {
                return Restangular.one(URL + uid).remove();
            },
            getTagsList: function (searchableTag) {
            var param = {
                query: searchableTag
            }
            return Restangular.all('/tag/actives').getList(param);
        },

        }
    }
);