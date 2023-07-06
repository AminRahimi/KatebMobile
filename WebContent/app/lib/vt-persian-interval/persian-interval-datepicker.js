angular.module('ui.bootstrap.persian.interval.datepicker'
    , ['ui.bootstrap.persian.datepicker'
        , 'template/persianIntervalDatePicker.html'
        , 'template/inlineIntervalDatePicker.html'
        , 'template/multiLineIntervalDatePicker.html'])
    .constant('persianIntervalDatepickerOptions', {
        format: 'yyyy/MM/dd',
        startDateModel: 'startDate',
        endDateModel: 'endDate'
    })
    .factory('persianIntervalService', function () {
        return {

            diffDates: function (startDate, endDate) {
                var startDate = moment(startDate), endDate = moment(endDate);
                return moment.duration(endDate.diff(startDate)).asDays();
            }
        }

    })
    .controller('persianIntervalDatepickerCtrl', function ($scope, $element, $rootScope, $attrs, $interpolate, persianIntervalService) {
        var rangeMin = $attrs['rangeMin'] || 0
            , rangeMax = $attrs['rangeMax'] || angular.noop();

        this.init = function (ngModel, scope) {
            angular.forEach(['startDateModel', 'endDateModel'], function (value) {
                scope.$watch(value, function () {
                    if (angular.isDefined(scope.startDateModel) && angular.isDefined(scope.endDateModel)) {
                        ngModel.$setValidity('startDateGreaterThanEnd', (scope.startDateModel < scope.endDateModel));

                        var diff = persianIntervalService.diffDates(scope.startDateModel, scope.endDateModel);

                        ngModel.$setValidity('rangeDatesInvalid', !(diff > rangeMax || diff < rangeMin));
                        ngModel.$setValidity('required', (scope.startDateModel && scope.endDateModel));

                        if (angular.equals({}, ngModel.$error)) {
                            $element.removeClass('has-error');
                        } else {
                            $element.addClass('has-error');
                        }
                    }
                });
            });
            scope.toggleMode = function (event) {
                event.preventDefault();
                event.stopPropagation();
                scope[event.target.name] = !scope[event.target.name];
                if (event.target.name === 'startDateOpen' && scope['endDateOpen'] === true) {
                    scope['endDateOpen'] = false;
                } else if (event.target.name === 'endDateOpen' && scope['startDateOpen'] === true) {
                    scope['startDateOpen'] = false;
                }

            };
        }
    })
    .directive('persianIntervalDatepicker', function () {
        return {
            restrict: 'AE',
            replace: true,
            controller: 'persianIntervalDatepickerCtrl',
            templateUrl: 'template/persianIntervalDatePicker.html',
            scope: {
                display: '@',
                format: '@',
                startDateLabel: '@',
                endDateLabel: '@',
                startDatePlaceholder: '@',
                endDatePlaceholder: '@',
                startDateModel: '=',
                endDateModel: '=',
                currentDate: "="
            },
            compile: function (element, attrs) {
                if (attrs.display === undefined) {
                    attrs.display = 'inline';
                }
            }
        }
    })
    .directive('persianInlineIntervalDatepicker', function () {
        return {
            restrict: 'AE',
            templateUrl: 'template/inlineIntervalDatePicker.html',
            require: ['^persianIntervalDatepicker', '^ngModel'],
            link: function (scope, element, attr, ctrls) {
                var ctrl = ctrls[0], ngModel = ctrls[1];
                ctrl.init(ngModel, scope);
            }
        }
    })
    .directive('persianMultilineIntervalDatepicker', function () {
        return {
            restrict: 'AE',
            controller: 'persianIntervalDatepickerCtrl',
            templateUrl: 'template/multiLineIntervalDatePicker.html',
            require: ['^persianIntervalDatepicker', '^ngModel'],
            link: function (scope, element, attr, ctrls) {
                var ctrl = ctrls[0], ngModel = ctrls[1];
                ctrl.init(ngModel, scope);
            }
        }
    });
