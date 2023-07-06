/*
 Example
 <input type="text" ng-model="Data.selectedProcess.code" vt-pattern-restrict="[\u0600-\u06FF\u0698\u067E\u0686\u06AF\u06F0-\u06F9]"/>
 */
angular.module('vtPatternRestrict', []).directive('vtPatternRestrict', function () {

    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {

            function fromUser(text) {
                if (text) {
                    var pattern = new RegExp(attr.vtPatternRestrict, 'g');
                    var transformedInput = text.replace(pattern, '');
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }

            ngModelCtrl.$parsers.push(fromUser);

        }
    };

});