angular.module('vtSearch').directive("vtSearch", function($http) {
//www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
 return {
			restrict : 'AE',
			template :
			"<div class=\"row\" ng-if=\"!controlFn.advanced\">"
			+"<div class=\"col-sm-10\">"
			+"	<div ng-repeat=\"field in controlFn.searchableFieldInfo\""
			+"		ng-switch on=\"field.type\" >"
			+"		"
			+"		<div class=\"col-sm-2 searchFilterBox string-width\" ng-switch-when=\"string\">"
			+"			<input type=\"text\" class=\"form-control search-input\" name=\"{{field.key}}\" "
			+"				ui-keypress=\"{13:'onSearchClick()'}\" ng-hide=\"controlFn.displayName\"" 
			+ "				ng-model=\"controlFn.searchQuery[field.key]\" placeholder=\"{{field.label}}\">"
			+"			<input type=\"text\" class=\"form-control search-input\" name=\"{{field.key}}\" ng-if=\"controlFn.displayName\" "
			+"				ui-keypress=\"{13:'onSearchClick()'}\" ng-disabled=\"controlFn.searchQuery.externalOrganizationMember\"" 
			+ "				ng-model=\"controlFn.searchQuery[field.key]\" placeholder=\"{{field.label}}\">"
			+ "		<\/div>"
			+"		<div class=\"col-sm-2 searchFilterBox\" ng-switch-when=\"dispalyName\">"
			+"			<input type=\"text\" class=\"form-control search-input\" name=\"{{field.key}}\""
			+"				ui-keypress=\"{13:'onSearchClick()'}\"" 
			+"				ng-model=\"controlFn.searchQuery[field.key]\" ng-disabled=\"controlFn.searchQuery.title\" placeholder=\"{{field.label}}\">"
			+ "		<\/div>"
			+"<div class=\"col-sm-2 searchFilterBox\" ng-switch-when=\"multiSelectReciever\">\n" +
			"                <div dropdown class=\"dropdown form-control search-input\" is-open=\"Data.isOpenDeliveryDropdown\" auto-close=\"outsideClick\">\n" +
			"                    <span class=\"model-length\"\n" +
			"                        ng-if=\"controlFn.searchQuery[field.key].length\">{{controlFn.searchQuery[field.key].length|EnToFaNumber}}</span>\n" +
			"                    <div id=\"single-button\" dropdown-toggle>{{field.label}} <i class=\"fa-btn glyphicon glyphicon-chevron-down\"></i></div>\n" +
			"                    <ul class=\"tag-popup dropdown-menu\" role=\"menu\" aria-labelledby=\"single-button\" style=\"padding: 8px;\">\n" +
			"                        <li>\n" +
			"                            <multiselect-reciever model=\"controlFn.searchQuery[field.key]\"\n" +
			"                                search-fn=\"field.searchFn(query)\"\n" +
			"                                ng-model=\"controlFn.searchQuery[field.key]\" name=\"reciever\" vt-array-required\n" +
			"                                is-edit-mode=\"true\">\n" +
			"                            </multiselect-reciever>\n" +
			"                        </li>\n" +
			"                    </ul>\n" +
			"\n" +
			"                </div>\n" +
			"        </div>"
			+"		<div class=\"col-sm-2 searchFilterBox\" ng-switch-when=\"integer\">"
			+"			<input type=\"number\" class=\"form-control search-input\" name=\"{{field.key}}\""
			+"				ui-keypress=\"{13:'onSearchClick()'}\""
			+"				ng-model=\"controlFn.searchQuery[field.key]\" placeholder=\"{{field.label}}\">"
			+"		<\/div>"
			+"		<div class=\"col-sm-6 searchFilterBox date-css\" ng-switch-when=\"date\">"
			+"			<div class=\"col-sm-6 date\">"
			+"				<label class=\"col-sm-1 from-to-label\">از<\/label>"
			+"				<vt-persian-date-picker name=\"creationDate_from_{{$index}}\" class=\"col-sm-10\""
			+"					model=\"field.gtValue\"><\/vt-persian-date-picker>"
			+"			<\/div>"
			+"			<div class=\"col-sm-6 date\">"
			+"				<label class=\"col-sm-1 from-to-label\">تا<\/label>"
			+"				<vt-persian-date-picker name=\"creationDate_to_{{$index}}\" class=\"col-sm-10\""
			+"					model=\"field.ltValue\" max-date=\"field.maxDate(field.gtValue)\" min-date=\"field.gtValue\"><\/vt-persian-date-picker>"
			+"			<\/div>"
			+"		<\/div>"
			+"		<div class=\"col-sm-6 searchFilterBox\" ng-switch-when=\"timestamp\">"
			+"			<div class=\"col-sm-6\">"
			+"				<label class=\"col-sm-1 p-t-10\">از<\/label>"
			+"				<vt-persian-date-picker name=\"creationDate_from_{{$index}}\" class=\"col-sm-9\""
			+"					model=\"field.gtValue\"><\/vt-persian-date-picker>"
			+"			<\/div>"
			+"			<div class=\"col-sm-6\">"
			+"				<label class=\"col-sm-1 p-t-10\">تا<\/label>"
			+"				<vt-persian-date-picker name=\"creationDate_to_{{$index}}\" class=\"col-sm-9\""
			+"					model=\"field.ltValue\" max-date=\"field.maxDate(field.gtValue)\" min-date=\"field.gtValue\"><\/vt-persian-date-picker>"
			+"			<\/div>"
			+"		<\/div>"
			+"		<div class=\"col-sm-2 active-search-box searchFilterBox\" ng-switch-when=\"bool\">"
			+"			<label class=\"col-sm-6\">{{field.label}}<\/label>"
			+"			<div class=\"col-sm-5\">"
			+"				<input type=\"checkbox\" class=\"checkbox\" indeterminate"
			+"					ui-keypress=\"{13:'onSearchClick()'}\""
			+"					ng-model=\"controlFn.searchQuery[field.key]\">"
			+"			<\/div>"
			+"		<\/div>"
			+"		<div class=\"col-sm-2 searchFilterBox\" ng-switch-when=\"enum\">"
			+"			<select class=\"form-control search-input\" ng-change=\"onSelectEnum()\""
			+"				ng-model=\"controlFn.searchQuery[field.key]\""
			+"				ui-keypress=\"{13:'onSearchClick()'}\""
			+"				ng-options=\"item.title for item in field.itemList\">"
			+"				<option value=\"\">{{field.label}}</option>"
			+"			<\/select>"
			+ "		<\/div>"
			+"		<div class=\"col-sm-2 searchFilterBox status\" ng-switch-when=\"status\">"
			+"			<select class=\"form-control search-input\" ng-change=\"onSelectEnum()\""
			+"				ng-model=\"controlFn.searchQuery[field.key]\""
			+"				ui-keypress=\"{13:'onSearchClick()'}\""
			+"				ng-options=\"item.title for item in field.itemList\">"
			+"				<option value=\"\">{{field.label}}</option>"
			+"			<\/select>"
			+"		<\/div>"
			+"		<div class=\"col-sm-2 searchFilterBox\" ng-switch-when=\"enumClientSearch\">"
		+"          <ui-select ng-model='controlFn.searchQuery[field.key]'>"
		+"              <ui-select-match placeholder='{{field.label}}'>{{$select.selected.title}}</ui-select-match>"
		+"              <ui-select-choices repeat='item in (field.itemList | filter: {title: $select.search}) track by $index'> "
		+"                  <div ng-bind-html='item.title | highlight: $select.search'></div>"
		+"              </ui-select-choices>"
		+"          </ui-select>"
		+"		<\/div>"
			+"	<\/div>"
			+"<\/div>"
			+"	<div class=\"col-sm-2 p-t-6 p-b-6 pull-left\" style=\"padding-right:0;\">"
			+"		<a class=\"btn btn-sm btn-default h-32 p-t p-b pull-left\" style=\"margin-right: 3px;\""
			+"			type=\"button\" ng-click=\"onExitSearchModeClick()\">"
			+"			<span class=\"flaticon-close-button\" aria-hidden=\"true\"><\/span>"
			+"		<\/a>"
			+"		<a class=\"btn btn-sm btn-default h-32 p-t p-b pull-left\""
			+"			type=\"button\" style=\"margin-right: 3px;\" ng-click=\"onSearchClick()\">"
			+"			<span class=\"flaticon-search\" aria-hidden=\"true\"><\/span>"
			+"		<\/a>"
			+"	<\/div>"
			+"<\/div>"
			+"<!-- ----------------------------------------------- ADVANCED SEARCH ------------------------------------------------------ -->"
			+"<div class=\"row\" ng-if=\"controlFn.advanced\">"
			+"	<div class=\"row rowForm\" "
			+"		ng-repeat=\"field in controlFn.searchableFieldInfo\""
			+"		ng-switch on=\"field.type\" >"
			+""
			+"		<label class=\"col-sm-5\">{{field.label}}<\/label>"
			+""
			+"		<div class=\"col-sm-7\" ng-switch-when=\"string\">"
			+"			<input type=\"text\" class=\"form-control\" name=\"{{field.key}}\""
			+"				ui-keypress=\"{13:'onSearchClick()'}\""
			+"				ng-model=\"controlFn.searchQuery[field.key]\">"
			+"		<\/div>"
			+"		<div class=\"col-sm-7\" ng-switch-when=\"integer\">"
			+"			<input type=\"number\" class=\"form-control search-input\" name=\"{{field.key}}\""
			+"				ui-keypress=\"{13:'onSearchClick()'}\""
			+"				ng-model=\"controlFn.searchQuery[field.key]\">"
			+"		<\/div>"
			+"		<div class=\"col-sm-6\" ng-switch-when=\"date\">"
			+"			<div class=\"col-sm-6\">"
			+"				<label class=\"col-sm-2 from-to-label\">از<\/label>"
			+"				<vt-persian-date-picker name=\"creationDate_from_{{$index}}\" class=\"col-sm-10\""
			+"					model=\"field.gtValue\"><\/vt-persian-date-picker>"
			+"			<\/div>"
			+"			<div class=\"col-sm-6\">"
			+"				<label class=\"col-sm-2 from-to-label\">تا<\/label>"
			+"				<vt-persian-date-picker name=\"creationDate_to_{{$index}}\" class=\"col-sm-10\""
			+"					model=\"field.ltValue\" max-date=\"field.maxDate(field.gtValue)\" min-date=\"field.gtValue\"><\/vt-persian-date-picker>"
			+"			<\/div>"
			+"		<\/div>"
			+"		<div class=\"col-sm-7\" ng-switch-when=\"timestamp\">"
			+"			<div class=\"col-sm-6\">"
			+"				<label class=\"col-sm-1 p-t-10\">از<\/label>"
			+"				<vt-persian-date-picker name=\"creationDate_from_{{$index}}\" class=\"col-sm-10\""
			+"					model=\"field.gtValue\"><\/vt-persian-date-picker>"
			+"			<\/div>"
			+"			<div class=\"col-sm-6\">"
			+"				<label class=\"col-sm-1 p-t-10\">تا<\/label>"
			+"				<vt-persian-date-picker name=\"creationDate_to_{{$index}}\" class=\"col-sm-10\""
			+"					model=\"field.ltValue\" max-date=\"field.maxDate(field.gtValue)\" min-date=\"field.gtValue\"><\/vt-persian-date-picker>"
			+"			<\/div>"
			+"		<\/div>"
			+"		<div class=\"col-sm-7\" ng-switch-when=\"bool\">"
			+"			<input type=\"checkbox\" class=\"checkbox\" indeterminate"
			+"				ui-keypress=\"{13:'onSearchClick()'}\""
			+"				ng-model=\"controlFn.searchQuery[field.key]\">"
			+"		<\/div>"
			+"		<div class=\"col-sm-7\" ng-switch-when=\"enum\">"
			+"			<select class=\"form-control\" ng-change=\"onSelectEnum()\""
			+"				ng-model=\"controlFn.searchQuery[field.key]\""
			+"				ui-keypress=\"{13:'onSearchClick()'}\""
			+"				ng-options=\"item.title for item in field.itemList\">"
			+"				<option value=\"\">{{field.label}}</option>"
			+"			<\/select>"
			+"		<\/div>"
			+"	<\/div>"
			+"	<hr>"
			+"	<div class=\"col-sm-12\">"
			+"		<a class=\"btn btn-sm btn-default\""
			+"			type=\"button\" ng-click=\"onSearchClick()\">"
			+"			<span class=\"flaticon-search\" aria-hidden=\"true\"><\/span>"
			+"		<\/a>"
			+"		<a class=\"btn btn-sm btn-default\""
			+"			type=\"button\" ng-click=\"onExitSearchModeClick()\">"
			+"			<span class=\"flaticon-close-button\" aria-hidden=\"true\"><\/span>"
			+"		<\/a>"
			+"	<\/div>"
			+"<\/div>",



			scope : {
				controlFn : '=',
			},
			controller : function($scope, $element, $attrs, $injector ,$q) {

				//init searchQuery for null pointer preventation
				if(!$scope.controlFn.searchQuery){
					$scope.controlFn.searchQuery = {};
				}

				$scope.controlFn.init = function(){
					if(!$scope.controlFn.searchQuery){
						$scope.controlFn.searchQuery = {};
					}else{
						for ( var index = 0; index < $scope.controlFn.searchableFieldInfo.length; index++) {
							switch ($scope.controlFn.searchableFieldInfo[index].type) {
							//TODO support multi-select-enum
							//case "enum":
							//	break;
							case "date":
							case "timestamp":
								if($scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key]){
									var dateList = $scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key].split(',');
									if(dateList.length==2 && dateList[0]!='')
										$scope.controlFn.searchableFieldInfo[index].gtValue = parseInt(dateList[0]);
									if(dateList.length==2 && dateList[1]!='')
										$scope.controlFn.searchableFieldInfo[index].ltValue = parseInt(dateList[1]);
								}
								break;
							default:
								break;
							}
						}
					}
				}

				$scope.onSearchClick = function(){
					for ( var index = 0; index < $scope.controlFn.searchableFieldInfo.length; index++) {
						switch ($scope.controlFn.searchableFieldInfo[index].type) {
						//TODO support multi-select-enum
						//case "enum":
						//	if($scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key]){
						//		var uid = $scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key].uid;
						//		delete $scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key];
						//		$scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key] = uid;
						//	}
						//	break;
						case "date":
						case "timestamp":
							var from = "";var to = "";
							if($scope.controlFn.searchableFieldInfo[index].gtValue)
								from = Date.parse($scope.controlFn.searchableFieldInfo[index].gtValue);
							if($scope.controlFn.searchableFieldInfo[index].ltValue)
								to = Date.parse($scope.controlFn.searchableFieldInfo[index].ltValue);
							if(from!="" || to!="")
								$scope.controlFn.searchQuery[$scope.controlFn.searchableFieldInfo[index].key] = from + "," + to;
							break;
						default:
							break;
						}
					}
					$scope.controlFn.onSearchClick($scope.controlFn.advanced);
				};
				$scope.onExitSearchModeClick = function(){
					$scope.controlFn.searchQuery = {};
					for ( var index = 0; index < $scope.controlFn.searchableFieldInfo.length; index++) {
						switch ($scope.controlFn.searchableFieldInfo[index].type) {
							case "date":
							case "timestamp":
								$scope.controlFn.searchableFieldInfo[index].gtValue = null;
								$scope.controlFn.searchableFieldInfo[index].ltValue = null;
								break;
							default:
								break;
							}
						}
					$scope.controlFn.onExitSearchModeClick();
				};
			},
			link : function(scope, element, attrs, ctrls) {

			}
	};
});