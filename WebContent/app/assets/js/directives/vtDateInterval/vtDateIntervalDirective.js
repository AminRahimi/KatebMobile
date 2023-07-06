//TODO put template in template cache
angular.module("vtDateInterval", [])
	.constant('vtDateIntervalConfig', {
		format: 'yyyy/MM/dd',
		closeText: 'بسته'
	})
	.directive('vtDateInterval', function() {
		return {
			restrict: 'EA',
			template: '<div class="col-sm-12" style="padding:0" ng-include=\"templateUrl\"></div>',
			scope: {
				startDate: "=",
				endDate:"=",
				display: "@", // inline, popup
				messages: "=", // TODO get and set message obj for: validation error messages and ...
				classes: "=", //TODO css classes for responsive design,
				validation: "=", // TODO get and set validation: required, startDateRequired, endDateRequired, range, ...
				api: "="
			},
			controller : function($scope, vtDateIntervalConfig, $filter) {
				$scope.model = {
					startDate: $scope.startDate || new Date(),
					endDate: $scope.endDate || new Date(),
					error: ''
				};

				$scope.config = vtDateIntervalConfig;

				$scope.isOpen = {
					startDate: false,
					endDate: false
				};

				$scope.openPersian = function (evt, key) {
					evt.preventDefault();
					evt.stopPropagation();
					$scope.isOpen[key] = true;
				};

				$scope.api = {
					getModel: function () {
						if($scope.model.startDate.getTime()>$scope.model.endDate.getTime()){
							$scope.model.error = 'START_DATE_IS_GREATER_THAN_END_DATE';
							return angular.copy($scope.model);
						}else{
							$scope.model.error = '';
							return angular.copy($scope.model);
						}
					}
				};

				$scope.onNonCurrentDayOfMonthDisable = function (_date, mode, _activeDate) {
					if (mode == "day") {
						var activeDate = $filter('persianDate')(Date.parse(_activeDate), 'MM');
						var date = $filter('persianDate')(Date.parse(_date), 'MM');
						if (date != activeDate) {
							return true;
						} else {
							return false;
						}
					}
				};
			},
			link : function(scope, element, attrs, ctrls) {
				if(scope.display === 'inline'){
					scope.templateUrl = 'app/assets/js/directives/vtDateInterval/vtDateIntervalTemplates/vtDateIntervalInlineTemplate.html';
				}else{
					scope.templateUrl = 'app/assets/js/directives/vtDateInterval/vtDateIntervalTemplates/vtDateIntervalPopupTemplate.html';
				}
			}
		};
	});