angular.module('template/persianIntervalDatePicker.html', []).run(["$templateCache", function ($templateCache) {
    $templateCache.put('template/persianIntervalDatePicker.html',
        "<div>" +
        "<persian-multiline-interval-datepicker/></div>"
    )
}]);
angular.module('template/multiLineIntervalDatePicker.html', []).run(["$templateCache", function ($templateCache) {
    $templateCache.put('template/multiLineIntervalDatePicker.html',
        "<div class=\"row rowForm\">" +
        "<label class=\"col-sm-5\" for=\"startDate\" ng-if=\"startDateLabel\">{{startDateLabel}}</label>" +
        "<div class=\"col-sm-7\">" +
        "<p class=\"input-group\">" +
        "<input name=\"startDate\" placeholder=\"{{startDatePlaceholder}}\" class=\"form-control\" min-date='currentDate'" +
        "type=\"text\" datepicker-popup-persian=\"{{format}}\" ng-model=\"startDateModel\" show-button-bar=\"false\" " +
        "is-open=\"startDateOpen\" />" +
        "<span class=\"input-group-btn\">" +
        "<button name=\"startDateOpen\" type=\"button\" class=\"btn btn-default\" ng-click=\"toggleMode($event)\">" +
        "<i class=\"glyphicon glyphicon-calendar\"></i></button></span></p>" +
        "</div></div>" +
        "<div class=\"row rowForm\">" +
        "<label class=\"col-sm-5\" for=\"endDate\" ng-if=\"endDateLabel\">{{endDateLabel}}</label>" +
        "<div class=\"col-sm-7\">" +
        "<p class=\"input-group\"><input name=\"endDate\" " +
        "placeholder=\"{{endDatePlaceholder}}\" class=\"form-control\" type=\"text\" " +
        "datepicker-popup-persian=\"{{format}}\" required ng-model=\"endDateModel\" show-button-bar=\"false\" " +
        "is-open=\"endDateOpen\"/> <span class=\"input-group-btn\">" +
        "<button name=\"endDateOpen\" type=\"button\" class=\"btn btn-default\"" +
        "ng-click=\"toggleMode($event)\"> <i class=\"glyphicon glyphicon-calendar\"></i>" +
        "</button></span></p></div></div>");
}]);
angular.module('template/inlineIntervalDatePicker.html', [])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put('template/inlineIntervalDatePicker.html',
            "<div class=\"form-inline\"><label style=\"padding:0 5px\" ng-if=\"startDateLabel\">{{startDateLabel}}</label>" +
            "<p class=\"input-group\"><input name=\"startDate\" placeholder=\"{{startDatePlaceholder}}\" " +
            "class=\"form-control\" type=\"text\" datepicker-popup-persian=\"{{format}}\" " +
            "ng-model=\"startDate\" show-button-bar=\"false\" is-open=\"startDateOpen\" ng-click=\"startDateOpen = true\"/>" +
            "<span class=\"input-group-btn\"> <button name=\"startDateOpen\" type=\"button\" class=\"btn btn-default\"" +
            "ng-click=\"toggleMode($event)\"> <i class=\"glyphicon glyphicon-calendar\"></i>" +
            "</button></span></p> <label style=\"padding:0 5px\" ng-if=\"endDateLabel\">{{endDateLabel}}</label>" +
            "<p class=\"input-group\"><input name=\"EndDate\" placeholder=\"{{endDatePlaceholder}}\" " +
            "class=\"form-control\" type=\"text\" " +
            "datepicker-popup-persian=\"{{format}}\" ng-model=\"endDate\" show-button-bar=\"false\" is-open=\"endDateOpen\" " +
            "ng-click=\"endDateOpen = true\"/> <span class=\"input-group-btn\">" +
            "<button name=\"endDateOpen\" type=\"button\" class=\"btn btn-default\" ng-click=\"toggleMode($event)\">" +
            "<i class=\"glyphicon glyphicon-calendar\"></i> </button></span></p></div>"
        )
    }]);