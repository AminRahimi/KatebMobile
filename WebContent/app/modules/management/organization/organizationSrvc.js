angular.module('organizationModule', []);
angular.module('organizationModule').factory('organizationSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	return{
		getorganization: function(uid){
			if(!uid)uid = 'root';
			return Restangular.one('organization/items/'+uid).get();
		},
		getorganizationChildren: function(uid){
			if(!uid)uid = 'root';
			return Restangular.all('organization/items/children/'+uid).getList();
		},
		saveorganization: function(data){
			return Restangular.all('organization/items').post(data);
		},
		updateorganization: function(data){
			var uid = data.uid;
			return Restangular.all('organization/items/'+uid).post(data);
		},
		updateorganizationParent: function(data){
			var uid = data.uid;
			return Restangular.all('organization/change_parent/'+uid).post(data);
		},
		deleteorganization: function(uid){
			return Restangular.one('organization/items/'+uid).remove();
		},
		changeParent: function(data){
			return Restangular.all('organization/items/move').post(data);
		},
		//////////
		// Tree //
		//////////
		getChildren : function(uid) {
			return Restangular.one('organization/items/children', uid).get({
				extent: "full"
			}).then(function (response) {
				return response = {
					data: {
						children: response.data
					}
				}
			});
		},
        searchOnTree : function(query, start, len) {
            return Restangular.all('organization/items/search').customPOST(query, '', {
                start : start,
                len : len,
                extent : 'full'
            }, {
                'X-HTTP-Method-Override' : 'GET'
            }).then(function(response) {
                var totalSize = response.data.totalSize;
                var items;
                var data = response.data;
                data.totalSize = totalSize;
                return {
                    data : data
                }
            });
        },
        getFullTree : function(isWithStats, uid,showDeleted) {
            var queryParams = isWithStats ? "withStats=" + isWithStats + "&" : "";
            queryParams += uid ? "rootUid=" + uid : "";

            return Restangular.one('position/items/full_tree?' + queryParams).get({showDeleted:showDeleted});
        },
		//////////////
		// END-Tree //
		//////////////
	}

}]);