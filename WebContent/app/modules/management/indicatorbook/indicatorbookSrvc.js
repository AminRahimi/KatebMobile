angular.module('indicatorbookModule', []);
angular.module('indicatorbookModule').factory('indicatorbookSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFullindicatorbookList: function(startPage, pageLen){
			return Restangular.all(ORG+'/indicator_book/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendindicatorbookList: function(){
			return Restangular.all(ORG+'/indicator_book/items').getList({len:-1});
		},
		getindicatorbookList: function(){
			return Restangular.all(ORG+'/indicator_book/items').getList();
		},
		getindicatorbook: function(uid){
			return Restangular.one(ORG+'/indicator_book/items/'+uid).get();
		},
		saveindicatorbook: function(data){
			return Restangular.all(ORG+'/indicator_book/items').post(data);
		},
		updateindicatorbook: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/indicator_book/items/'+uid).post(data);
		},
		deleteindicatorbook: function(uid){
			return Restangular.one(ORG+'/indicator_book/items/'+uid).remove();
		},
		searchindicatorbook: function(query, startPage, pageLen){
			return Restangular.all(ORG+'/indicator_book/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},
		
	}
	
}]);