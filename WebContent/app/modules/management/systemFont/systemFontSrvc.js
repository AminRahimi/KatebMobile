angular.module('systemFontModule', []);
angular.module('systemFontModule').factory('systemFontSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getsystemFont: function(){
			return Restangular.one(ORG+'/public_setting').get();
		},
		savesystemFont: function(data){
			return Restangular.all(ORG+'/font/items').post(data);
		},
		editSystemFont: function (data, uid) {
			console.log(data)
			return Restangular.all(ORG+'/font/items/'+uid).post(data);
		},
		getFontList: function () {
			return Restangular.all(ORG+'/font/items').getList({extent:"full"});
		},
		deleteFont: function(uid){
			return Restangular.one(ORG+'/font/items/'+uid).remove();
		},
		getFontItem: function(uid) {
			return Restangular.one(ORG+'/font/items/'+uid).get();
		},
		addNewFont: function () {
			return Restangular.all(ORG+'/font/items').post(data);
		},
		getSecretariatList : function () {
			return Restangular.all(ORG+"/secretariat/items").getList({extend:'brief', len:-1}).then(function (res) {
				res.data = Restangular.stripRestangular(res.data);
				return res;
			});
		}
	}
	
}]);