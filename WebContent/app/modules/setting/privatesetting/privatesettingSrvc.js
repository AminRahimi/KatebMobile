angular.module('privatesettingModule', []);
angular.module('privatesettingModule').factory('privatesettingSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getprivatesetting: function(uid){
			return Restangular.one('private_setting').get();
		},
		saveprivatesetting: function(data){
			return Restangular.all('private_setting').post(data);
		},
		
		getpositionUserAssignemtsList: function(){
			return Restangular.all(ORG+'/pua/actives').getList();
		}
	}
	
}]);