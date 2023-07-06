angular.module('vtPersianDatePicker', []).directive("vtPersianDatePicker",function() {
	return {
		restrict : 'AE',
		template : "<p class=\"input-group\">" + "<input name=\"name\" style=\"background-color: white;border-radius: 0;\" type=\"text\" max-date=\"maxDate\"" 
				+ "readonly=\"readonly\" class=\"form-control\"" + "datepicker-popup-persian=\"yyyy\/MM\/dd\" ng-model=\"model\""
				+ "ng-required=\"isRequired\" is-open=\"Data.datePicker.isOpen\" min-date=\"minDate\" date-disabled=\"onNonCurrentDayOfMonthDisable(date, mode, activeDate)\""
				+ "current-text=\"امروز\" clear-text=\"پاک کردن\" close-text=\"لغو\"" + "starting-day=\"6\" \/>"
				+ "<span class=\"input-group-btn\">" + "<button type=\"button\" class=\"btn btn-default\" style=\"border-radius: 0;color:#555;\"" 
				+ "ng-click=\"Data.open($event)\">" + "<i class=\"glyphicon glyphicon-calendar\"><\/i>" + "<\/button>" + "<\/span>"
				+ "<\/p>",
		scope : {
			model : '=',
			isRequired : "=",
			name : "@",
            minDate: "=",
			maxDate: "="
		},
		controller : function($scope, $rootScope, $filter) {
			$scope.$watch("model", function(newValue, oldValue) {
				if (newValue && !angular.isDate(newValue)) {
					newValue = new Date(newValue);
					$scope.model = newValue;
				}
			}, true);
			$scope.Data = {
				datePicker : {
					isOpen : false
				},
				open : function($event) {
					$event.preventDefault();
					$event.stopPropagation();
					$rootScope.$broadcast('closeDatePicker', {
						close : $scope.name
					});
					$scope.Data.datePicker.isOpen = !$scope.Data.datePicker.isOpen;
				}
			}
			$rootScope.$on('closeDatePicker', function(e, eArgs) {
				if ($scope.name != eArgs.close)
					$scope.Data.datePicker.isOpen = false;
			});
			$scope.onNonCurrentDayOfMonthDisable = function (_date, mode, _activeDate) {
				if (mode == "day") {
					var activeDate = $filter('tehranDate')(Date.parse(_activeDate), 'jMM');
					var date = $filter('tehranDate')(Date.parse(_date), 'jMM');
					if (date != activeDate) {
						return true;
					} else {
						return false;
					}
				}
			};
		},
		link : function(scope, element, attrs, ctrls) {
		}
	};
});