angular.module('positionModule', []);
angular.module('positionModule').factory('positionSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';
	
	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getposition: function(uid){
			if(!uid)uid = 'root';
			return Restangular.one(ORG+'/position/items/'+uid).get();
		},
		getpositionChildren: function(uid){
			if(!uid)uid = 'root';
			return Restangular.all(ORG+'/position/items/children/'+uid).getList();
		},
		saveposition: function(data){
			return Restangular.all(ORG+'/position/items').post(data);
		},
		updateposition: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/position/items/'+uid).post(data);
		},
		deleteposition: function(uid){
			return Restangular.one(ORG+'/position/items/'+uid).remove();
		},
		changeParent: function(data){
			return Restangular.all(ORG+'/position/items/move').post(data);
		},

		getuserList: function(){
			return Restangular.all(ORG+'/user/items').getList({len:-1});
		},
		getCurrentUser: function (qeury) {
			return Restangular.all(ORG + '/user/actives?query=' + qeury).getList({len:-1});
		},
		searchOnTree : function(query, start, len) {
			return Restangular.all(ORG + '/position/items/search').customPOST(query, '', {
				start : start,
				len : len,
				extent : 'full'
			}, {
				'X-HTTP-Method-Override' : 'GET'
			}).then(function(response) {
				var totalSize = response.data.totalSize;
				var items;
				// items = _.map(response.data,function (resultGeoRegion) {
				// 	if (resultGeoRegion.children) {
				// 		return resultGeoRegion.children[0]
				// 	}
				// });
				var data = response.data;
				data.totalSize = totalSize;
				return {
					data : data
				}
			});
		},
		getChildren : function(uid) {
			return Restangular.one(ORG + '/position/items/children', uid).get({
				extent: "full"
			}).then(function (response) {
				return response = {
					data: {
						children: response.data
					}
				}
				// return response;
			});
		},
		getTopicTree : function(topicId,showDeleted) {
			return Restangular.one('position', topicId).get({showDeleted:showDeleted  }).then(function(response) {
//				if (!!!topicId) {
				response.data.isRoot = true;
//				}
				return response;
			});
		},
		getFullTree : function(isWithStats, uid,showDeleted) {
			var queryParams = isWithStats ? "withStats=" + isWithStats + "&" : "";
			queryParams += uid ? "rootUid=" + uid : "";

			return Restangular.one('position/items/full_tree?' + queryParams).get({showDeleted:showDeleted});
		},
		getTopicTreeChilds : function(topicId,showDeleted) {
			return Restangular.one('position', topicId).get({showDeleted:showDeleted});
		},
		setNewParentForNode : function(topicId, topicName, newParentId) {
			return Restangular.all('position/items/' + topicId).post("", {
				parentTopic : newParentId,
				name : topicName
			});
		},
	}
	
}]);