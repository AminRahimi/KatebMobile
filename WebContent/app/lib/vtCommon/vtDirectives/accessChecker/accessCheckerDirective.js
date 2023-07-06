angular.module('accessChecker', []).directive("accessChecker", function(configObj) {
	return {
		restrict : 'A',
		scope : {
		},
		controller : function($scope, $element, $attrs, $injector) {
		},
		link : function(scope, element, attrs, ctrls) {
			if(attrs.accessChecker!='*'){
				if(attrs.accessChecker && attrs.accessChecker.indexOf("||")!=-1){
					//implement OR condition
					var attrList = attrs.accessChecker.split("||");
					var hasFeature = false;
					for ( var int = 0; int < attrList.length; int++) {
						if (configObj.userConfig.features[attrList[int]]){
							hasFeature = true;
							break;
						}
					}
					if(!hasFeature){
						element.remove();
					}
				}else if(attrs.accessChecker && attrs.accessChecker.indexOf("&&")!=-1){
					//implement AND condition
					var attrList = attrs.accessChecker.split("&&");
					var hasFeature = false;
					for ( var int = 0; int < attrList.length; int++) {
						if (!configObj.userConfig.features[attrList[int]]){
							break;
						}
						hasFeature = true;
					}
					if(!hasFeature){
						element.remove();
					}
				}else{
					//single feature implementation
					if (!configObj.userConfig.features[attrs.accessChecker]) {
						element.remove();
					}	
				}	
			}
			
		}
	};
});