angular.module('cartableModule', []);
angular.module('cartableModule').config(['$stateProvider', function ($stateProvider) {
    var cartableStates = [
        {
            state: "home.cartable",
            config: {
                url: '/cartable',
                views: {
                    'mainContent@home': {
                        templateUrl: "app/modules/cartable/cartable.html",
                        controller: 'cartableCtrl'
                    }
                }
            }
        },
        {
            state: "home.cartable.cartableList",
            config: {
                url: '/taskList?:cartableUid?:filter',
                views: {
                    'cartableContainer@home.cartable': {
                        templateUrl: "app/modules/cartable/taskList/cartableTaskList.html?v=2",
                        controller: "cartableTaskListCtrl"
                    }
                }
            }
        },
        {
            state: "home.cartable.draft",
            config: {
                url: '/draft/:draftUid/:replyFromUid/:duplicateUid/:orgUid?:cartableUid?:filter',
                views: {
                    'cartableContainer@home.cartable': {
                        templateUrl: "app/modules/cartable/draft/cartableDraft.html?v=3",
                        controller: 'cartableDraftCtrl'
                    }
                }
            }
        },
        {
            state: "home.cartable.letter",
            config: {
                url: '/letter/:letterUid?:userArchiveUid?:cartableType?:cartableUid?:filter',
                params: { 
                    cartableType: 'letter',
                },
                views: {
                    'cartableContainer@home.cartable': {
                        templateUrl: "app/modules/cartable/letter/cartableLetter.html",
                        controller: 'cartableLetterCtrl'
                    }
                }
            }
        },
        {
            state: "home.cartable.orgLetterList",
            config: {
                url: '/orgLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
                views: {
                    'cartableContainer@home.cartable': {
                        templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetterList.html",
                        controller: 'cartableOrgLetterListCtrl'
                    }
                }
            }
        },
        {
            state: "home.cartable.orgLetter",
            config: {
                url: '/orgLetter/:letterUid?:filter',
                views: {
                    'cartableContainer@home.cartable': {
                        templateUrl: "app/modules/cartable/orgLetter/cartableOrgLetter.html",
                        controller: 'cartableOrgLetterCtrl'
                    }
                }
            }
        },
        {
            state: "home.cartable.archiveLetterList",
            config: {
                url: '/archiveLetterList/:subject?/:letterNumber?/:sender?/:pagination?/:externalNumber?',
                views: {
                    'cartableContainer@home.cartable': {
                        templateUrl: "app/modules/cartable/archiveLetter/archiveLetterList.html",
                        controller: 'archiveLetterListCtrl'
                    }
                }
            }
        },
        {
            state: "home.cartable.archiveLetter",
            config: {
                url: '/archiveLetter/:letterUid?:filter',
                views: {
                    'cartableContainer@home.cartable': {
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
