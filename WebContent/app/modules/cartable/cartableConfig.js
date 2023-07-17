angular.module('cartableModule', []);
angular.module('cartableModule').config(['$stateProvider', function ($stateProvider) {
    var cartableStates = [

        {
            state: "base.home.cartable",
            config: {
                url: '/cartable',
                views: {
                    'mainContent@base.home': {
                        templateUrl: "app/modules/cartable/cartable.html",
                        controller: 'cartableCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.cartable",
            config: {
                url: '/cartable',
                
            }
        },



        {
            state: "base.home.cartable.cartableList",
            config: {
                url: '/taskList?:cartableUid?:filter',
                views: {
                    'cartableContainer@base.home.cartable': {
                        templateUrl: "app/modules/cartable/taskList/cartableTaskList.html?v=2",
                        controller: "cartableTaskListCtrl"
                    }
                }
            }
        },
        {
            state: "base.home.cartable.cartableList.filter",
            config: {
                url: '?page',
            }
        },
        {
            state: "base.mobileHome.cartable.cartableList",
            config: {
                url: '/taskList?:cartableUid?:filter',
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/cartable/taskList/cartableTaskList.html?v=2",
                        controller: "cartableTaskListCtrl"
                    }
                }
            }
        },
        {
            state: "base.mobileHome.cartable.cartableList.filter",
            config: {
                url: '?page',
            }
        },








        {
            state: "base.home.cartable.draft",
            config: {
                url: '/draft/:draftUid/:replyFromUid/:duplicateUid/:orgUid?:cartableUid?:filter',
                params: {
                    draftUid: { squash: true, value: null },
                    replyFromUid: { squash: true, value: null },
                    duplicateUid: { squash: true, value: null },
                    orgUid: { squash: true, value: null }
                },
                views: {
                    'cartableContainer@base.home.cartable': {
                        templateUrl: "app/modules/cartable/draft/cartableDraft.html?v=3",
                        controller: 'cartableDraftCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.cartable.draft",
            config: {
                url: '/draft/:draftUid/:replyFromUid/:duplicateUid/:orgUid?:cartableUid?:filter',
                params: {
                    draftUid: { squash: true, value: null },
                    replyFromUid: { squash: true, value: null },
                    duplicateUid: { squash: true, value: null },
                    orgUid: { squash: true, value: null }
                },
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/cartable/draft/cartableDraft.html?v=3",
                        controller: 'cartableDraftCtrl'
                    }
                }
            }
        },








        {
            state: "base.home.cartable.letter",
            config: {
                url: '/letter/:letterUid?:userArchiveUid?:cartableType?:cartableUid?:filter',
                views: {
                    'cartableContainer@base.home.cartable': {
                        templateUrl: "app/modules/cartable/letter/cartableLetter.html",
                        controller: 'cartableLetterCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.cartable.letter",
            config: {
                url: '/letter/:letterUid?:userArchiveUid?:cartableType?:cartableUid?:filter',
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/cartable/letter/cartableLetter.html",
                        controller: 'cartableLetterCtrl'
                    }
                }
            }
        },








        {
            state: "base.home.cartable.orgLetterList",
            config: {
                url: '/orgLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
                params: {
                    subject: { squash: true, value: null },
                    letterNumber: { squash: true, value: null },
                    sender: { squash: true, value: null },
                    pagination: { squash: true, value: null },
                    externalNumber: { squash: true, value: null }
                },
                views: {
                    'cartableContainer@base.home.cartable': {
                        templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetterList.html",
                        controller: 'cartableOrgLetterListCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.cartable.orgLetterList",
            config: {
                url: '/orgLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
                params: {
                    subject: { squash: true, value: null },
                    letterNumber: { squash: true, value: null },
                    sender: { squash: true, value: null },
                    pagination: { squash: true, value: null },
                    externalNumber: { squash: true, value: null }
                },
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetterList.html",
                        controller: 'cartableOrgLetterListCtrl'
                    }
                }
            }
        },













        {
            state: "base.home.cartable.orgLetter",
            config: {
                url: '/orgLetter/:letterUid?:filter',
                views: {
                    'cartableContainer@base.home.cartable': {
                        templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetter.html",
                        controller: 'cartableOrgLetterCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.cartable.orgLetter",
            config: {
                url: '/orgLetter/:letterUid?:filter',
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetter.html",
                        controller: 'cartableOrgLetterCtrl'
                    }
                }
            }
        },









        {
            state: "base.home.cartable.archiveLetterList",
            config: {
                url: '/archiveLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
                params: {
                    subject: { squash: true, value: null },
                    letterNumber: { squash: true, value: null },
                    sender: { squash: true, value: null },
                    pagination: { squash: true, value: null },
                    externalNumber: { squash: true, value: null }
                },
                views: {
                    'cartableContainer@base.home.cartable': {
                        templateUrl: "app/modules/cartable/archiveLetter/archiveLetterList.html",
                        controller: 'archiveLetterListCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.cartable.archiveLetterList",
            config: {
                url: '/archiveLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
                params: {
                    subject: { squash: true, value: null },
                    letterNumber: { squash: true, value: null },
                    sender: { squash: true, value: null },
                    pagination: { squash: true, value: null },
                    externalNumber: { squash: true, value: null }
                },
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/cartable/archiveLetter/archiveLetterList.html",
                        controller: 'archiveLetterListCtrl'
                    }
                }
            }
        },





        {
            state: "base.home.cartable.archiveLetter",
            config: {
                url: '/archiveLetter/:letterUid?:filter',
                views: {
                    'cartableContainer@base.home.cartable': {
                        templateUrl: "app/modules/cartable/archiveLetter/archiveLetter.html",
                        controller: 'archiveLetterCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.cartable.archiveLetter",
            config: {
                url: '/archiveLetter/:letterUid?:filter',
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/cartable/archiveLetter/archiveLetter.html",
                        controller: 'archiveLetterCtrl'
                    }
                }
            }
        },






    ];
    cartableStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });

}]);
