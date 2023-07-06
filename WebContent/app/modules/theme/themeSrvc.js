angular.module('themeModule', []);
angular.module('themeModule').factory('themeSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var currentTheme = null;
	return{
        saveTheme : function(theme){
            return Restangular.all('user/change_theme?theme='+ theme.name).post();
        },
        getCurrentName : function(){
            return currentTheme;
        },
        setCurrentName : function(newTheme){
            currentTheme = newTheme;
        }
    }
	
}]);