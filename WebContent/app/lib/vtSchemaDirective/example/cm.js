var cm = angular.module('cm', [ 'ui.bootstrap', 'ui.router' ,'angularjs-dropdown-multiselect',
		'restangular','vtNumberValidator','accessChecker','schemaForm' , 'vtFormManagement' , 
		'vtArrayRequired', 'vtCommon','angular-nicescroll', 'entityTypeEditAdd' , 'entityTypeSelector']);

cm.run(function(Restangular){
	Restangular.setBaseUrl('/PondMS/api');

	Restangular.setResponseExtractor(function(response, operation, what, url, response2, deferred) {
		if(response.items && angular.isArray(response.items) && response.items.length>100){
			return response.items;
		}else{
			var newResponse = angular.copy(response) || {};
			if (operation === 'getList') {
				if (!angular.isArray(response)) {
					newResponse = response.items;
					delete response.items;
					angular.extend(newResponse, response);
				}
			} else if (response.items) {
				newResponse = response.items;
				delete response.items;
				angular.extend(newResponse, response);
			}
			var newResponse2 = newResponse;
			newResponse2.originalElement = angular.copy(newResponse);
			if (angular.isObject(response)) {
				angular.extend(newResponse2.originalElement, response);
			}
			return newResponse2;
		}
	});
	Restangular.setDefaultHeaders({'Content-Type': 'application/json'});
});

cm.config(function($stateProvider, RestangularProvider) {
	
	RestangularProvider.setFullResponse(true);
	
	[{
		state : "home",
		config : {
			url : "/:entityTypeKey",
			templateUrl : "app/lib/vtSchemaDirective/form-management/formManagement.html",
			controller : "formManagementCtrl"
		}
	},{
		state : "baseSelector",
		config : {
			url : "/m/base-selector",
			templateUrl : "app/lib/vtSchemaDirective/baseSelector/baseSelector.html",
			controller : "BaseSelectorCtrl"
	}
	}].forEach(function(state) {
		$stateProvider.state(state.state, state.config);
	});
			
});

cm.filter('safeHTML', function($sce) {
	return $sce.trustAsHtml;
});