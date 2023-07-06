angular.module("dateInterval", []).directive('dateInterval', function() {
	return {
		restrict : 'EAC',
		templateUrl : 'app/assets/js/directives/dateInterval/dateIntervalTemplate.html',
		scope : {
			date : "=",
			houre :"=",
			minute:"=",
			label:"@",
			haveTime:"="
		},
		controller : function($scope) {
			$scope.Data = {
				minutesRange : new Array(60),
				hoursRange : new Array(24)
			}
		},
		link : function(scope, element, attrs, ctrls) {
			
		}
	};
});