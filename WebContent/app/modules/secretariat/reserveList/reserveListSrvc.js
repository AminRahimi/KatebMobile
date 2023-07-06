angular.module('secretariatModule').factory('reserveListSrvc', [ 'Restangular', '$q',
	/**
     * @memberOf reserveModule
     * @ngdoc service
     * @name reserveSrvc
     * @param {service} Restangular <a target="_blank" href="https://github.com/mgonto/restangular"> AngularJS service to handle Rest API Restful Resources properly and easily</a>
     * @param {service} $q angularJs service
     */
    function (Restangular, $q) {
        var ORG = '';
        return {
            setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		    },
            getReservation: function (startPage, pageLen) {
			return Restangular.all(ORG +'/reserved_letter_number/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
            },
            searchuser: function (query, start, len) {
			return Restangular.all(ORG+'/reserved_letter_number/items').customPOST(query,'',
					{start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
            },
            getUserList: function(){
            return Restangular.all(ORG+'/user/actives').getList();
            },
            getPua: function (query) {
                    return Restangular.one( ORG +'/pua/actives?query='+query).get();
            },
        }
	
}]);
