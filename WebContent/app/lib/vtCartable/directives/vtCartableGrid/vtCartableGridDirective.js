angular.module('vtCartableGrid', []).directive("vtCartableGrid", function () {
//www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
    return {
        restrict: 'AE',
        templateUrl: "app/lib/vtCartable/directives/vtCartableGrid/vtCartableGridTemplate.html",
        scope: {
            controlFn: '=',
            visibleHeaders: "="
        },
        // && (controlFn.searchQuery.orders && controlFn.searchQuery.orders.length)||(Data.cartableState.filter.orders && Data.cartableState.filter.orders.length)
        controller: function ($scope, $element, $location, $attrs, $injector, $q, cartableSrvc, $timeout) {

            $scope.Data = {
                selectedItem: null,
                visibleFields: [],
                checked: {},
                tempTaskType: undefined,
                cartableState: cartableSrvc.getCartableState(),
                isLoading:false
            };

            $scope.Controller = {
                pagination: {
                    totalItems: 1,
                    currentPage: $location.search()['page'] || cartableSrvc.getCurrentPage(),
                    perPage: ($scope.controlFn.pageSize ? $scope.controlFn.pageSize : 10),
                    maxSize: 1,
                    inOnePage: function () {
                        return ($scope.Controller.pagination.totalItems <= $scope.Controller.pagination.perPage);
                    },
                    pageChanged: function () {
                        if ((Math.ceil($scope.Controller.pagination.totalItems / 10)) == $scope.controlFn.currentPage) {
                            $scope.controlFn.currentPage = 1;
                        }
                        cartableSrvc.current = $scope.controlFn.currentPage;
                        cartableSrvc.setCurrentPage($scope.Controller.pagination.currentPage);
                        $location.search(angular.extend($location.search(),{page: cartableSrvc.getCurrentPage()}));
                        $scope.Func.getItemsPerCondition();
                    }
                },
                /**
                 * customPagination object which will be used, if we have custom pagination defined.
                 * @prop choices: By setting customPagination of options of controlFn, we indicate that grid can have custom pagination.
                 */
                customPagination: {
                    choices: $scope.controlFn.options.customPagination,
                    totalItems : 1,
                    currentPage : 1,
                    count : parseInt(localStorage.getItem('customPagination')) || 10,
                    maxSize : 1,
                    totalPages: 1,
                    change : function() {
                        localStorage.setItem('customPagination', $scope.Controller.customPagination.count);
                        $scope.Controller.customPagination.totalPages =  Math.ceil($scope.Controller.customPagination.totalItems/$scope.Controller.customPagination.count);
                        cartableSrvc.current = $scope.controlFn.currentPage;
                        cartableSrvc.setCurrentPage($scope.Controller.customPagination.currentPage);
                        return $scope.Func.getItemsPerCondition(true);
                    }
                }
            };

            $scope.Func = {
                /* ******************************** Main Functions ******************************** */
                getItemsPerCondition: function () {
                    // if($scope.Data.isLoading){
                    //     return  $q.resolve();
                    // }
                    $scope.Data.isLoading=true;
                    $scope.controlFn.currentPage = $location.search()['page'] || $scope.Controller.pagination.currentPage;

                    var start, pageLen;
                    if(!$scope.Controller.customPagination.choices) {
                        $scope.Data.cartableState.currentPage = $scope.Controller.pagination.currentPage;
                        start = (($location.search()['page'] || parseInt($scope.Controller.pagination.currentPage) ) - 1) * $scope.Controller.pagination.perPage;
                        pageLen = $scope.Controller.pagination.perPage;
                    }
                    else {
                        $scope.Data.cartableState.currentPage = $scope.Controller.customPagination.currentPage;
                        start = (parseInt($scope.Controller.customPagination.currentPage) - 1) * $scope.Controller.customPagination.count;
                        pageLen = $scope.Controller.customPagination.count;
                    }

                    cartableSrvc.setCartableState($scope.Data.cartableState);


                        if ($scope.searchMode) {
                            return $scope.Func.search($scope.controlFn.searchQuery, start, pageLen).then(function (data){
                                $scope.Data.isLoading=false
                                return data;
                            });
                        } else {
                            return $scope.Func.getItems(start, pageLen).then(function (data){
                                $scope.Data.isLoading=false
                                return data;
                            });
                        }
                },
                search: function (query, start, len) {
                    var defer = $q.defer();
                    if ($scope.controlFn.searchFunction) {
                        //(len +1)=> get one more  for handling that next page is exist or not
                        $scope.controlFn.searchFunction($scope.controlFn.ctrlData.taskType, query, start, len +1).then(function (response) {
                            $scope.Func.processListResponse(response, defer, true,start, len);
                        });
                    }else{
                        defer.reject();
                    }
                    return defer.promise;
                },
                getItems: function (start, len) {
                    var defer = $q.defer();
                    if ($scope.controlFn.getList) {
                        //(len +1)=> get one more  for handling that next page is exist or not
                        $scope.controlFn.getList(start, len+1).then(function (response) {
                            $scope.Func.processListResponse(response, defer, false,start, len);
                        });
                    }else{
                        defer.reject();
                    }
                    return defer.promise;
                },
                processListResponse: function (response, defer, isSort,start, len) {
                    var totalItemsHandlerOnPagination = function(totalItems){
                        totalItems = start + response.data.length
                        return totalItems;
                    }

                    if(!$scope.Controller.customPagination.choices) {
                        
                        
                        $scope.Controller.pagination.totalItems = totalItemsHandlerOnPagination($scope.Controller.pagination.totalItems);

                    }
                    else {
                        $scope.Controller.customPagination.totalItems = totalItemsHandlerOnPagination($scope.Controller.customPagination.totalItems);

                    }

                    if(response.data.length > len){
						// remove on added for detecting that next page is exist
						response.data.pop();
					}

                    $scope.controlFn.listItems = response.data;

                    $scope.controlFn.fieldsInfo = response.data.fields;
                    $scope.Data.visibleFields = [];
                    //Backup Original Data
                    _.each($scope.controlFn.listItems, function (item) {
                        item.original = angular.copy(item);
                    });
                    //Create Header of Table
                    _.each($scope.controlFn.headers, function (header) {
                        if (header.key && $scope.controlFn.listItems.fields) {
                            var fieldOfKey = _.find($scope.controlFn.listItems.fields, function (field) {
                                return field.key == header.key;
                            });
                            if (!fieldOfKey) {
                                var keys = header.key.split(".")
                                fieldOfKey = $scope.Func.findKeyOnFields(keys, $scope.controlFn.fieldsInfo);
                            }
                            if (fieldOfKey) {
                                if ( (fieldOfKey.type == 'date' || fieldOfKey.type == 'timestamp') && header.format == undefined) {
                                header.format = 'jDD-jMMMM-jYYYY';
                            }
                            $scope.Data.visibleFields.push(angular.extend(fieldOfKey, header));
                            } else {
                                $scope.Data.visibleFields.push(header);
                            }
                        } else {
                            $scope.Data.visibleFields.push(header);
                        }
                    });
                    //Support Nested Objects
                    _.each($scope.controlFn.listItems, function (item) {
                        if (!$scope.Func.isFirstFetchingList && item.uid === $scope.Data.selectedItem.uid) {
                            $scope.Func.selectItem(item);
                        }
                        _.each($scope.Data.visibleFields, function (field) {
                            field.display = true;
                            var path = ("item" + "." + field.key).split(".");
                            var notNull = path[0];
                            for (var i = 1; i < path.length; i++) {
                                if (eval(notNull) == null) {
                                    notNull = null;
                                    break;
                                }
                                notNull += "." + path[i];
                            }
                            if (notNull != null) {
                                item[field.key] = eval("item" + "." + field.key);
                            }
                        });
                    });

                    
                    
                    $scope.selectFiledCnt.selectedFromMultiselectOptions = [];

                    // $scope.Data.cartableState = cartableSrvc.getCartableState();

                    $scope.Data.cartableState.filter = $scope.controlFn.ctrlData.filter;
                    // initiation or onFilterClick
                    if (!isSort) {
                        $scope.visibleHeaders = [];
                    }
                    if (_.isEmpty($scope.Data.cartableState.filter) || $scope.controlFn.ctrlData.filter.uid != $scope.Data.cartableState.filter.uid) {
                    	$scope.controlFn.visibleFields.forEach(function (field) {
                            var visibleItem = _.find($scope.Data.visibleFields, function (item) {
                                return item.key == field
                            });
                            if (visibleItem && !isSort) {
                                $scope.visibleHeaders.push(visibleItem);
                            }
                        });
                        $scope.selectFiledCnt.selectedFromMultiselectOptions = angular.copy($scope.visibleHeaders);
                        for (var i = 0; i < $scope.Data.visibleFields.length; i++) {
                            $scope.Data.visibleFields[i].display = true;
                        }
                        $scope.Data.cartableState.visibleHeaders = angular.copy($scope.selectFiledCnt.selectedFromMultiselectOptions);
                        if ($scope.controlFn.ctrlData.filter.orders && $scope.controlFn.ctrlData.filter.orders.length) {
                            for (var i = 0; i < $scope.Data.visibleFields.length; i++) {
                                $scope.Data.visibleFields[i].asc = false;
                                for (var j = 0; j < $scope.controlFn.ctrlData.filter.orders.length; j++) {
                                    if ($scope.Data.visibleFields[i].key == $scope.controlFn.ctrlData.filter.orders[j].field) {
                                        if ($scope.controlFn.ctrlData.filter.orders[j].dir == "asc") {
                                            $scope.Data.visibleFields[i].asc = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            $scope.controlFn.searchQuery.orders = $scope.controlFn.ctrlData.filter.orders;
                        }
                    } else {
                        $scope.controlFn.visibleFields.forEach(function (field) {
                            var visibleItem = _.find($scope.Data.visibleFields, function (item) {
                                return item.key == field
                            });
                            if (visibleItem) {
                                $scope.selectFiledCnt.selectedFromMultiselectOptions.push(visibleItem);
                            }
                        });
                        // $scope.selectFiledCnt.selectedFromMultiselectOptions.forEach(function (field) {
                        //     var visibleItem = _.find($scope.Data.cartableState.displayedColumns, function (item) {
                        //         return item == field.key
                        //     });
                        //     if (visibleItem) {
                        //         $scope.visibleHeaders.push(visibleItem);
                        //     }
                        // });


                        if($scope.Data.cartableState.filter.displayedColumns && $scope.Data.cartableState.filter.displayedColumns.length){
                            angular.forEach($scope.Data.cartableState.filter.displayedColumns,function (displayedColumn) {
                        		var foundSelectedFromMultiselectOption = _.find($scope.selectFiledCnt.selectedFromMultiselectOptions,function (selectedFromMultiselectOption) {
                        			return selectedFromMultiselectOption.key==displayedColumn;
                        		});
                                if(foundSelectedFromMultiselectOption && !isSort){

                        			$scope.visibleHeaders.push(foundSelectedFromMultiselectOption);
                        		}
                        	});
                        }else{
                        	$scope.controlFn.visibleFields.forEach(function (field) {
                                var visibleItem = _.find($scope.Data.visibleFields, function (item) {
                                    return item.key == field
                                });
                                if (visibleItem && !isSort) {
                                    $scope.visibleHeaders.push(visibleItem);
                                }
                            });
                            $scope.Data.cartableState.visibleHeaders = $scope.visibleHeaders;
                        }


                        for (var h = 0; h < $scope.Data.visibleFields.length; h++) {
                            if ($scope.Data.visibleFields[h].key == 'read' || $scope.Data.visibleFields[h].key == 'content.attachments' || $scope.Data.visibleFields[h].key == 'content.forwarder' || $scope.Data.visibleFields[h].type == 'checkbox2' || $scope.Data.visibleFields[h].type == 'link' || $scope.Data.visibleFields[h].type == 'checkbox3' || $scope.Data.visibleFields[h].type == 'tag'|| $scope.Data.visibleFields[h].type == 'edited' || $scope.Data.visibleFields[h].key == 'letterNumber')
                                $scope.Data.visibleFields[h].display = true;
                            else
                                $scope.Data.visibleFields[h].display = false;
                            if($scope.Data.cartableState.filter.displayedColumns ){
                                for (var j = 0; j < $scope.visibleHeaders.length; j++) {
                                    if ($scope.Data.visibleFields[h].key == $scope.visibleHeaders[j].key) {
                                        $scope.Data.visibleFields[h].display = true;
                                        break;
                                    }
                                }
                            }else{
                               angular.forEach($scope.Data.visibleFields,function(visibleField,visibleFieldIndex){
                                   $scope.Data.visibleFields[visibleFieldIndex].display = true;
                               });
                            }


                        }
                        if (($scope.controlFn.searchQuery.orders && $scope.controlFn.searchQuery.orders.length) || ($scope.Data.cartableState.filter.orders && $scope.Data.cartableState.filter.orders.length)) {
                            for (var i = 0; i < $scope.Data.visibleFields.length; i++) {
                                // $scope.Data.visibleFields[i].asc = false;
                                if($scope.Data.cartableState.filter.orders && $scope.Data.cartableState.filter.orders.length){
                                    for (var j = 0; j < $scope.Data.cartableState.filter.orders.length; j++) {
                                        if ($scope.Data.visibleFields[i].key == $scope.Data.cartableState.filter.orders[j].field) {
                                            if ($scope.Data.cartableState.filter.orders[j].dir == "asc") {
                                                $scope.Data.visibleFields[i].asc = true;
                                                break;
                                            }
                                        }
                                    }
                                }else{
                                    for (var j = 0; j < $scope.controlFn.searchQuery.orders.length; j++) {
                                        if ($scope.Data.visibleFields[i].key == $scope.controlFn.searchQuery.orders[j].field) {
                                            if ($scope.controlFn.searchQuery.orders[j].dir == "asc") {
                                                $scope.Data.visibleFields[i].asc = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    $scope.Data.cartableState.taskType = $scope.controlFn.ctrlData.taskType;
                    angular.forEach($scope.controlFn.listItems, function (item) {
                        angular.forEach($scope.Func.getSelectedItems(), function (selectItem) {
                            if (item.uid == selectItem.uid) {
                                item.selected = true;
                            }
                        });
                    });

                    defer.resolve($scope.controlFn.listItems);
                    if (_.isFunction($scope.controlFn.callHook)) {
                        $scope.controlFn.callHook($scope.Data.cartableState , $scope.controlFn.listItems);
                    }
                    cartableSrvc.setCartableState($scope.Data.cartableState);
                },
                changeOrder: function (field) {
                    if($scope.Data.isLoading){
                        return false;
                    }
                    $scope.Data.isLoading =true;
                    if(field.sortable){
                        field.asc = !field.asc;
                        $scope.controlFn.searchQuery.orders = [{
                            field: field.key,
                            dir: (field.asc ? "asc" : "des"),
                        }];
                        $scope.Data.cartableState.filter.orders = $scope.controlFn.searchQuery.orders;
                        $scope.controlFn.searchableFieldInfo = [field];
                        // angular.forEach($scope.Data.cartableState.filter.orders, function (order) {
                            // if (order.field == "content.forwarder.title") {
                            //     order.field = "content.forwarderTitle";
                            // }
                            // if (order.field == "content.initiation.sender.title") {
                            //     order.field = "content.senderTitle";
                            // }
                        // });
                        $scope.searchMode = true;
                        $scope.Func.getItemsPerCondition().then(function (){
                            $scope.Data.isLoading = false;
                        });
                    }
                },

                /* ******************************** ******************************** */
                onListItemClick: function (item, field, index) {
                    if (field.type != "action" && field.type != "checkbox" && field.type != "checkbox2" && field.type != "checkbox3")
                        $scope.Func.selectItem(item, index);
                },
                selectItem: function (item, index) {
                    if ($scope.Data.selectedItem) {
                        $scope.Data.selectedItem.isSelected = false;
                    }
                    $scope.Data.selectedItem = item;
                    $scope.Data.selectedItem.isSelected = true;
                    $scope.Data.cartableState.filter.orders = $scope.controlFn.searchQuery.orders;
                    cartableSrvc.setCurrentPage($scope.controlFn.currentPage);
                    $scope.Data.cartableState.currentPage = cartableSrvc.getCurrentPage();
                    cartableSrvc.setCartableState($scope.Data.cartableState);
                    $scope.controlFn.onListItemSelect(item.original, index);
                    cartableSrvc.current = $scope.Controller.pagination.currentPage;
                    cartableSrvc.current = $scope.Controller.customPagination.currentPage;
                },
                changeSelectedItems: function (item) {
                    if ($scope.Data.checked[item.uid]) {
                        $scope.controlFn.selectedItems.push(item.original);
                    } else {
                        //Remove from Selected List
                        for (var int = 0; int < $scope.controlFn.selectedItems.length; int++) {
                            if ($scope.controlFn.selectedItems[int].uid == item.uid) {
                                $scope.controlFn.selectedItems.splice(int, 1);
                                break;
                            }
                        }
                    }
                    if ($scope.controlFn.onChangeSelectedList)
                        $scope.controlFn.onChangeSelectedList();
                },
               

                /* ******************************** Auxiliary Functions ******************************** */
                isFirstFetchingList: function () {
                    if (!$scope.Data.selectedItem) {
                        return true;
                    }
                    return false;
                },
                findKeyOnFields: function (keys, fields) {
                    var key = keys.shift();
                    var _field = _.find(fields, function (field) {
                        return (field.key == key || key == 'action');
                    });
                    if (keys.length && _field.fields && _field.fields.length) {
                        return $scope.Func.findKeyOnFields(keys, _field.fields)
                    } else {
                        return _field;
                    }
                },
                getSelectedItems: function () {
                    return cartableSrvc.getSelectedItems();
                }
            };
            $scope.Func.getItems(0, $scope.Controller.customPagination.count);

            $scope.selectFiledCnt = {
                selectedFromMultiselect: [],
                selectedFromMultiselectOptions: [],
                multiSelectTranslate: {
                    buttonDefaultText: 'فیلتر بر اساس',
                    searchPlaceholder: 'جستجو',
                    checkAll: 'انتخاب همه',
                    uncheckAll: 'حذف همه',
                    dynamicButtonTextSuffix: ''
                },
                multiSelectSettings: {
                    externalIdProp: '',
                    displayProp: 'label',
                    enableSearch: false,
                    //scrollableHeight : '200px',
                    scrollable: false,
                    idProp: 'key',
                    showCheckAll: false,
                    showUncheckAll: false
                },
                multiSelectEvents: {
                    onItemSelect: function (field) {
                        $scope.Data.visibleFields.forEach(function (item) {
                            if (item.key == field.key) {
                                item.display = true;
                            }
                        });
                        $scope.Data.cartableState.visibleHeaders = $scope.visibleHeaders;
                        cartableSrvc.setCartableState($scope.Data.cartableState);
                    },
                    onItemDeselect: function (field) {
                        $scope.Data.visibleFields.forEach(function (item) {
                            if (item.key == field.key) {
                                item.display = false;
                            }
                        });
                        $scope.Data.cartableState.visibleHeaders = $scope.visibleHeaders;
                        cartableSrvc.setCartableState($scope.Data.cartableState);
                    }
                }

            };

            /* ******************************** API ******************************** */
            $scope.controlFn.searchQuery = {};
            $scope.controlFn.listItems = [];
            $scope.controlFn.selectedItems = [];
            $scope.controlFn.fieldsInfo = [];
            $scope.controlFn.refreshList = function (searchMode) {
                // $scope.Controller.pagination.currentPage = 1;
                $scope.searchMode = (searchMode == undefined) ? $scope.searchMode : searchMode;
                return $scope.Func.getItemsPerCondition();
            }
            $scope.controlFn.exitSearchMode = function () {
                $scope.searchMode = false;
                $scope.Func.getItemsPerCondition();
            }
            $scope.controlFn.goToPage = function (pageNumber) {
                $location.search(angular.extend($location.search(),{page: pageNumber}));
                $scope.searchMode = false;
                $scope.Controller.pagination.currentPage = pageNumber;
                $scope.Controller.customPagination.currentPage = pageNumber;
                $scope.controlFn.searchQuery.orders = $scope.Data.cartableState.filter.orders;
                return $scope.Func.getItemsPerCondition();
            }

            /* ******************************** RUN ******************************** */
            if (!$scope.controlFn.isDisableInit) {
                $scope.Func.getItemsPerCondition();
            }
            $timeout(function () {
                $scope.Data.cartableState.visibleHeaders = $scope.visibleHeaders;
                cartableSrvc.setCartableState($scope.Data.cartableState);
            }, 1);

        }
    };
});
