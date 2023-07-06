angular.module('secretariatModule').factory('reserveSrvc', [ 'Restangular', '$q',
	/**
     * @memberOf reserveModule
     * @ngdoc service
     * @name reserveSrvc
     * @param {service} Restangular <a target="_blank" href="https://github.com/mgonto/restangular"> AngularJS service to handle Rest API Restful Resources properly and easily</a>
     * @param {service} $q angularJs service
     */
    function (Restangular) {
        var ORG = '';
        return {
            setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		    },
            getPua: function (query) {
                if (query) {
                    return Restangular.one( ORG +'/pua/actives?query='+query).get();
                } else {
                    return Restangular.one( ORG +'/pua/actives').get();
            }
            },
            SaveReservation: function (data) {
                return Restangular.all( ORG +'/reserved_letter_number/items').post(data);
            },
        }
	
}]);
