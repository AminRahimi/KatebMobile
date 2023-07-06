angular.module('autoCompleteTagInput', [ 'ngTagsInput' ]).directive('autoCompleteTagInput', function() {
	return {
		restrict : 'AEC',
		templateUrl : 'app/lib/vtSchemaDirective/components/autoCompleteTagInput/autoCompleteTagInputTemplate.html',
		scope : {
			model : '=',
			tagFunction : '=?',
			isEditMode : '=',
			api :"="
		},
		controller : function($scope, Restangular) {
			$scope.tagFunction = $scope.tagFunction || function(query) {
				return Restangular.all('tag/search?query=' + query).getList().then(function(response) {
					tags = [];
					var temp = Restangular.stripRestangular(response.data);
					angular.forEach(temp, function(item, index) {
						var tempTag = {
							"text" : item.text,
							"_uid":item._uid
						};
						tags.push(tempTag);
					});
					return tags;
					
				});
			}
			$scope.text="";
			
			$scope.api?$scope.api:$scope.api={};
			
			

		},
		link : function(scope, element, attrs, ctrls) {
			scope.api.reset = function() {
				$(element).find("input").val("");
			};
			
		}

	};

});