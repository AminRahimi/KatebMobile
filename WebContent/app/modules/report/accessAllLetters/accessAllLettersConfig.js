angular.module('accessAllLettersModule', []).config(['$stateProvider', function ($stateProvider) {
    var ReportStatus = [
        {
			state: "home.report.accessAllLetters",
			config: {
				url: "/accessAllLetters",
				views: {
					'reportContainer@home.report': {
						templateUrl: "app/modules/report/accessAllLetters/accessAllLetters.html",
						controller: 'accessAllLettersCtrl'
					}
				}
			}
		},
		{
			state: "home.report.accessAllLettersForOrgUsers",
			config: {
				url: "/accessAllLettersForOrgUsers",
				views: {
					'reportContainer@home.report': {
						templateUrl: "app/modules/report/accessAllLetters/accessAllLettersForOrgUsers/accessAllLettersForOrgUsers.html",
						controller: 'accessAllLettersForOrgUsersCtrl'
					}
				}
			}
		},
    ]
    ReportStatus.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
    }]);