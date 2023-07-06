angular.module('letterFormTypeModule').config(['$stateProvider', function($stateProvider) {
	var States = [
		{
			state: "home.management.letterFormType",
			config: {
				url: '/:orgUid/letter-form-type/',
				views: {
					'content@home.management': {
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
