angular.module('secretariatModule').config(['$stateProvider', function($stateProvider) {
	var secretariatStates = [
	    {
	    	state: "home.secretariat",
	    	config : {
				url : "/secretariat/",
				views: {
					'mainContent@home': {
						templateUrl: "app/modules/secretariat/secretariat.html",
						controller: 'secretariatCtrl'
					}
				},
				resolve:{
				sideMenu:
				/* @ngInject */  function (secretariatSrvc, $q) {
						var deferred = $q.defer();
						secretariatSrvc.getSideMenuSecretariat().then(function(response){
							secretariatSrvc.setFeatureList(response.data);
							deferred.resolve(response.data);
						});
						return deferred.promise;
					}
				}
			}
	    },{
			state: "home.secretariat.incomingList",
			config: {
				url: '/:secUid/incomingList',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/incoming/secretariatIncomingList.html",
						controller: 'secretariatIncomingListCtrl'
					}
				}
			}
		},{
			state: "home.secretariat.incoming",
			config: {
				url: '/:secUid/incoming/:incUid/:tmpUid',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/incoming/secretariatIncoming.html",
						controller: 'secretariatIncomingCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.issuedList",
			config: {
				url: '/:secUid/issuedList',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssuedList.html",
						controller: 'secretariatIssuedListCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.returnedLetters",
			config: {
				url: '/:secUid/returnedLetters',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/returnedLetters/returnedLettersList.html",
						controller: 'returnedLettersListCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.issued",
			config: {
				url: '/:secUid/issued/:incUid/:letterUid',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssued.html",
						controller: 'secretariatIssuedCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.issuedAdd",
			config: {
				url: '/:secUid/issued_add',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssuedAdd.html",
						controller: 'secretariatIssuedAddCtrl'
					}
				}
			}
		},
    {
			state: "home.secretariat.issuedLetterList",
			config: {
				url: '/:secUid/issuedLetterList',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/issuedLetter/secretariatIssuedLetterList.html",
						controller: 'secretariatIssuedLetterListCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.issuedLetter",
			config: {
				url: '/:secUid/issuedLetter/:incUid/:letterUid',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssued.html",
						controller: 'secretariatIssuedCtrl'
					}
				}
			}
		},
    {
			state: "home.secretariat.incommingLetterList",
			config: {
				url: '/:secUid/incommingLetterList',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/incommingLetter/secretariatIncommingLetterList.html",
						controller: 'secretariatIncommingLetterListCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.letterView",
			config: {
				url:  '/:secUid/letter/:letterUid/:letterType',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/letterView/letterView.html",
						controller: 'letterViewCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.unapprovedIncomming",
			config: {
				url: '/:secUid/unapprovedIncomming',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/unapprovedIncoming/secretariatUnapprovedIncomingList.html",
						controller: 'secretariatUnapprovedIncomingListCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.rejectedLetters",
			config: {
				url: '/:secUid/rejectedLetters',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/secretariat/rejectedLetters/rejectedLettersList.html",
						controller: 'rejectedLettersListCtrl'
					}
				}
			}
		},
		{
            state: "home.secretariat.rejected",
            config: {
                url: '/:secUid/rejected/:incUid/:tmpUid',
                views: {
                    'content@home.secretariat': {
                        templateUrl: "app/modules/secretariat/rejectedLetters/secretariatRejected.html",
                        controller: 'secretariatRejectedCtrl'
                    }
                }
            }
        },{
            state: "home.secretariat.reserve",
            config: {
                url: 'reserve/',
                views: {
                    'content@home.secretariat': {
                        templateUrl: "app/modules/secretariat/reserve/reserve.html",
                        controller: 'reserveCtrl'
                    }
                }
            }
        },{
            state: "home.secretariat.reserveList",
            config: {
                url: 'reserveList/',
                views: {
                    'content@home.secretariat': {
                        templateUrl: "app/modules/secretariat/reserveList/reserveList.html",
                        controller: 'reserveListCtrl'
                    }
                }
            }
        },
		{
			state: "home.secretariat.orgLetterList",
			config: {
				url: '/orgLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetterList.html",
						controller: 'cartableOrgLetterListCtrl'
					}
				}
			}
		},
		{
			state: "home.secretariat.orgLetter",
			config: {
				url: '/orgLetter/:letterUid?:filter',
				views: {
					'content@home.secretariat': {
						templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetter.html",
						controller: 'cartableOrgLetterCtrl'
					}
				}
			}
		},{
            state: "home.secretariat.followupCustomerLetter",
            config: {
                url: 'followupCustomerLetter/:secUid',
                views: {
                    'content@home.secretariat': {
                        templateUrl: "app/modules/secretariat/follow_up_customer_letter/follow_up_customer_letter.html",
                        controller: 'followupCustomerLetterCtrl'
                    }
                }
            }
        },
	];
	secretariatStates.forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});

}]);
