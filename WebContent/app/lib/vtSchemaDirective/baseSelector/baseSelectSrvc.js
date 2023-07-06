angular.module('schemaForm').factory('baseSelectSrvc', [  'Restangular', '$q', function( restangularService, $q) {

	return {
		getBaseSelectorList : function() {
			return restangularService.all('enum_type/items').getList();
		},
		addBaseSelector : function(data){
			return restangularService.all('enum_type/items').post(data);
		},
		updateBaseSelector : function(data){
			var key = data.key;
			return restangularService.all('enum_type/items/'+key).post(data);
		},
		getBaseSelectorPagedList : function(pageNum, pageSize) {
			return restangularService.all('enum_type/items').getList({
				pageNum : pageNum,
				pageSize : pageSize,
				extent:'full'
			});
		},
		getBaseSelector : function(key) {
			return restangularService.one('enum_type/items/'+ key).get({extent:'full'});
		},
	};
} ]);