angular.module('processModule', []);
angular.module('processModule').config(['$stateProvider', function ($stateProvider) {
    var processStates = [
        {
            state: "home.process",
            config: {
                url: '/process',
                views: {
                    'mainContent@home': {
                        templateUrl: "app/modules/process/process.html",
                        controller: 'processCtrl'
                    }
                }
            }
        },
        {
            state: "home.process.processTaskList",
            config: {
                url: '/taskList',
                views: {
                    'processContainer@home.process': {
                        templateUrl: "app/modules/process/taskList/processTaskList.html",
                        controller: "processTaskListCtrl"
                    }
                }
            }
        },
        {
            state: "home.process.processList",
            config: {
                url: '/processList',
                views: {
                    'processContainer@home.process': {
                        templateUrl: "app/modules/process/processList/processList.html",
                        controller: "processListCtrl"
                    }
                }
            }
        },
        {
            state: "home.process.processInfo",
            config: {
                url: '/processInfo/:uid/:mode',
                views: {
                    'processContainer@home.process': {
                        templateUrl: "app/modules/process/processInfo/processInfo.html",
                        controller: "processInfoCtrl"
                    }
                }
            }
        },
        {
            state: "home.process.processInstanceInfo",
            config: {
                url: '/processInstanceInfo/:uid',
                views: {
                    'processContainer@home.process': {
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
