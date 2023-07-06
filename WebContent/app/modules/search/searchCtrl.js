angular.module('searchModule').controller('searchCtrl', function($scope, $rootScope, $modal, $state, $window, searchSrvc,homeSrvc) {
    $scope.Data = {
        orgUid: $rootScope.currentUserOrg.uid,
        isQuery:$state.params.q,
        searchQuery: {
            query: {},
            sort: {
                // field : 'sortDate',
                // order : 'desc'
            },
        }
    };

    var searchQuery = {};

    $scope.Func = {
        getStateName: function (stateName) {
            return homeSrvc.getStateName(stateName);
        },
        onSearchClick: function () {
            searchSrvc.setSearchQuery($scope.Data.searchQuery);
            $rootScope.$broadcast('searchQueryHeaderUpdate');
            $scope.Func.prepareSearchQuery();
            if ($scope.Data.isQuery) {
                $scope.Controller.listController.refreshList();
            } else {
                $scope.Data.isQuery = true;
            }
        },
        onExitSearchModeClick: function(){
            $scope.Data.searchQuery = {
                query: {},
                sort: {
                    // field : 'sortDate',
                    //     order : 'desc'
                },
            };
            searchSrvc.setSearchQuery($scope.Data.searchQuery);
            $rootScope.$broadcast('searchQueryHeaderUpdate');
            $scope.Func.prepareSearchQuery();
            $scope.Controller.listController.refreshList();
        },
        prepareSearchQuery: function () {
            $state.go($scope.Func.getStateName('base.home.search'), {q: encodeURIComponent(JSON.stringify(angular.copy($scope.Data.searchQuery)))});
            

            searchQuery = searchSrvc.prepareSearchQuery($scope.Data.searchQuery.query);
        },
        getPuaList: searchSrvc.getPuaList,
        getTagList: {
            label: 'برچسب',
            getList: searchSrvc.getTagList
        },
        onListItemSelect: function (item) {
            var url;
            if(item.type === 'lpa'){
                url = $state.href($scope.Func.getStateName('base.home.cartable.letter'), {letterUid: item.uid});
            } else if(item.type === 'draft'){
                url = $state.href($scope.Func.getStateName('base.home.cartable.draft'), {draftUid: item.uid});
            } else if(item.type === 'lc'){
                url = $state.href($scope.Func.getStateName('base.home.cartable.orgLetter'), {letterUid: item.uid});
            }
            $window.open(url,'_blank');
        }
    };

    $scope.Controller = {
        listController: {
            headers: [
                {key:'internalNumber', label:'شماره نامه'},
                {key:'subject', label:'موضوع',sortable:true,type:'string'},
                {key: 'sender', label: 'فرستنده',sortable:true,type:'string' },
                {key:'deliveries', label:'گیرندگان',type:'stringArray'},
                {key:'officialData', label:'تاریخ رسمی', type:'date', format:'jDD-jMMMM-jYYYY',sortable:true},
                {key:'type', type: 'enum', label: 'نوع نامه',sortable:true},
                {
                    key:'action',
                    label:'هایلایت',
                    type:'action',
                    icon:'glyphicon glyphicon-text-width',
                    showConditionArr: true,
                    valueShouldHave: 'highlight',
                    action: function (item, event) {
                        event.stopPropagation();
                        event.preventDefault();
                        var modalInstance = $modal.open({
                            templateUrl: 'app/modules/search/moreInfoModal/moreInfoModal.html',
                            controller: 'moreInfoModalCtrl',
                            size: '',
                            resolve: {
                                items: function () {
                                    return item.highlight;
                                }
                            }
                        });
                        modalInstance.result.then(function (selectedItem) {
                        });
                    }
                }
            ],
            showSort: true,
            restrictionSort: true,
            onSortClick: function (field, order) {
                searchQuery.sort = [];
                switch (field.key) {
                    case 'officialData':
                        searchQuery.sort.push({
                            field: 'sortDate',
                            order: order,
                        });
                        break;
                    case 'sender':
                        searchQuery.sort.push({
                            field: 'sortSender',
                            order: order,
                        });
                    break;
                    case 'subject':
                        searchQuery.sort.push({
                            field: 'sortSubject',
                            order: order,
                        });
                    break;
                    case 'type':
                        searchQuery.sort.push({
                            field: 'sortType',
                            order: order,
                        });
                        break;		
                }
            },
            getList: function (start, pageLen) {
                return searchSrvc.search(searchQuery, start, pageLen);
            },
            onListItemSelect: $scope.Func.onListItemSelect,
        },
    };

    var Run = function(){
        if ($state.params.q) {
            $scope.Data.searchQuery = angular.copy(JSON.parse(decodeURIComponent($state.params.q)));
            searchSrvc.setSearchQuery($scope.Data.searchQuery);
            $rootScope.$broadcast('searchQueryHeaderUpdate');
            $scope.Func.prepareSearchQuery();
        }
        else {
            // $scope.Data.searchQuery = searchSrvc.getSearchQuery();
            // $scope.Func.prepareSearchQuery();
            // searchSrvc.setSearchQuery(null);
        }
    };

    Run();
});
