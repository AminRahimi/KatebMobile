angular.module('vtGrid', []).directive("vtGrid", function($http) {
//www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
 return {
		restrict : 'AE',
		// templateUrl : 'app/lib/vtCommon/vtGrid/gridTemplateHelp.html',
	 template:
		"<div class=\"form-group\">"+
    	"	<p class=\"help-block\" ng-show=\"((Controller.pagination.totalItems!=-1 && controlFn.listItems.length==0) || (!controlFn.listItems.length>0 && Controller.customPagination.choices)) && (!controlFn.isLoading)\">موردی یافت نشد.<\/p>"+
    	"	<table class=\"table table-striped table-hover col-sm-12 all-letters\" ng-show=\"controlFn.listItems.length>0\">"+
    	"		<thead>"+
    	"		<tr>"+
    	"			<th class=\"listDirectiveTh {{field.class}}\" style=\"color: #666666\" ng-repeat=\"field in Data.visibleFields\" ng-click=\"Func.changeOrder(field)\" ng-style=\"{'width':field.width,'text-align':field.textAlign}\">"+
    	"				<div class=\"ng-hide\" ng-show=\"field.sortable && controlFn.showSort\">"+
    	"					<span class=\"caret\" ng-hide=\"field.asc\"><\/span>"+
    	"				<i ng-if=\"$last\" class=\"fa fa-refresh fa-lg pull-left\" ng-click=\"controlFn.refreshList()\" style=\"cursor:pointer;padding-top:3px;\"><\/i>"+
    	"					<span class=\"caret\" style=\"transform: rotate(180deg);\" ng-show=\"field.asc\"><\/span>"+
    	"				<\/div>"+
    	"				<div >{{field.label}}<\/div>"+
    	"			<\/th>"+
    	"		<\/tr>"+
    	"		<\/thead>"+
    	"		<tbody>"+
    	"		<tr ng-repeat=\"item in controlFn.listItems\" class='{{controlFn.setRowClass(item)}}'" +
	"				ng-class=\"{'selected':item.isSelected}\" style=\"cursor: pointer; cursor: hand; color: #666666\">"+
    	"			<td ng-repeat=\"field in Data.visibleFields\" ng-switch on=\"field.type\" ng-click=\"Func.onListItemClick(item, field, $parent.$index)\" ng-dblclick='Func.onListItemClick(item, field, $parent.$index, true)' class=\"listDirectiveTd\" " +
									">"+
    	"				<span ng-switch-when=\"string\" ng-bind=\"item[field.key]|EnToFaNumber|splitString:field.strSize?field.strSize:'60'\" tooltip-append-to-body=\"true\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"top\" tooltip=\"{{item[field.key]}}\" tooltip-popup-delay=\"500\" ng-if=\"item[field.key].length>=60\">{{}}<\/span>"+
    	""+
    	"				<span ng-switch-when=\"string\" ng-bind=\"item[field.key]|EnToFaNumber|splitString:field.strSize?field.strSize:'60'\" ng-if=\"60>item[field.key].length\"><\/span>"+	""+
		 "				<span ng-switch-when=\"stringArray\" ng-bind=\"item[field.key]|EnToFaNumber|splitString:field.strSize?field.strSize:'60'\" ng-if=\"Func.lenCalculator(item[field.key])>=60\" tooltip-append-to-body=\"true\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"top\" tooltip=\"{{item[field.key]}}\" tooltip-popup-delay=\"500\" ><\/span>" +
		 	""+
    	"				<span ng-switch-when=\"stringArray\" ng-bind=\"item[field.key]|EnToFaNumber|splitString:field.strSize?field.strSize:'60'\" ng-if=\"60>Func.lenCalculator(item[field.key])\"><\/span>"+	""+
    	"				<span ng-switch-when=\"checkbox\"><input type=\"checkbox\" ng-model=\"Data.checked[item.uid]\" ng-change=\"Func.changeSelectedItems(item)\" ><\/span>"+
    	"				<span ng-switch-when=\"checkbox2\"><input type=\"checkbox\" ng-model=\"item.selected\" ng-click=\"field.action(item,$event,item.selected)\" ><\/span>"+
    	"				<span ng-switch-when=\"int\">{{item[field.key]|EnToFaNumber}}<\/span>"+
    	"				<span ng-switch-when=\"date\">{{item[field.key]|tehranDate:field.format|EnToFaNumber}}<\/span>"+
		"				<span ng-switch-when=\"timestamp\">{{item[field.key]|tehranDate:field.format|EnToFaNumber}}<\/span>"+
			"				<span ng-switch-when=\"tag\"><span ng-repeat=\"tag in item[field.key]\" class=\"label-blue\">{{tag.title}}<\/span><\/span> " +
			"				<span ng-switch-when=\"edited\"><span ng-show=\"item[field.key]\" class=\"label label-warning\">ویرایش شده<\/span><\/span> "+
    	"				<span ng-switch-when=\"bool\">"+
    	"			<span ng-show=\"item[field.key]\" class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"><\/span>"+
    	"          <span ng-hide=\"item[field.key]\" class=\"flaticon-close-button\" aria-hidden=\"true\"><\/span>"+
    	"          <\/span>"+
    	"				<span ng-switch-when=\"boolean\">"+
    	"			<span ng-show=\"item[field.key]\" class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"><\/span>"+
    	"          <span ng-hide=\"item[field.key]\" class=\"flaticon-close-button\" aria-hidden=\"true\"><\/span>"+
    	"          <\/span>"+
    	"				<span ng-switch-when=\"img\">"+
    	"			<span ng-show=\"field.if\" ng-class=\"{'{{field.trueIcon}}':field.trueIcon}\" aria-hidden=\"true\"><\/span>"+
    	"          <span ng-hide=\"field.if\" ng-class=\"{'{{field.falseIcon}}':field.falseIcon}\" aria-hidden=\"true\"><\/span>"+
    	"          <\/span>"+
    	"				<span ng-switch-when=\"enum\">{{item[field.key]|appEnum:field.filter}}<\/span>"+
    	"				<span ng-switch-when=\"action\" ng-hide='field.isHidden(item)'>"+
    	"		<div type=\"button\""+
    	"             ng-click=\"field.action(item,$event, $parent.$parent.$index)\""+
    	"             ng-hide=\"(field.showCondition && !item[field.valueShouldHave]) || (field.showConditionArr && !item[field.valueShouldHave].length)\""+
    	"             ng-class=\"{'{{field.icon}}':field.icon, '{{btn}}' : !field.icon, '{{btn-default}}': !field.icon}\""+
    	"             style=\"cursor: pointer;\">{{field.actionName}}<\/div>"+
    	"		<\/span>"+
    	"				<span ng-switch-when=\"actionList\">"+
    	"		<button class=\"btn btn-default\" type=\"button\""+
    	"				ng-repeat=\"btn in field.actionList\""+
    	"				ng-click=\"btn.action(item,$event)\""+
    	"				ng-class=\"{'{{btn.icon}}':btn.icon}\""+
    	"				style=\"cursor: pointer;\"><\/button>"+
    	"		<\/span>"+
    	"				<span ng-switch-when=\"collection\">"+
    	"		<span>{{item[field.key][0].title}}, {{item[field.key][1].title}} ...<\/span>"+
    	"          <\/span>"+
    	"	<span ng-switch-when=\"actionLongList\">"+
    	"		<div class=\"dropdown\" ng-switch-when=\"action\">"+
    	"				<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"dropdownMenu1\" aria-expanded=\"true\">"+
    	"					عملیات"+
    	"					<span class=\"caret\"><\/span>"+
    	"          <\/button>"+
    	"          <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenu1\">"+
    	"            <li role=\"presentation\" ng-repeat=\"action in field.actionList\">"+
    	"              <a role=\"menuitem\" tabindex=\"-1\" ng-click=\"action.action(item,$event)\">{{action.name}}<\/a>"+
    	"            <\/li>"+
    	"          <\/ul>"+
    	"		<\/div>"+
    	"	<\/span>"+
    	"                <span ng-switch-when=\"link\" ng-click=\"field.action(item,$event,item.selected)\"><i class='glyphicon glyphicon-link'><\/i><\/span>"+
    	"				<span ng-switch-default>{{item[field.key]|EnToFaNumber|splitString:40}}<\/span>"+
    	"			<\/td>"+
    	"		<\/tr>"+
    	"		<\/tbody>"+
    	"	<\/table>"+
    	"<\/div>"+
    	"<!--pagination ng-show=\"!Controller.pagination.inOnePage()\" total-items=\"Controller.pagination.totalItems\" ng-model=\"Controller.pagination.currentPage\" max-size=\"Controller.pagination.maxSize\" items-per-page=\"Controller.pagination.perPage\" ng-change=\"Controller.pagination.pageChanged()\""+
    	"			class=\"pagination-sm\" boundary-links=\"true\" first-text=\"ابتدا\" last-text=\"انتها\" next-text=\"بعدی\" previous-text=\"قبلی\">"+
    	"<\/pagination>"+
    	"<span class=\"total-items-pagination\" ng-show=\"!Controller.pagination.inOnePage()\">تعداد کل : {{Controller.pagination.totalItems|EnToFaNumber}}<\/span>-->"+
    	""+
    	"<div ng-show=\"controlFn.listItems.length>0\" class=\"col-sm-12\">"+
    	"	<pagination ng-if=\"!Controller.customPagination.choices && !Controller.pagination.inOnePage()\""+
    	"				total-items=\"Controller.pagination.totalItems\""+
    	"				ng-model=\"Controller.pagination.currentPage\" max-size=\"Controller.pagination.maxSize\" items-per-page=\"Controller.pagination.perPage\" ng-change=\"Controller.pagination.pageChanged() \""+
    	"				class=\"pagination-sm\" ng-disabled=\"Data.isLoading\"  boundary-links=\"true\" first-text=\"ابتدا\" last-text=\"انتها\" next-text=\"بعدی\" previous-text=\"قبلی\">"+
    	"	<\/pagination>"+
    	""+
    	"	<pagination ng-if=\"Controller.customPagination.choices\""+
    	"				total-items=\"Controller.customPagination.totalItems\""+
    	"				ng-model=\"Controller.customPagination.currentPage\" max-size=\"Controller.customPagination.maxSize\" items-per-page=\"Controller.customPagination.count\" ng-change=\"Controller.customPagination.change()\""+
    	"				class=\"pagination-sm\" ng-disabled=\"Data.isLoading\"  boundary-links=\"true\" first-text=\"ابتدا\" last-text=\"انتها\" next-text=\"بعدی\" previous-text=\"قبلی\">"+
    	"	<\/pagination>"+
    	""+
    	"	<div id=\"custom-pagination-container\" ng-if=\"controlFn.listItems.length>0 && Controller.customPagination.choices\">"+
    	"		<label id=\"custom-pagination-label\" class=\"col-sm-1 text-left\">نمایش<\/label>"+
    	"		<div class=\"col-sm-8 vtSelect\">"+
    	"			<select id=\"custom-pagination-select\" class=\"col-sm-9\" ng-model=\"Controller.customPagination.count\""+
    	"					ng-change=\"Controller.customPagination.change()\" ng-options=\"(itemsCount|EnToFaNumber) for itemsCount in Controller.customPagination.choices track by itemsCount\">"+
    	"			<\/select>"+
    	"			<i id=\"custom-pagination-arrow\" class=\"fa-btn flaticon-arrows-3\"><\/i>"+
    	"		<\/div>"+
    	"	<\/div>"+
    	""+
    	"	<span ng-if=\"!Controller.customPagination.choices\" class=\"total-items-pagination\" ng-hide=\"options.hideTotalCount\">تعداد کل"+
    	"		: {{Controller.pagination.totalItems|EnToFaNumber}}<\/span>"+
    	""+
    	"	<span ng-if=\"Controller.customPagination.choices\" class=\"custom-pagination-total-items\" ng-hide=\"options.hideTotalCount\">تعداد کل"+
    	"		: {{Controller.customPagination.totalItems|EnToFaNumber}}<\/span>"+
    	"<\/div>",

    scope : {
		controlFn: '=',
		options: '=?'
		},
		controller : function($scope, $element, $attrs, $injector ,$q, vtSearchSrvc, cartableSrvc, $timeout,cartableKatebSrvc, $location,$sce) {

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
				getItemsPerCondition: function(){
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
						return $scope.Func.search(query,start,pageLen).then(function (data){
							$scope.Data.isLoading=false;
							return data;
						});
					}else{
						return $scope.Func.getItems(start, pageLen).then(function (data){
							$scope.Data.isLoading=false;
							return data;
						});
					}
				},
				search: function(query, start, len){
					$scope.searchMode = true;
					var defer = $q.defer();
					if ($scope.controlFn.searchFunction) {
						//(len +1)=> get one more  for handling that next page is exist or not
						$scope.controlFn.searchFunction(query, start, len+1).then(function(response) {
							$scope.Func.processListResponse(response, defer,start, len);
						});
					}
					else{
						defer.reject();
					}
					return defer.promise;
				},
				getItems: function(start, len, field) {
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
								$scope.Func.processListResponse(response, defer,start, len);
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
				processListResponse: function(response, defer,start, len){
					
					$scope.Func.handlePagination(response.data,start, len)

					
					if(response.data.length > len){
						// remove on added for detecting that next page is exist
						response.data.pop();
					}


					$scope.controlFn.listItems = response.data;

					$scope.controlFn.fieldsInfo = response.data.fields;
					$scope.Data.visibleFields = [];
					//Backup Original Data
					_.each($scope.controlFn.listItems, function(item) {
						item.original = angular.copy(item);
					});
					//Create Header of Table
					_.each($scope.controlFn.headers, function(header) {
						if (header.key && $scope.controlFn.listItems.fields) {
							var fieldOfKey = _.find($scope.controlFn.listItems.fields, function(field) {
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

			//$scope.Func.getItems(0, $scope.Controller.customPagination.count);

			$scope.Controller = {
				pagination: {
					totalItems : -1,
					currentPage : cartableSrvc.getCurrentPage(),
					perPage : ($scope.controlFn.pageSize ? $scope.controlFn.pageSize : 10),
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
					count : parseInt(localStorage.getItem('customPagination')) || 10,
					maxSize : 5,
					totalPages: 1,
					change : function() {
						localStorage.setItem('customPagination', $scope.Controller.customPagination.count);
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


		},
		link : function(scope, element, attrs, ctrls) {

		}
	};
});
