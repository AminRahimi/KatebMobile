angular.module('letterFormTypeModule').config(['$stateProvider', function($stateProvider) {
	var States = [
		{
			state: "base.home.management.letterFormType",
			config: {
				url: '/:orgUid/letter-form-type/',
				views: {
					'content@base.home.management': {
						templateUrl: "app/modules/management/letterFormType/letterFormType.html",
						controller: 'letterFormTypeCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.management.letterFormType",
			config: {
				url: '/:orgUid/letter-form-type/',
				views: {
					'mainContent@base.mobileHome' : {
						templateUrl: "app/modules/management/letterFormType/letterFormType.html",
						controller: 'letterFormTypeCtrl'
					}
				}
			}
		}
	];
	States.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);
