angular.module('secretariatManagementModule', []);
angular.module('secretariatManagementModule').factory('secretariatManagementSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFullsecretariatList: function(startPage, pageLen){
			return Restangular.all(ORG+'/secretariat/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendsecretariatList: function(){
			return Restangular.all(ORG+'/secretariat/items').getList({len:-1});
		},
		getsecretariatList: function(){
			return Restangular.all(ORG+'/secretariat/items').getList();
		},
		getsecretariat: function(uid){
			return Restangular.one(ORG+'/secretariat/items/'+uid).get();
		},
		savesecretariat: function(data){
			return Restangular.all(ORG+'/secretariat/items').post(data);
		},
		updatesecretariat: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/secretariat/items/'+uid).post(data);
		},
		deletesecretariat: function(uid){
			return Restangular.one(ORG+'/secretariat/items/'+uid).remove();
		},
		searchsecretariat: function(query, startPage, pageLen){
			return Restangular.all(ORG+'/secretariat/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},
		
		getsecretaryPositionList: function(){
			return Restangular.all(ORG+'/position/items').getList({len:-1});
		},
		getindicatorList: function(){
			return Restangular.all(ORG+'/indicator_book/items').getList({len:-1});
		},
	}
	
}]);