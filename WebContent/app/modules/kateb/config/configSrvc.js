var kateb = kateb || {};
kateb.katebConfigSrvc = function() {
	var defer = null;
	var appData = null;
	var isResolved = false;

	 /* @ngInject */ function katebConfigSrvc($http, $q, Restangular, $rootScope, configObj) {
		defer = $q.defer();
		this.getConfig = function() {
			if (isResolved || configObj) {
				
				defer.resolve(appData || configObj);
			} else {
				$http.get('api/config').success(function(data, status, headers, config) {
					isResolved = true;
					appData = data;
					defer.resolve(appData);
				}).error(function(data, status, headers, config) {
				});
			}
			return defer.promise;
		}
		this.getConfigAndConfigModules=function(){
			var getBaseRequestUrl = {};
			return this.getConfig().then(function(_configObj){
				
				getBaseRequestUrl = function() {
					return "api";
				};

				var features = _configObj.userConfig.features;
				var obj = {};
				if (features.length == 0 && _configObj.userConfig.userFullName != null) {
					features.push("API_CHANGE_PASSWORD")
				}
				;
				angular.forEach(features, function(feature) {
					obj[feature] = true;
				});
				$rootScope.features = _configObj.userConfig.features
				Restangular.setBaseUrl(getBaseRequestUrl());
				return _configObj;
			})
		}
	}
	return {

		$get : /* @ngInject */ function($http, $q, Restangular, $rootScope,configObj) {
			return new katebConfigSrvc($http, $q, Restangular, $rootScope,configObj);
		}
	}
}
