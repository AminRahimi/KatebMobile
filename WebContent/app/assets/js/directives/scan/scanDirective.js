angular.module("scan", []).directive('scan', function($compile) {
	return {
		restrict : 'EAC',
		// replace: true,
		templateUrl : 'app/assets/js/directives/scan/scanTemplate.html',
		scope : {
			model : "=",
			field : "=",
			isEditMode : "=",
			schema : "=",
			form : "=",
			originalModel: "="
		},
		require : [ 'ngModel', '?^form' ],
		controller : function($scope) {

			$scope.Data = {
				scanedFile: {}
			};

			$scope.controller = {
				scanner: {
					onFileScanned: function (hashNameObj) {
						$scope.model = hashNameObj;
						$scope.controller.letterBody.setPdfUrl(hashNameObj);
					}
				}
			};

			var Run = function () {
				$scope.controller.scanner.onScanClick = function () {
					$scope.controller.letterBody.setPdfUrl(undefined);
				};
			};

			Run();

		},
		link : function(scope, element, attrs, ctrls) {}
	};
});
