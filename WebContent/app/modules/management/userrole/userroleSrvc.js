angular.module('userroleModule', []);
angular.module('userroleModule').factory('userroleSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	return{
		getFulluserroleList: function(startPage, pageLen){
			return Restangular.all('role/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtenduserroleList: function(){
			return Restangular.all('role/items').getList({len:-1});
		},
		getuserroleList: function(){
			return Restangular.all('role/items').getList();
		},
		getuserrole: function(uid){
			return Restangular.one('role/items/'+uid).get();
		},
		saveuserrole: function(data){
			return Restangular.all('role/items').post(data);
		},
		updateuserrole: function(data){
			var uid = data.uid;
			return Restangular.all('role/items/'+uid).post(data);
		},
		deleteuserrole: function(uid){
			return Restangular.one('role/items/'+uid).remove();
		},
		searchuserrole: function(query, start, len){
			return Restangular.all('role/items').customPOST(query,'',
					{start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},
		
		getExtendfeatureList: function(){
			return Restangular.all('role/features').getList({len:-1});
		}
		
	}
	
}]);