angular.module('ManagementModule', ['userModule','userroleModule','organizationModule',
                                    'indicatorbookModule','positionModule','hameshhotkeyModule',
                                    'secretariatManagementModule','groupModule','publicsettingModule',
									'letterlayoutModule', 'systemFontModule','lettertemplateModule','loginSettingModule','tagModule',
									'externalorganizationModule', 'processManagementModule', 'departmentModule', 'allUserModule', 'letterFormTypeModule']);
angular.module('ManagementModule').config(['$stateProvider', function($stateProvider) {
	var ManagemenStates = [
		{
			state : "home.management",
			config : {
				url : "/management",
				views : {
					'mainContent@home' : {
						templateUrl : "app/modules/management/management.html",
						controller : 'managementCtrl',
					}
				},
				resolve : {}
			}
		}
	];
	ManagemenStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
}]);