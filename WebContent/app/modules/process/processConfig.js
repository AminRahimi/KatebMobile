angular.module('processModule', []);
angular.module('processModule').config(['$stateProvider', function ($stateProvider) {
    var processStates = [
        {
            state: "base.home.process",
            config: {
                url: '/process',
                views: {
                    'mainContent@base.home': {
                        templateUrl: "app/modules/process/process.html",
                        controller: 'processCtrl'
                    }
                }
            }
        },
        {
            state: "base.mobileHome.process",
            config: {
                url: '/process',
            }
        },



        {
            state: "base.home.process.processTaskList",
            config: {
                url: '/taskList?:cartableUid?:filter',
                views: {
                    'processContainer@base.home.process': {
                        templateUrl: "app/modules/process/taskList/processTaskList.html",
                        controller: "processTaskListCtrl"
                    }
                }
            }
        },
        {
            state: "base.home.process.processTaskList.filter",
            config: {
                url: '?page',
               
            }
        },
        {
            state: "base.mobileHome.process.processTaskList",
            config: {
                url: '/taskList?:cartableUid?:filter',
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/process/taskList/processTaskList.html",
                        controller: "processTaskListCtrl"
                    }
                }
            }
        },
        {
            state: "base.mobileHome.process.processTaskList.filter",
            config: {
                url: '?page',
               
            }
        },











        {
            state: "base.home.process.processList",
            config: {
                url: '/processList',
                views: {
                    'processContainer@base.home.process': {
                        templateUrl: "app/modules/process/processList/processList.html",
                        controller: "processListCtrl"
                    }
                }
            }
        },
        {
            state: "base.mobileHome.process.processList",
            config: {
                url: '/processList',
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/process/processList/processList.html",
                        controller: "processListCtrl"
                    }
                }
            }
        },







        {
            state: "base.home.process.processInfo",
            config: {
                url: '/processInfo/:uid/:mode',
                views: {
                    'processContainer@base.home.process': {
                        templateUrl: "app/modules/process/processInfo/processInfo.html",
                        controller: "processInfoCtrl"
                    }
                }
            }
        },
        {
            state: "base.mobileHome.process.processInfo",
            config: {
                url: '/processInfo/:uid/:mode',
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/process/processInfo/processInfo.html",
                        controller: "processInfoCtrl"
                    }
                }
            }
        },










        {
            state: "base.home.process.processInstanceInfo",
            config: {
                url: '/processInstanceInfo/:uid',
                views: {
                    'processContainer@base.home.process': {
                        templateUrl: "app/modules/process/processInstanceInfo/processInstanceInfo.html",
                        controller: "processInstanceInfoCtrl"
                    }
                }
            }
        },
        {
            state: "base.mobileHome.process.processInstanceInfo",
            config: {
                url: '/processInstanceInfo/:uid',
                views: {
                    'mainContent@base.mobileHome': {
                        templateUrl: "app/modules/process/processInstanceInfo/processInstanceInfo.html",
                        controller: "processInstanceInfoCtrl"
                    }
                }
            }
        }
    ];
    processStates.forEach(function (state) {
        $stateProvider.state(state.state, state.config);
    });

}]);
