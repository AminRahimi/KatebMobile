angular.module('descriptionDropdownModule', []);

angular.module('descriptionDropdownModule').directive('descriptionDropdown', [
        /**
         * @memberOf descriptionDropdownModule
         * @ngdoc directive
         * @description a dropdown with textarea component
         * @name descriptionDropdown
         * @attr uid-list list of uids
         * @example
         *  <description-dropdown uid-list=""></description-dropdown>
         */
        function() {
        return {
             restrict: 'AE',
             scope: {
                uidList: "=",
                cb: "="
             },
             templateUrl: 'app/assets/js/directives/descriptionDropdown/descriptionDropdownTemplate.html',
             controller: function($scope, $timeout, descriptionDropdownSrvc) {

                $scope.Func = {
                    onSendClick: function () {
                        var letterUidList = [];
                        $scope.uidList.forEach(function (item) {
                            letterUidList.push(item.uid);
                        });
                        descriptionDropdownSrvc.send(letterUidList, $scope.description).then(function (res) {
                            $scope.description = "";
                            $scope.sendSucceded = true;
                            $(".successMessage").fadeIn();
                            $timeout(function () {
                                $(".successMessage").fadeOut();
                            }, 3000);
                            $scope.cb();
                        });
                    },
                    onTextAreaAdjust: function () {
                        var o = document.getElementById('textareaDescriptionDropDown');
                        o.style.height = "1px";
                        o.style.height = (25+o.scrollHeight)<450 ? (25+o.scrollHeight)+"px" : "450px";
                    }
                };
                var init = function () {
                    $('#descriptionDropDown').bind('click', function(e) {
                        e.stopPropagation();
                    });
                }

                init();
             }
        }
}]);

angular.module('descriptionDropdownModule').factory('descriptionDropdownSrvc', function (Restangular) {
    return {
        send: function (uidList, description) {
            var desc = encodeURI(description);
            return Restangular.all('letter/archive?description='+desc).post(uidList);
        }
    };
});