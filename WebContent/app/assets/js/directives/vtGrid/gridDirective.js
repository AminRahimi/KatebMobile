angular.module('vtGrid', []).directive("vtGrid", function($http) {
//www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
 return {
	restrict : 'AE',
	templateUrl : 'app/assets/js/directives/vtGrid/gridTemplate.html',
    scope : {
		controlFn: '=',
		options: '=?'
		},
		controller : function($scope, $element, $attrs, $injector ,$q, vtSearchSrvc, cartableSrvc, $timeout,cartableKatebSrvc, $location,$sce,Restangular) {

            $scope.controlFn.options = $scope.controlFn.options || {};
			$scope.controlFn.options.customPagination = $scope.controlFn.options.customPagination || [10, 20, 50];
			
			$scope.Data = {
				selectedItem : null,
				visibleFields: [],
				checked: {},
				isLoading:false
			}

			$scope.Func = { 
				/* ******************************** Main Functions ******************************** */
				activateInfinitScroll:function (){
                    const observer = new IntersectionObserver((entries, observer) => {
                        // Loop through the entries
                        for (const entry of entries) {
                            // Check if the entry is intersecting the viewport
                            if (entry.isIntersecting) {
                                // Load more content
                                $scope.Func.loadMore();
                            }
                        }
                    });

                    const scrollSentinel = $($element).find('.scroll-sentinel')[0];

                    observer.observe(scrollSentinel);
                },
                loadMore: function (){
                    if($scope.Data.isLoading){
                        return false;
                    }
                    if(!$scope.Controller.customPagination.choices) {
                        $scope.Controller.pagination.currentPage++;
                    }else{
                        $scope.Controller.customPagination.currentPage++;
                    }
                    $scope.Data.isLoading = true;
                    try {
                        return $scope.Func.getItemsPerCondition(true);
                    } catch (e) {

                    } finally {
                        $scope.Data.isLoading = false;
                    }

                },








				getItemsPerCondition: function(isInfinityScrollOrigin){
					$scope.Data.isLoading=true;

					var start, pageLen;

					if(!$scope.Controller.customPagination.choices) {
						$scope.controlFn.currentPage = $scope.Controller.pagination.currentPage;
						start = (parseInt($scope.Controller.pagination.currentPage) - 1) * $scope.Controller.pagination.perPage;
						pageLen = $scope.Controller.pagination.perPage;
					}
					else {
						$scope.controlFn.currentPage = $scope.Controller.customPagination.currentPage;
						start = (parseInt($scope.Controller.customPagination.currentPage) - 1) * $scope.Controller.customPagination.count;
						pageLen = $scope.Controller.customPagination.count;
					}


					if($scope.searchMode){
						var query = vtSearchSrvc.createSearchQuery($scope.controlFn.searchQuery, $scope.controlFn.searchableFieldInfo);
						return $scope.Func.search(query,start,pageLen,isInfinityScrollOrigin).then(function (data){
							$scope.Data.isLoading=false;
							return data;
						});
					}else{
						return $scope.Func.getItems(start, pageLen,null,isInfinityScrollOrigin).then(function (data){
							$scope.Data.isLoading=false;
							return data;
						});
					}
				},
				search: function(query, start, len,isInfinityScrollOrigin){
					$scope.searchMode = true;
					var defer = $q.defer();
					if ($scope.controlFn.searchFunction) {
						//(len +1)=> get one more  for handling that next page is exist or not
						$scope.controlFn.searchFunction(query, start, len+1).then(function(response) {
							$scope.Func.processListResponse(response, defer,start, len,isInfinityScrollOrigin);
						});
					}
					else{
						defer.reject();
					}
					return defer.promise;
				},
				getItems: function(start, len, field,isInfinityScrollOrigin) {
					var defer = $q.defer();
					$scope.controlFn.isLoading = true;
					if ($scope.controlFn.getList) {
						var query = "";
						if(field){
							if (field.key == "field") query = "sortNumber=" + field.asc
						}
						$timeout(function () {
							//(len +1)=> get one more  for handling that next page is exist or not
							$scope.controlFn.getList(start, len+1, query).then(function(response) {
								$scope.Func.processListResponse(response, defer,start, len,isInfinityScrollOrigin);
								$scope.controlFn.isLoading = false;		
							}, function () {
								$scope.controlFn.isLoading = false;	
						});
						},100)
					}else{
						defer.reject();
					}
					return defer.promise;
				},
				isServerNotCalcTotalCount: function (list,start) {
					return list.totalCount===0 && (list.length>0 || start>0)
				},

				handlePagination: function(list,start, len){
					var totalItemsHandlerOnPagination = function(totalItems){
						totalItems = start + list.length
						return totalItems;
					}
					var isServerNotCalcTotalCount = $scope.Func.isServerNotCalcTotalCount(list,start);
					var showHidePaginationButtons=function(isServerNotCalcTotalCount){
						if(isServerNotCalcTotalCount){
							$($element).find('.pagination-last').hide();
							$($element).find('.custom-pagination-total-items').hide();
							$($element).find('.total-items-pagination').hide();
							
							$scope.Controller.pagination.maxSize = $scope.Controller.customPagination.maxSize = 1;
						}else{
							$($element).find('.pagination-last').show();
							$($element).find('.custom-pagination-total-items').show();
							$($element).find('.total-items-pagination').show();
							
							$scope.Controller.pagination.maxSize = $scope.Controller.customPagination.maxSize = 5;
						}
					}

					showHidePaginationButtons(isServerNotCalcTotalCount);
					
					
					if(!$scope.Controller.customPagination.choices) {
						$scope.Controller.pagination.totalItems = isServerNotCalcTotalCount?totalItemsHandlerOnPagination($scope.Controller.pagination.totalItems): list.totalCount;
					}
					else {
						$scope.Controller.customPagination.totalItems = isServerNotCalcTotalCount?totalItemsHandlerOnPagination($scope.Controller.customPagination.totalItems): list.totalCount;
					}
				},
				processListResponse: function(response, defer,start, len,isInfinityScrollOrigin){
					
					$scope.Func.handlePagination(response.data,start, len)

					
					if(response.data.length > len){
						// remove on added for detecting that next page is exist
						response.data.pop();
					}


					if(isInfinityScrollOrigin){
                        $scope.controlFn.listItems = $scope.controlFn.listItems || [];
                        $scope.controlFn.listItems = $scope.controlFn.listItems.concat(Restangular.stripRestangular(response.data));
                    }else{
                        $scope.controlFn.listItems = Restangular.stripRestangular(response.data);
                    }


					

					$scope.controlFn.fieldsInfo = response.data.fields;
					$scope.Data.visibleFields = [];
					//Backup Original Data
					_.each($scope.controlFn.listItems, function(item) {
						item.original = angular.copy(item);
					});
					//Create Header of Table

					let headers = $scope.options && $scope.options.isMobleView ? $scope.controlFn.headers.mobile:$scope.controlFn.headers.desktop
					_.each(headers, function(header) {
						if (header.key && $scope.controlFn.fieldsInfo) {
							var fieldOfKey = _.find($scope.controlFn.fieldsInfo, function(field) {
								return field.key == header.key;
							});
							if (!fieldOfKey) {
								var keys = header.key.split(".")
								fieldOfKey = $scope.Func.findKeyOnFields(keys, $scope.controlFn.fieldsInfo);
							}
							if ( (fieldOfKey.type == 'date' || fieldOfKey.type == 'timestamp') && header.format == undefined) {
								header.format = 'jDD-jMMMM-jYYYY';
							}
							$scope.Data.visibleFields.push(angular.extend(fieldOfKey, header));
						} else {
							$scope.Data.visibleFields.push(header);
						}
					});
					//Support Nested Objects
					_.each($scope.controlFn.listItems, function(item) {
						if (!$scope.Func.isFirstFetchingList && item.uid === $scope.Data.selectedItem.uid) {
							$scope.Func.selectItem(item);
						}
						_.each($scope.Data.visibleFields, function(field) {
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
					
					if ($scope.controlFn.searchQuery.orders && $scope.controlFn.searchQuery.orders.length) {
						for (var i = 0; i < $scope.Data.visibleFields.length; i++) {
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

					defer.resolve($scope.controlFn.listItems);
					if(_.isFunction($scope.controlFn.callHook)){
						$scope.controlFn.callHook($scope.controlFn.listItems);
					}
				},
				changeOrder: function (field) {
					if($scope.Data.isLoading){
						return false;
					}
					$scope.Data.isLoading=true;
					if(field.sortable && $scope.controlFn.showSort){
						field.asc = !field.asc;
						$scope.controlFn.searchQuery.orders = [{
							field: field.key,
							dir: (field.asc ? "asc" : "des"),
						}];
						$scope.searchMode = false;
						cartableKatebSrvc.setQuery(field);
						$scope.Func.getItemsPerCondition().then(function (){
							$scope.Data.isLoading=false;
						});
						if ($scope.controlFn.restrictionSort) {
							$scope.Func.onSort(field);
						}

					}
				},
				onSort: function (field) {
						if (field.asc) $scope.controlFn.onSortClick(field,"asc");
							else  $scope.controlFn.onSortClick(field,"desc");
					},
				
				/* ******************************** ******************************** */
				onListItemClick: function(item, field, index, isDblClick) {
					if(field.type!="action" && field.type!="checkbox")
						$scope.Func.selectItem(item, index, isDblClick);
				},
				selectItem: function(item, index, isDblClick) {
					if ($scope.Data.selectedItem) {
						$scope.Data.selectedItem.isSelected = false;
					}
					$scope.Data.selectedItem = item;
					$scope.Data.selectedItem.isSelected = true;
					if (isDblClick && angular.isFunction($scope.controlFn.onListItemDblSelect)) {
						$scope.controlFn.onListItemDblSelect(item.original, index);
					} else {
						$scope.controlFn.onListItemSelect(item.original, index);
					}
				},
				changeSelectedItems: function(item){
					if($scope.Data.checked[item.uid]){
						$scope.controlFn.selectedItems.push(item.original);
					}else{
						//Remove from Selected List
						for ( var int = 0; int < $scope.controlFn.selectedItems.length; int++) {
							if($scope.controlFn.selectedItems[int].uid==item.uid){
								$scope.controlFn.selectedItems.splice(int, 1);
								break;
							}
						}
					}
					if($scope.controlFn.onChangeSelectedList)
						$scope.controlFn.onChangeSelectedList();
				},
				resetSelectedItems: function(){
                	$scope.Data.checked = {};
                	$scope.controlFn.selectedItems = [];
                },
				
				/* ******************************** Auxiliary Functions ******************************** */
				isFirstFetchingList: function() {
					if (!$scope.Data.selectedItem) {
						return true;
					}
					return false;
				},
				findKeyOnFields: function(keys, fields) {
					var key = keys.shift();
					var _field = _.find(fields, function(field) {
						return (field.key == key || key=='action');
					});
					if (keys.length && _field.fields && _field.fields.length) {
						return $scope.Func.findKeyOnFields(keys, _field.fields)
					} else {
						return _field;
					}
				},
				lenCalculator: function (array) {
					var len = 0;
					angular.forEach(array, function (object) {
						len = len +object.length
					})
					return len;
				}
			}


			$scope.Controller = {
				pagination: {
					totalItems : -1,
					currentPage : cartableSrvc.getCurrentPage(),
					perPage : ($scope.controlFn.pageSize ? $scope.controlFn.pageSize : $scope.options.isMobileView? 20: 10 ),
					maxSize : 5,
					inOnePage: function(){
						if ($scope.Controller.pagination.totalItems <= $scope.Controller.pagination.perPage)
							return true;
						return false;
					},
					pageChanged: function(){
						$scope.Func.getItemsPerCondition();
					}
				},
				/**
				 * customPagination object which will be used, if we have custom pagination defined.
				 * @prop choices: By setting customPagination of options of controlFn, we indicate that grid can have custom pagination.
				 */
				customPagination: {
					choices: $scope.controlFn.options.customPagination,
					totalItems : -1,
					currentPage : 1,
					count : ($scope.controlFn.pageSize ? $scope.controlFn.pageSize : $scope.options.isMobileView? 20: 10 ),
					maxSize : 5,
					totalPages: 1,
					change : function() {
						$scope.Controller.customPagination.totalPages =  Math.ceil($scope.Controller.customPagination.totalItems/$scope.Controller.customPagination.count);
						return $scope.Func.getItemsPerCondition();
					}
				}
			};


			/* ******************************** API ******************************** */
			$scope.controlFn.searchQuery = {};
			$scope.controlFn.listItems = [];
			$scope.controlFn.selectedItems = [];
			$scope.controlFn.fieldsInfo = [];
			$scope.controlFn.resetSelectedItems = $scope.Func.resetSelectedItems;
			$scope.controlFn.refreshList = function(searchMode) {

				if(!$scope.Controller.customPagination.choices)
					$scope.Controller.pagination.currentPage = 1;
				// else
				// 	$scope.Controller.customPagination.currentPage = 1;

				$scope.searchMode = (searchMode==undefined)?$scope.searchMode:searchMode;
				return $scope.Func.getItemsPerCondition();
			}
			$scope.controlFn.exitSearchMode = function(){
				$scope.searchMode = false;

				if(!$scope.Controller.customPagination.choices)
					$scope.Controller.pagination.currentPage = 1;
				else
					$scope.Controller.customPagination.currentPage = 1;

				$scope.Func.getItemsPerCondition();
			}
			$scope.controlFn.goToPage = function(pageNumber) {

				if(!$scope.Controller.customPagination.choices)
					$scope.Controller.pagination.currentPage = pageNumber;
				else
					$scope.Controller.customPagination.currentPage = pageNumber;

				return $scope.Func.getItemsPerCondition();
			}
			
			/* ******************************** RUN ******************************** */
			if(!$scope.controlFn.isDisableInit) {
				$scope.Func.getItemsPerCondition();
			}

			if (typeof $scope.controlFn.onReady === "function")
                $scope.controlFn.onReady();


			if($scope.options && $scope.options.infinitScroll){
				$scope.Func.activateInfinitScroll();
			}


		},
		link : function(scope, element, attrs, ctrls) {

		}
	};
});
