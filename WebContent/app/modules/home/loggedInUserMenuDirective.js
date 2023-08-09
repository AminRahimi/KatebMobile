angular.module('loggedInUserMenu',[]).directive('loggedInUserMenu',

    function () {
        return {
            restrict: 'EA',
            templateUrl: 'app/modules/home/loggedInUserMenu.html',
            scope: {
            },
            controller: function ($scope,configSrvc,homeSrvc) {
                var currentUserConfig = configSrvc.getCachedConfigObj();
                $scope.userFullName = currentUserConfig.userConfig.userFullName;
                $scope.time = new Date();
                $scope.Data = {
                    currentUserConfig:currentUserConfig,
                    userFullName : currentUserConfig.userConfig.userFullName,
                    time : new Date(),
                    settingMenu : homeSrvc.generateSettingMenu(),
                    isMobileView:  homeSrvc.screenSizeDetector.isMobile(),
                };
                $scope.Func = {
                    getStateName: function (stateName){
                        return homeSrvc.getStateName(stateName);
                    },
                    onGetClientLogClick: function () {
                        const link = document.createElement("a");

                        // Create a blog object with the file content which you want to add to the file
                        const file = new Blob([localStorage.trackjs], { type: 'text/plain' });

                        // Add file content in the object URL
                        link.href = URL.createObjectURL(file);

                        // Add file name
                        link.download = `kateb.client_error_${moment(Date.now()).format('jYYYY_jM_jD_HH_mm_ss')}.log`;

                        // Add click event to <a> tag to save file.
                        link.click();
                        URL.revokeObjectURL(link.href);
                        localStorage.removeItem('trackjs')
                    },

                };



                var  run = function () {


                };



                run();
            },
            link: function (scope, element, attrs, ctrls) {
            }
        };
    });
