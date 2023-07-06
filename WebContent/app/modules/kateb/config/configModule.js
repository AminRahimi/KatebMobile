angular.module('katebConfigModule',[])
.constant('Kateb_CONFIG_STATES', kateb.getKatebConfigStateConst())
.constant('Kateb_CONFIG_ROUTES', kateb.getKatebConfigRouteConst())
.constant('Kateb_CONFIG_MENUS', kateb.getKatebConfigMenuConst())
.constant('KATEB_CONFIG_CACHE', kateb.getKatebConfigCacheConst())
.provider('configSrvc', kateb.katebConfigSrvc);
var kateb =  kateb || {};
kateb.RESTANGULAR_SERVICE= 'Restangular';


