angular.module('secretariatModule').config(['$stateProvider', function($stateProvider) {
	var secretariatStates = [
	    {
	    	state: "base.home.secretariat",
	    	config : {
				url : "/secretariat/",
				views: {
					'mainContent@base.home': {
						templateUrl: "app/modules/secretariat/secretariat.html",
						controller: 'secretariatCtrl'
					}
				},
				// resolve:{
				// sideMenu:
				// /* @ngInject */  function (homeSrvc) {
				// 		return homeSrvc.generateSecretariatMenu();
				// 	}
				// }
			}
	    },

		{
			state: "base.mobileHome.secretariat",
			config : {
				url : "/secretariat/",
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/secretariat.html",
						controller: 'secretariatCtrl'
					}
				},
				// resolve:{
				// sideMenu:
				// /* @ngInject */  function (homeSrvc) {
				// 		return homeSrvc.generateSecretariatMenu();
				// 	}
				// }
			}
		},




		{
			state: "base.home.secretariat.incomingList",
			config: {
				url: '/:secUid/incoming-list',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/incoming/secretariatIncomingList.html",
						controller: 'secretariatIncomingListCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.incomingList",
			config: {
				url: '/:secUid/incoming-list',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/incoming/secretariatIncomingList.html",
						controller: 'secretariatIncomingListCtrl'
					}
				}
			}
		},




		{
			state: "base.home.secretariat.incoming",
			config: {
				url: '/:secUid/incoming/:incUid/:tmpUid',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/incoming/secretariatIncoming.html",
						controller: 'secretariatIncomingCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.incoming",
			config: {
				url: '/:secUid/incoming/:incUid/:tmpUid',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/incoming/secretariatIncoming.html",
						controller: 'secretariatIncomingCtrl'
					}
				}
			}
		},






		{
			state: "base.home.secretariat.issuedList",
			config: {
				url: '/:secUid/issuedList',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssuedList.html",
						controller: 'secretariatIssuedListCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.issuedList",
			config: {
				url: '/:secUid/issuedList',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssuedList.html",
						controller: 'secretariatIssuedListCtrl'
					}
				}
			}
		},















		{
			state: "base.home.secretariat.returnedLetters",
			config: {
				url: '/:secUid/returnedLetters',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/returnedLetters/returnedLettersList.html",
						controller: 'returnedLettersListCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.returnedLetters",
			config: {
				url: '/:secUid/returnedLetters',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/returnedLetters/returnedLettersList.html",
						controller: 'returnedLettersListCtrl'
					}
				}
			}
		},















		{
			state: "base.home.secretariat.issued",
			config: {
				url: '/:secUid/issued/:incUid/:letterUid',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssued.html",
						controller: 'secretariatIssuedCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.issued",
			config: {
				url: '/:secUid/issued/:incUid/:letterUid',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssued.html",
						controller: 'secretariatIssuedCtrl'
					}
				}
			}
		},











		{
			state: "base.home.secretariat.issuedAdd",
			config: {
				url: '/:secUid/issued_add',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssuedAdd.html",
						controller: 'secretariatIssuedAddCtrl'
					}
				}
			}
		},

		{
			state: "base.mobileHome.secretariat.issuedAdd",
			config: {
				url: '/:secUid/issued_add',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssuedAdd.html",
						controller: 'secretariatIssuedAddCtrl'
					}
				}
			}
		},






   		 {
			state: "base.home.secretariat.issuedLetterList",
			config: {
				url: '/:secUid/issuedLetterList',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/issuedLetter/secretariatIssuedLetterList.html",
						controller: 'secretariatIssuedLetterListCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.issuedLetterList",
			config: {
				url: '/:secUid/issuedLetterList',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/issuedLetter/secretariatIssuedLetterList.html",
						controller: 'secretariatIssuedLetterListCtrl'
					}
				}
			}
		},













		{
			state: "base.home.secretariat.issuedLetter",
			config: {
				url: '/:secUid/issuedLetter/:incUid/:letterUid',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssued.html",
						controller: 'secretariatIssuedCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.issuedLetter",
			config: {
				url: '/:secUid/issuedLetter/:incUid/:letterUid',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/issued/secretariatIssued.html",
						controller: 'secretariatIssuedCtrl'
					}
				}
			}
		},













    	{
			state: "base.home.secretariat.incommingLetterList",
			config: {
				url: '/:secUid/incommingLetterList',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/incommingLetter/secretariatIncommingLetterList.html",
						controller: 'secretariatIncommingLetterListCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.incommingLetterList",
			config: {
				url: '/:secUid/incommingLetterList',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/incommingLetter/secretariatIncommingLetterList.html",
						controller: 'secretariatIncommingLetterListCtrl'
					}
				}
			}
		},











		{
			state: "base.home.secretariat.letterView",
			config: {
				url:  '/:secUid/letter/:letterUid/:letterType',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/letterView/letterView.html",
						controller: 'letterViewCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.letterView",
			config: {
				url:  '/:secUid/letter/:letterUid/:letterType',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/letterView/letterView.html",
						controller: 'letterViewCtrl'
					}
				}
			}
		},










		{
			state: "base.home.secretariat.unapprovedIncomming",
			config: {
				url: '/:secUid/unapprovedIncomming',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/unapprovedIncoming/secretariatUnapprovedIncomingList.html",
						controller: 'secretariatUnapprovedIncomingListCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.unapprovedIncomming",
			config: {
				url: '/:secUid/unapprovedIncomming',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/unapprovedIncoming/secretariatUnapprovedIncomingList.html",
						controller: 'secretariatUnapprovedIncomingListCtrl'
					}
				}
			}
		},









		{
			state: "base.home.secretariat.rejectedLetters",
			config: {
				url: '/:secUid/rejectedLetters',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/secretariat/rejectedLetters/rejectedLettersList.html",
						controller: 'rejectedLettersListCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.rejectedLetters",
			config: {
				url: '/:secUid/rejectedLetters',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/rejectedLetters/rejectedLettersList.html",
						controller: 'rejectedLettersListCtrl'
					}
				}
			}
		},







		{
            state: "base.home.secretariat.rejected",
            config: {
                url: '/:secUid/rejected/:incUid/:tmpUid',
                views: {
                    'content@base.home.secretariat': {
                        templateUrl: "app/modules/secretariat/rejectedLetters/secretariatRejected.html",
                        controller: 'secretariatRejectedCtrl'
                    }
                }
            }
        },
		{
			state: "base.mobileHome.secretariat.rejected",
			config: {
				url: '/:secUid/rejected/:incUid/:tmpUid',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/rejectedLetters/secretariatRejected.html",
						controller: 'secretariatRejectedCtrl'
					}
				}
			}
		},







		{
            state: "base.home.secretariat.reserve",
            config: {
                url: 'reserve/',
                views: {
                    'content@base.home.secretariat': {
                        templateUrl: "app/modules/secretariat/reserve/reserve.html",
                        controller: 'reserveCtrl'
                    }
                }
            }
        },
		{
			state: "base.mobileHome.secretariat.reserve",
			config: {
				url: 'reserve/',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/reserve/reserve.html",
						controller: 'reserveCtrl'
					}
				}
			}
		},



		{
            state: "base.home.secretariat.reserveList",
            config: {
                url: 'reserveList/',
                views: {
                    'content@base.home.secretariat': {
                        templateUrl: "app/modules/secretariat/reserveList/reserveList.html",
                        controller: 'reserveListCtrl'
                    }
                }
            }
        },
		{
			state: "base.mobileHome.secretariat.reserveList",
			config: {
				url: 'reserveList/',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/secretariat/reserveList/reserveList.html",
						controller: 'reserveListCtrl'
					}
				}
			}
		},




		{
			state: "base.home.secretariat.orgLetterList",
			config: {
				url: '/orgLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetterList.html",
						controller: 'cartableOrgLetterListCtrl'
					}
				}
			}
		},
		{
			state: "base.mobileHome.secretariat.orgLetterList",
			config: {
				url: '/orgLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetterList.html",
						controller: 'cartableOrgLetterListCtrl'
					}
				}
			}
		},





		{
			state: "base.home.secretariat.orgLetter",
			config: {
				url: '/orgLetter/:letterUid?:filter',
				views: {
					'content@base.home.secretariat': {
						templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetter.html",
						controller: 'cartableOrgLetterCtrl'
					}
				}
			}
		},

		{
			state: "base.mobileHome.secretariat.orgLetter",
			config: {
				url: '/orgLetter/:letterUid',
				views: {
					'mainContent@base.mobileHome': {
						templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetter.html",
						controller: 'cartableOrgLetterCtrl'
					}
				}
			}
		},



		{
            state: "base.home.secretariat.followupCustomerLetter",
            config: {
                url: 'followupCustomerLetter/:secUid',
                views: {
                    'content@base.home.secretariat': {
                        templateUrl: "app/modules/secretariat/follow_up_customer_letter/follow_up_customer_letter.html",
                        controller: 'followupCustomerLetterCtrl'
                    }
                }
            }
        },
		{
			state: "base.mobileHome.secretariat.followupCustomerLetter",
			config: {
				url: 'followupCustomerLetter/:secUid',
				views: {
					'mainContent@base.mobileHome': {
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
