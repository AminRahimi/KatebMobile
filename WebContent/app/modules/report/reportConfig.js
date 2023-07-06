angular.module('reportModule', []).config(['$stateProvider', function($stateProvider) {
	var ReportStatus = [
		{
			state: "base.home.report",
			config: {
				url: "/report",
				views: {
					'mainContent@base.home': {
						templateUrl: "app/modules/report/report.html"
					}
				}
			}
		},
		{
			state: "base.mobileHome.report",
			config: {
				url: "/report",
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/report/report.html"
					}
				}
			}
		},




		{
			state: "base.home.report.incomingIssuedLetter",
			config: {
				url: "/incomingIssuedLetter",
				views: {
					'reportContainer@base.home.report': {
						templateUrl: "app/modules/report/incomingIssuedLetter/incomingIssuedLetter.html",
						controller: 'incomingIssuedLetterCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.report.incomingIssuedLetter",
			config: {
				url: "/incomingIssuedLetter",
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/report/incomingIssuedLetter/incomingIssuedLetter.html",
						controller: 'incomingIssuedLetterCtrl'
					}
				}
			}
		},






		{
			state: "base.home.report.letterSecretary",
			config: {
				url: "/letterSecretary",
				views: {
					'reportContainer@base.home.report': {
						templateUrl: "app/modules/report/letterSecretary/letterSecretary.html",
						controller: 'letterSecretaryCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.report.letterSecretary",
			config: {
				url: "/letterSecretary",
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/report/letterSecretary/letterSecretary.html",
						controller: 'letterSecretaryCtrl'
					}
				}
			}
		},








		{
			state: "base.home.report.incomingIssuedUserLetter",
			config: {
				url: "/incomingIssuedUserLetter",
				views: {
					'reportContainer@base.home.report': {
						templateUrl: "app/modules/report/incomingIssuedLetterUser/incomingIssuedLetterUserReport.html",
						controller: 'incomingIssuedLetterUserReportCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.report.incomingIssuedUserLetter",
			config: {
				url: "/incomingIssuedUserLetter",
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/report/incomingIssuedLetterUser/incomingIssuedLetterUserReport.html",
						controller: 'incomingIssuedLetterUserReportCtrl'
					}
				}
			}
		},







		{
			state: "base.home.report.correspondenceUnit",
			config: {
				url: "/correspondenceUnit",
				views: {
					'reportContainer@base.home.report': {
						templateUrl: "app/modules/report/correspondenceUnit/correspondenceUnit.html",
						controller: 'correspondenceUnitCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.report.correspondenceUnit",
			config: {
				url: "/correspondenceUnit",
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/report/correspondenceUnit/correspondenceUnit.html",
						controller: 'correspondenceUnitCtrl'
					}
				}
			}
		},










        {
            state: "base.home.report.process",
            config: {
                url: "/process",
                views: {
                    'reportContainer@base.home.report': {
                        templateUrl: "app/modules/report/process/process.html",
                        controller: 'processReportCtrl'
                    }
                }
            }
		},
		{
			state: "base.mobileHome.report.process",
			config: {
				url: "/process",
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/report/process/process.html",
						controller: 'processReportCtrl'
					}
				}
			}
		},





		{
            state: "base.home.report.reserveList",
            config: {
                url: "/reserveListReport",
                views: {
                    'reportContainer@base.home.report': {
                        templateUrl: "app/modules/report/reserveList/reserveList.html",
                        controller: 'reserveListReportCtrl'
                    }
                }
            }
        },
		{
			state: "base.mobileHome.report.reserveList",
			config: {
				url: "/reserveListReport",
				views: {
					'mainContent@base.mobileHome': {
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
