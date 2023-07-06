angular.module('privatehameshhotkeyModule', []);
angular.module('privatehameshhotkeyModule').factory('privatehameshhotkeySrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	return{
		getFullhameshhotkeyList: function(startPage, pageLen){
			return Restangular.all('private_hamesh_hotkey/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendhameshhotkeyList: function(){
			return Restangular.all('private_hamesh_hotkey/items').getList({len:-1});
		},
		gethameshhotkeyList: function(){
			return Restangular.all('private_hamesh_hotkey/items').getList();
		},
		gethameshhotkey: function(uid){
			return Restangular.one('private_hamesh_hotkey/items/'+uid).get();
		},
		savehameshhotkey: function(data){
			return Restangular.all('private_hamesh_hotkey/items').post(data);
		},
		updatehameshhotkey: function(data){
			var uid = data.uid;
			return Restangular.all('private_hamesh_hotkey/items/'+uid).post(data);
		},
		deletehameshhotkey: function(uid){
			return Restangular.one('private_hamesh_hotkey/items/'+uid).remove();
		},
		searchhameshhotkey: function(query, startPage, pageLen){
			return Restangular.all('private_hamesh_hotkey/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},
		
	}
	
}]);