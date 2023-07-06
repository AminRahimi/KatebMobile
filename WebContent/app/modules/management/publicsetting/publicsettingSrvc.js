angular.module('publicsettingModule', []);
angular.module('publicsettingModule').factory('publicsettingSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getpublicsetting: function(){
			return Restangular.one(ORG+'/public_setting').get();
		},
		savepublicsetting: function(data){
			return Restangular.all(ORG+'/public_setting').post(data);
		},
		
		getinternalIndicatorBookList: function(){
			return Restangular.all(ORG+'/indicator_book/items').getList({len:-1});
		},
		getFontList: function () {
			return Restangular.all(ORG+'/font/items').getList();
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