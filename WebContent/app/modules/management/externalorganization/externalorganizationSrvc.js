angular.module('externalorganizationModule', []);
angular.module('externalorganizationModule').factory('externalorganizationSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';
	
	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getexternalorganization: function(uid){
			if(!uid)uid = 'root';
			return Restangular.one(ORG+'/external_organization/items/'+uid).get();
		},
		getexternalorganizationChildren: function(uid){
			if(!uid)uid = 'root';
			return Restangular.all(ORG+'/external_organization/items/children/'+uid).getList();
		},
		saveexternalorganization: function(data){
			return Restangular.all(ORG+'/external_organization/items').post(data);
		},
		updateexternalorganization: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/external_organization/items/'+uid).post(data);
		},
		updateexternalorganizationParent: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/external_organization/change_parent/'+uid).post(data);
		},
		deleteexternalorganization: function(uid){
			return Restangular.one(ORG+'/external_organization/items/'+uid).remove();
		},
		changeParent: function(data){
			return Restangular.all(ORG+'/external_organization/items/move').post(data);
		},
		//////////
		// Tree //
		//////////
		getChildren : function(uid) {
			return Restangular.one(ORG+'/external_organization/items/children', uid).get({
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
			return Restangular.all(ORG+'/external_organization/items/search').customPOST(query, '', {
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
		searchOnTable : function(query, start, len) {
			return Restangular.all(ORG+'/external_organization_member/items').customPOST(query, '', {
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

			return Restangular.one(ORG+'/external_organization/items/full_tree?' + queryParams).get({showDeleted:showDeleted});
		},
		//////////////
		// END-Tree //
		//////////////
	}
	
}]);