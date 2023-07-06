angular.module('privategroupModule', []);
angular.module('privategroupModule').factory('privategroupSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFullgroupList: function(startPage, pageLen){
			return Restangular.all('private_group/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendgroupList: function(){
			return Restangular.all('private_group/items').getList({len:-1});
		},
		getgroupList: function(){
			return Restangular.all('private_group/items').getList();
		},
		getgroup: function(uid){
			return Restangular.one('private_group/items/'+uid).get();
		},
		savegroup: function(data){
			return Restangular.all('private_group').post(data);
		},
		updategroup: function(data){
			var uid = data.uid;
			return Restangular.all('private_group/items/'+uid).post(data);
		},
		deletegroup: function(uid){
			return Restangular.one('private_group/items/'+uid).remove();
		},
		searchgroup: function(query, startPage, pageLen){
			return Restangular.all('private_group/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},

		getUserList: function(_query){
			return Restangular.all(ORG+'/user/actives').getList({query: _query});
		},
		getPositionList: function(_query){
			return Restangular.all(ORG+'/position/actives').getList({query: _query});
		},
		getpositionUserAssignemtsList: function(_query){
			return Restangular.all(ORG+'/pua/actives').getList({query: _query});
		}
		
	}
	
}]);