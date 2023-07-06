angular.module('secretariatModule').controller('incommingLetterTemplateListCtrl', function($scope, secretariatSrvc,$modalInstance) {

	$scope.Data = {
		incommingLetterTemplateList : []
	}

	$scope.Func = {
		getIncommingLetterTemplateList : function() {
			return secretariatSrvc.getGetIncommingLetterTemplateList().then(function(response) {
				$scope.Data.incommingLetterTemplateList = response.data;
				$scope.Data.incommingLetterTemplateList.push({
					uid: "emptyTemplate",
					name: "قالب خالی",
					thumnail: null
				});
			});
		},
		onIncommingLetterTemplateClick : function(incommingLetterTemplate) {
			$modalInstance.close(incommingLetterTemplate);
		},

		onFilterTyping: function(filter){
			$scope.Data.incommingLetterTemplateList.forEach(function (template) {
				if(template.name.indexOf(filter) != -1)
					template.hidden = false;
				else
					template.hidden = true;
			});
		}

	}
	var Run = function() {
		$scope.Func.getIncommingLetterTemplateList();
	}

	Run();

});
