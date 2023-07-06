angular.module('multiselectReciever', []);
angular.module('multiselectReciever').factory('multiselectRecieverSrvc', function(Restangular) {

	return {
		getGroupMember: function(uid) {
			return Restangular.one('group/items/' + uid).get();
		}
	}

});