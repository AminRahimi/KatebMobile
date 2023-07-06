angular.module('reportModule', []).config(['$stateProvider', function($stateProvider) {
	var ReportStatus = [
		{
			state: "home.report",
			config: {
				url: "/report",
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/report/report.html"
					}
				}
			}
		},
		{
			state: "home.report.incomingIssuedLetter",
			config: {
				url: "/incomingIssuedLetter",
				views: {
					'reportContainer@home.report': {
						templateUrl: "app/modules/report/incomingIssuedLetter/incomingIssuedLetter.html",
						controller: 'incomingIssuedLetterCtrl'
					}
				}
			}
		},
		{
			state: "home.report.letterSecretary",
			config: {
				url: "/letterSecretary",
				views: {
					'reportContainer@home.report': {
						templateUrl: "app/modules/report/letterSecretary/letterSecretary.html",
						controller: 'letterSecretaryCtrl'
					}
				}
			}
		},
		{
			state: "home.report.incomingIssuedUserLetter",
			config: {
				url: "/incomingIssuedUserLetter",
				views: {
					'reportContainer@home.report': {
						templateUrl: "app/modules/report/incomingIssuedLetterUser/incomingIssuedLetterUserReport.html",
						controller: 'incomingIssuedLetterUserReportCtrl'
					}
				}
			}
		},
		{
			state: "home.report.correspondenceUnit",
			config: {
				url: "/correspondenceUnit",
				views: {
					'reportContainer@home.report': {
						templateUrl: "app/modules/report/correspondenceUnit/correspondenceUnit.html",
						controller: 'correspondenceUnitCtrl'
					}
				}
			}
		},
        {
            state: "home.report.process",
            config: {
                url: "/process",
                views: {
                    'reportContainer@home.report': {
                        templateUrl: "app/modules/report/process/process.html",
                        controller: 'processReportCtrl'
                    }
                }
            }
		},
		{
            state: "home.report.reserveList",
            config: {
                url: "/reserveListReport",
                views: {
                    'reportContainer@home.report': {
                        templateUrl: "app/modules/report/reserveList/reserveList.html",
                        controller: 'reserveListReportCtrl'
                    }
                }
            }
        }
	];
	ReportStatus.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});

}]);
