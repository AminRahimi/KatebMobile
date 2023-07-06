//TODO put template in template cache
angular.module("vtCartableDateInterval", [])
	.constant('vtCartableDateIntervalErrors', {
		'START_DATE_IS_GREATER_THAN_END_DATE': 'تاریخ شروع بزرگتر از تاریخ پایان است.'
	})
	.factory('vtCartableDateIntervalPickerFunctions', function () {
		return {
			today: function () {
				return {
					startDate: moment({hour: 0}).toDate(),
					// endDate: moment({hour: 0}).add(1,'days').toDate()
					endDate: moment({hour: 23, minute: 59, second: 59, milliseconds: 999}).toDate()
				}
			},
			yesterDay: function () {
				return {
					startDate: moment({hour: 0}).subtract(1, 'days').toDate(),
					endDate: moment({hour: 23, minute: 59, second: 59, milliseconds: 999}).subtract(1, 'days').toDate()
				}
			},
			currentWeek: function () {
				return {
					startDate: moment().startOf('Week').subtract(1, 'days').toDate(),
					endDate: moment().endOf('Week').subtract(1, 'days').toDate()
				}
			},
			lastWeek: function () {
				return {
					startDate: moment().subtract(1, 'weeks').startOf('isoWeek').subtract(1, 'days').toDate(),
					endDate: moment().subtract(1, 'weeks').endOf('isoWeek').subtract(1, 'days').toDate()
				}
			}
		}
	})
	.directive('vtCartableDateInterval', function() {
		return {
			restrict: 'EA',
			templateUrl: 'app/lib/vtCartable/directives/vtCartableDateInterval/vtCartableDateIntervalTemplate.html',
			scope: {
				model: "=",
				label: "="
			},
			controller : function($scope, vtCartableDateIntervalErrors, $timeout, vtCartableDateIntervalPickerFunctions) {

				if(!$scope.model){
					$scope.model = [];
				}

				$scope.Data = {
					label: $scope.label || 'تاریخ',
					startDate: new Date(),
					endDate: new Date(),
					datePickerOptions: [
						{
							label: 'امروز',
							fn: vtCartableDateIntervalPickerFunctions.today
						},{
							label: 'روز گذشته',
							fn: vtCartableDateIntervalPickerFunctions.yesterDay
						},{
							label: 'هفته جاری',
							fn: vtCartableDateIntervalPickerFunctions.currentWeek
						},{
							label: 'هفته گذشته',
							fn: vtCartableDateIntervalPickerFunctions.lastWeek
						}
					]
				};

				$scope.Func = {
					addToModel: function(obj){
						obj.startDate.setHours(0, 0, 0, 0);
						obj.endDate.setHours(23, 59, 59, 999);
						var newDate = obj.startDate.getTime() + ',' + obj.endDate.getTime();
						if(!$scope.model)
							$scope.model = [];
						$scope.model.push(newDate);
					},
					viewModelItem: function(date){
						return {
							startDate: date.split(',')[0],
							endDate: date.split(',')[1]
						}
					},

					onAddDate: function () {
						var DateIntervalModel = $scope.DateIntervalApi.getModel();
						if(DateIntervalModel.error){
							$scope.Data.errorMessage = vtCartableDateIntervalErrors[DateIntervalModel.error];
							$timeout(function () {
								$scope.Data.errorMessage = '';
							}, 3000);
						}else{
							delete DateIntervalModel.error;
							$scope.Func.addToModel(DateIntervalModel);
						}
					},

					onRemoveDate: function (index) {
						$scope.model.splice(index, 1);
					},
					onSetDate: function (item) {
						$scope.Func.addToModel(item.fn());
					}
				};

				$scope.DateIntervalApi = {};

				var onInit = function () {
					$('.vtCartableDateInterval').bind('click', function (e) {
						e.stopPropagation();
					});
				};

				onInit();
			}
		};
	});
