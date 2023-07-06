angular.module('loginSettingModule', []);
angular.module('loginSettingModule').factory('loginSettingSrvc', [ 'Restangular',
	function(Restangular) {

		return {
			getBgPhotoList: function () {
				return Restangular.all('/wallpaper/items?extent=full&len=-1').getList();
			},
			getActiveBgPhoto: function () {
				return Restangular.one('/wallpaper/active').get();
			},
			activateBgPhoto: function (uid) {
				return Restangular.all('/wallpaper/active_wallpaper/'+ uid).post();
			},
			addBgPhoto: function (hash ) {
				return Restangular.all('/wallpaper/items').post({hash:hash });
			},
			deleteBgPhoto: function (uid) {
				return Restangular.all('/wallpaper/items/'+uid).remove();
			},
		
	}
	
}]);
