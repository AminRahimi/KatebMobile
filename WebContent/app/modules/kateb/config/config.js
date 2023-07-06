var kateb = kateb || {};

kateb.config = [  '$urlRouterProvider', 'RestangularProvider', '$httpProvider', 'Kateb_CONFIG_ROUTES', 'KATEB_CONFIG_CACHE', function( $urlRouterProvider, RestangularProvider, $httpProvider,  Kateb_CONFIG_ROUTES, KATEB_CONFIG_CACHE) {
	var initializeRoutes = function() {
		angular.forEach(Kateb_CONFIG_ROUTES.whens, function(route) {
			$urlRouterProvider.when(route.url, route.handler);
		});
		$urlRouterProvider.otherwise(Kateb_CONFIG_ROUTES.otherwise.handler);
	};
	initializeRoutes();
	RestangularProvider.setFullResponse(true);
	$httpProvider.interceptors.push('lowLevelHttpInterceptor');

    /**
     * prevent from browser caching for specific templates
     * templates determined in configCacheConst.js
     */
    var isInNoCacheList = function (url) {
        var result = false;
        angular.forEach(KATEB_CONFIG_CACHE, function (template) {
            if (url.includes(template))
                result = true;
        });
        return result;
    };
    $httpProvider.interceptors.push(function ($q) {
        return {
            request: function (config) {
                if (isInNoCacheList(config.url)) {
                    Object.assign(config.headers, {"Cache-Control": "no-cache, must-revalidate"});
                }
                return config;
            }
        }
    });



    moment.loadPersian();

} ];
