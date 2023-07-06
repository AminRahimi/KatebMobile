angular.module('privatetagModule', []);
angular.module('privatetagModule').factory('privatetagSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	return{
		gettag: function(uid){
			if(!uid)uid = 'root';
			return Restangular.one('private_tag/items/'+uid).get();
		},
		gettagChildren: function(uid){
			if(!uid)uid = 'root';
			return Restangular.all('private_tag/items/children/'+uid).getList();
		},
		savetag: function(data){
			return Restangular.all('private_tag/items').post(data);
		},
		updatetag: function(data){
			var uid = data.uid;
			return Restangular.all('private_tag/items/'+uid).post(data);
		},
		updatetagParent: function(data){
			var uid = data.uid;
			return Restangular.all('private_tag/change_parent/'+uid).post(data);
		},
		deletetag: function(uid){
			return Restangular.one('private_tag/'+uid).remove();
		},
		changeParent: function(data){
			return Restangular.all('private_tag/items/move').post(data);
		},
		//////////
		// Tree //
		//////////
		getChildren : function(uid) {
			return Restangular.one('private_tag/items/children', uid).get({
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
			return Restangular.all('private_tag/items/search').customPOST(query, '', {
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

			return Restangular.one('private_tag/items/full_tree?' + queryParams).get({showDeleted:showDeleted});
		},
		//////////////
		// END-Tree //
		//////////////
	}
	
}]);