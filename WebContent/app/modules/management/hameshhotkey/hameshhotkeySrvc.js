angular.module('hameshhotkeyModule', []);
angular.module('hameshhotkeyModule').factory('hameshhotkeySrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFullhameshhotkeyList: function(startPage, pageLen){
			return Restangular.all(ORG+'/public_hamesh_hotkey/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendhameshhotkeyList: function(){
			return Restangular.all(ORG+'/public_hamesh_hotkey/items').getList({len:-1});
		},
		gethameshhotkeyList: function(){
			return Restangular.all(ORG+'/public_hamesh_hotkey/items').getList();
		},
		gethameshhotkey: function(uid){
			return Restangular.one(ORG+'/public_hamesh_hotkey/items/'+uid).get();
		},
		savehameshhotkey: function(data){
			return Restangular.all(ORG+'/public_hamesh_hotkey/items').post(data);
		},
		updatehameshhotkey: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/public_hamesh_hotkey/items/'+uid).post(data);
		},
		deletehameshhotkey: function(uid){
			return Restangular.one(ORG+'/public_hamesh_hotkey/items/'+uid).remove();
		},
		searchhameshhotkey: function(query, startPage, pageLen){
			return Restangular.all(ORG+'/public_hamesh_hotkey/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},
		
	}
	
}]);