angular.module('searchModule').factory('searchSrvc', [ 'Restangular',
    function(Restangular) {
        var searchQuery = {
            query: {},
            sort: {
                field : 'sortDate',
                order : 'desc'
            },
        };
        return{
            prepareSearchQuery : function(query){
                var searchQuery = {
                    query: [],
                    sort: [
                    //     {
                    //     "field" : "sortDate",
                    //     "order" : "desc"
                    // }
                    ],
                };
    
                // quickSearch
                if(angular.isDefined(query.quickSearch)){
                    searchQuery.query.push({
                        field: 'quickSearch',
                        values: [query.quickSearch]
                    });
                }
    
                // number
                if(angular.isDefined(query.number)){
                    searchQuery.query.push({
                        field: 'number',
                        values: angular.isArray(query.number)? query.number:[query.number]
                    });
                }
    
                // subject
                if(angular.isDefined(query.subject) ){
                    searchQuery.query.push({
                        field: 'subject',
                        values: angular.isArray(query.subject)? query.subject:[query.subject]
                    });
                }
    
                // letterBody
                if(angular.isDefined(query.letterBody) ){
                    searchQuery.query.push({
                        field: 'letterBody',
                        values: angular.isArray(query.letterBody)? query.letterBody:[query.letterBody]
                    });
                }
    
                // date
                if(angular.isDefined(query.date) ){
                    var dateList =  angular.isArray(query.date)? query.date:[query.date]
                    var queryDate = angular.copy(dateList);
                    angular.forEach(queryDate, function (date, index) {
                        queryDate[index] = date.split(',');
                    });
                    searchQuery.query.push({
                        field: 'date',
                        values: queryDate
                    });
                }
    
                // delivery
                if(angular.isDefined(query.delivery) ){
                    searchQuery.query.push({
                        field: 'delivery',
                        values: angular.isArray(query.delivery)? query.delivery:[query.delivery]
                    });
                }
    
                // sender
                if(angular.isDefined(query.sender) ){
                    searchQuery.query.push({
                        field: 'sender',
                        values: angular.isArray(query.sender)? query.sender:[query.sender]
                    });
                }
    
                // tag
                if(angular.isDefined(query.tag) ){
                    searchQuery.query.push({
                        field: 'tag',
                        values: angular.isArray(query.tag)? query.tag:[query.tag]
                    });
                }



                // externalNumber
                if(angular.isDefined(query.externalNumber) ){
                    searchQuery.query.push({
                        field: 'externalNumber',
                        values: angular.isArray(query.externalNumber)? query.externalNumber:[query.externalNumber]
                    });
                }

                return searchQuery;
            },
            search: function(query, start, len,params){
                return Restangular.all('search').customPOST(query,'', {start:start,len:len,...params});
            },
            getPuaList: function(orgUid, targerOrganization, query){
                return Restangular.all('/org/' + orgUid + '/letter_deliveres').getList({targetOrganization: targerOrganization, showExternalPosition: true, query: query, len:20});
            },
            getTagList: function(query){
                return Restangular.all('/tag/actives').getList({query: query});
            },
            setSearchQuery: function (q) {
                searchQuery = q;
            },
            getSearchQuery: function () {
                return searchQuery;
            }
        }
    }]);
