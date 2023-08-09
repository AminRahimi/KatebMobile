angular.module('cartableSearch').directive("cartableSearch", function($http) {
	// www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
	return {
		restrict : 'AE',
		templateUrl : "app/lib/vtCartable/directives/vtCartableSearch/cartableSearchTemplate.html",
		scope : {
			controlFn : '=',
            options: '=',
			widget:'@?'
		},
		controller : function($scope, $element,configObj,homeSrvc,$modal) {


			$scope.Data = {
				isSearching:false,
				quickSearchEnabled: configObj.quickSearchEnabled,
				// FIXME:place isMobileView in shared place
				isMobileView: homeSrvc.screenSizeDetector.isMobile()
			};


			// init searchQuery for null pointer preventation
			if (!$scope.controlFn.searchQuery) {
				$scope.controlFn.searchQuery = {};
			}
			// $scope.initCollections = function (field) {
			// 	field.getList = vtCartableSearchSrvc.getWidgetResource(field);
			// }

			$scope.selectFiledCnt = {
				initSelectedList:function(selectedFromMultiselect, showFilterSearchQuery){
					$scope.searchableFieldInfoCp = angular.copy($scope.controlFn.searchableFieldInfo);
                    if (!_.isEmpty(selectedFromMultiselect)) {
                    	if (!_.isEmpty(showFilterSearchQuery)) {
                            $scope.controlFn.searchableFieldInfo = showFilterSearchQuery;
                        }
						$scope.selectFiledCnt.selectedFromMultiselect = selectedFromMultiselect;
                    } else {
						$scope.selectFiledCnt.selectedFromMultiselect = [];

                        $scope.controlFn.searchableFieldInfo = $scope.controlFn.searchableFieldInfo.splice(0, 5);

                        angular.forEach($scope.controlFn.searchableFieldInfo, function (_field, index) {
                            // $scope.initCollections(_field);
                            if (!_field.isHidden) {
                                $scope.selectFiledCnt.selectedFromMultiselect.push(_field);
                            }
                        });
                    }

				},
				selectedFromMultiselect : [],
				multiSelectTranslate : {
					buttonDefaultText : 'فیلتر بر اساس',
					searchPlaceholder : 'جستجو',
					checkAll : 'انتخاب همه',
					uncheckAll : 'حذف همه',
					dynamicButtonTextSuffix : ''
				},
				multiSelectSettings : {
					externalIdProp : '',
					displayProp : 'label',
					enableSearch : false,
					//scrollableHeight : '200px',
					scrollable : false,
					idProp : 'key',
					showCheckAll : false,
					showUncheckAll : false
				},
				multiSelectEvents : {
					onItemSelect : function(fieldInfo) {
						var fullfieldInfo = _.find($scope.controlFn.searchableFieldInfo, function(_field) {
							return _field.key == fieldInfo.key;
						});
						// $scope.initCollections(fieldInfo);
						if(!fullfieldInfo){
							fieldInfo.isHidden = false;
							$scope.controlFn.searchableFieldInfo.push(fieldInfo);
						}else{
							fullfieldInfo.isHidden = false;
						}
					},
					onItemDeselect : function(fieldInfo) {
						var fullfieldInfoOrig = _.find($scope.controlFn.searchableFieldInfo, function(_field) {
							return _field.key == fieldInfo.key;
						});
						fullfieldInfoOrig.isHidden = true;
					}
				}

			}

            $scope.controlFn.initSearchQuery = function(searchQuery) {
                searchQuery = searchQuery || $scope.controlFn.searchQuery;
                if(_.isObject($scope.controlFn.searchQuery)) {
                    var restrictionCp = angular.copy($scope.controlFn.searchQuery.restrictions);
                    //$scope.controlFn.searchQuery.restrictions = [];
                    if(restrictionCp && restrictionCp.length) {
                        restrictionCp.forEach(function (item) {
                            if(item.type == "or" ){
                                if(item.operands.length){
                                    $scope.controlFn.searchQuery[item.operands[0].field] = [];
                                    var filedTemp = item.operands[0].field;
                                    item.operands.forEach(function (operandsItem) {
                                        if(operandsItem.field && operandsItem.field == filedTemp) {
                                            $scope.controlFn.searchQuery[operandsItem.field].push(operandsItem.value);
                                        }
                                        filedTemp = operandsItem.field;
                                    });
                                }
                            }
                        });
                    }
                    //delete $scope.controlFn.searchQuery.restrictions;
                }
                if (!$scope.controlFn.searchQuery) {
                    $scope.controlFn.searchQuery = {};
                } else {
                    for (var index = 0; index < $scope.controlFn.searchableFieldInfo.length; index++) {
                        switch ($scope.controlFn.searchableFieldInfo[index].type) {
                            case "enum":
                                if(!$scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key]){
                                    $scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key] = [];
                                }
                                break;
                            case  "date":
                            case "timestamp":
                                if ($scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key]) {
                                    var dateList = [];
                                    if ($scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key].split) {
                                        dateList = $scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key].split(',');
                                    }
                                    if (dateList.length == 2 && dateList[0] != '')
                                        $scope.controlFn.searchableFieldInfo[index].gtValue = parseInt(dateList[0]);
                                    if (dateList.length == 2 && dateList[1] != '')
                                        $scope.controlFn.searchableFieldInfo[index].ltValue = parseInt(dateList[1]);
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
            };

			// $scope.selectFiledCnt.initSelectedList($scope.options.selectedFromMultiselect, $scope.options.showFilterSearchQuery);
			//TODO: fix this by returning primise
			$scope.controlFn.initSearchFieldInfo = function (selectedFromMultiselect, showFilterSearchQuery, searchQuery) {
				$scope.selectFiledCnt.initSelectedList(selectedFromMultiselect, showFilterSearchQuery);
                $scope.controlFn.initSearchQuery(searchQuery)
			};
            $scope.controlFn.initSearchFieldInfo($scope.options.selectedFromMultiselect, $scope.options.showFilterSearchQuery);
			$scope.controlFn.getSelectedFromMultiselect=function(){
				return $scope.selectFiledCnt.selectedFromMultiselect
			}
			
			$scope.DateTypeCnt = {
				onDropDateClick : function(field) {
					field.tmpGtValue = field.gtValue;
					field.tmpLtValue = field.ltValue;
					field.tmpFromHoure = new Date(field.gtValue).getHours().toString();
					field.tmpToHoure = new Date(field.ltValue).getHours().toString();
					field.tmpFromMinute = new Date(field.gtValue).getMinutes().toString();
					field.tmpToMinute = new Date(field.ltValue).getMinutes().toString();
				},
				onInitDateInterval : function() {
					$($element).find(".dropdown-menu").click(function(event) {
						event.stopPropagation();
					});
				},
				onSaveClick : function(field) {
					if(angular.isNumber(field.tmpGtValue) || angular.isDate(field.tmpGtValue)){
						field.gtValue = field.tmpGtValue;
						if (field.tmpFromHoure >= 0) {
							field.gtValue = new Date(field.gtValue).setHours(field.tmpFromHoure);
						}

						if (field.tmpFromMinute >= 0) {
							field.gtValue = new Date(field.gtValue).setMinutes(field.tmpFromMinute);
						}
					}
					
					if(angular.isNumber(field.tmpLtValue) || angular.isDate(field.tmpLtValue)){
						field.ltValue = field.tmpLtValue;
						if (field.tmpToHoure >= 0) {
							field.ltValue = new Date(field.ltValue).setHours(field.tmpToHoure);
						}
						if (field.tmpToMinute >= 0) {
							field.ltValue = new Date(field.ltValue).setMinutes(field.tmpToMinute);
						}	
					}
				}
			}

			$scope.onNewSearchClick = function () {
                return $scope.onSearchClick(isNewSearch = true);
			};


			$scope.onSearchClick = function(isNewSearch) {
				if($scope.Data.isSearching){
					return false;
				}
				$scope.Data.isSearching =true;
				for (var index = 0; index < $scope.controlFn.searchableFieldInfo.length; index++) {
                    switch ($scope.controlFn.searchableFieldInfo[index].type) {
                        case "fTDate":
                            var from = "";var to = "";
                            if($scope.controlFn.searchableFieldInfo[index].gtValue) {
                                $scope.controlFn.searchableFieldInfo[index].gtValue.setHours(0, 0, 0, 0);
                                from = Date.parse($scope.controlFn.searchableFieldInfo[index].gtValue);
                            }
                            if($scope.controlFn.searchableFieldInfo[index].ltValue) {
                                $scope.controlFn.searchableFieldInfo[index].ltValue.setHours(23, 59, 59, 999);
                                to = Date.parse($scope.controlFn.searchableFieldInfo[index].ltValue);
                            }
                            if(from!="" || to!="")
                                $scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key] = from + "," + to;
                            break;
                        default:
                            break;
                    }
                    if ($scope.controlFn.searchableFieldInfo[index].isHidden)
                        delete $scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key];
                }
				$scope.controlFn.onSearchClick($scope.controlFn.advanced, $scope.selectFiledCnt.selectedFromMultiselect,
					$scope.controlFn.searchableFieldInfo, isNewSearch).then(function (){
						$scope.Data.isSearching =false;
				});
			};
			$scope.onExitSearchModeClick = function() {
				for (var index = 0; index < $scope.controlFn.searchableFieldInfo.length; index++) {
					switch ($scope.controlFn.searchableFieldInfo[index].type) {
						case "bool":
						case "multi_like":
						case "fastSearch":
							$scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key] = undefined;
							break;
						case "enum":
						case "date":
						case "tagInput":
						case "timestamp":
						case "collection":
						case "fTDate":
							$scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key] = [];
							$scope.controlFn.searchableFieldInfo[index].gtValue = undefined;
							$scope.controlFn.searchableFieldInfo[index].ltValue = undefined;
							break;
						default:
							$scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key] = {};
						break;
					}
				}
				$scope.controlFn.onExitSearchModeClick();
			};
			
			$scope.controlFn.exitSearchApi = function() {
				$scope.onExitSearchModeClick();
			}


			$scope.onOpenSearchModalClick = function(){
				var modalInstance = $modal.open({
					templateUrl : 'cartable-search-modal-template.html',
					controller : 'cartableSearchModalCtrl',
					resolve : {
						controlFn : function() {
							return $scope.controlFn
						},
						options : function() {
							return $scope.options
						}
					}
				});
				modalInstance.result.then(function(result) {
					if(!result) return

					if(result==='onSearchClick'){
						$scope.onSearchClick();
					}

					if(result==='onExitSearchModeClick'){
						$scope.onExitSearchModeClick();
					}


				});
			}
		},
		link : function(scope, element, attrs, ctrls) {

		}
	};
});
