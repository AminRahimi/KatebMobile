function run(Restangular, toaster, $location, $rootScope, $filter, $state, $templateCache, configSrvc, vtShowMessageSrvc,formManagementSrvc) {
	$templateCache.put("select2/select.tpl.html",
		"<div class=\"ui-select-container select2 select2-container\" ng-class=\"{\'select2-container-active select2-dropdown-open open\': $select.open,\n \'select2-container-disabled\': $select.disabled,\n \'select2-container-active\': $select.focus, \n \'select2-allowclear\': $select.allowClear && !$select.isEmpty()}\"><div class=\"ui-select-match\"></div><div class=\"select2-drop select2-with-searchbox select2-drop-active\" ng-class=\"{\'select2-display-none\': !$select.open}\"><div class=\"select2-search\" ng-show=\"$select.searchEnabled\"><input type=\"text\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" class=\"ui-select-search select2-input\" ng-model=\"$select.search\"></div><div class=\"ui-select-choices\"></div></div></div>");
	
	//FIXME: deprecated lodash variable : replace all with _.incudes;
	_.contains = _.includes;
	
	var getBaseRequestUrl = function() {
		return "api";
	};

	Restangular.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
		vtShowMessageSrvc.hideLoadingDialog();
		if (response.data.messages) {
			angular.forEach(response.data.messages, function(a) {
				if (a.type) {
					vtShowMessageSrvc.showMassage(a.type.toLowerCase(), '', a.text);
				}
			});
		}
		return response.data;
	});


	Restangular.addFullRequestInterceptor(function(element, operation, route, url, headers, params, httpConfig) {
		vtShowMessageSrvc.showLoadingDialog();
        if (element)
            element = JSON.parse($filter('FaToEnAndYeKe')(JSON.stringify(element)));

        if (headers)
            headers = JSON.parse($filter('FaToEnAndYeKe')(JSON.stringify(headers)));

        if (httpConfig)
			httpConfig = JSON.parse($filter('FaToEnAndYeKe')(JSON.stringify(httpConfig)));

        if (params)
            params = JSON.parse($filter('FaToEnAndYeKe')(JSON.stringify(params)));

		return {
			element : element,
			params : params,
			headers : headers,
			httpConfig : httpConfig

		};
	});

	Restangular.setResponseExtractor(function(response, operation, what, url, response2, deferred) {
		var newResponse = angular.copy(response) || {};
		if (operation === 'getList') {
			if (!angular.isArray(response)) {
				newResponse = response.items;
				delete response.items;
				angular.extend(newResponse, response);
			}
		} else if (response.items) {
			newResponse = response.items;
			delete response.items;
			angular.extend(newResponse, response);
		}
		var newResponse2 = newResponse;
		newResponse2.originalElement = angular.copy(newResponse);
		if (angular.isObject(response)) {
			angular.extend(newResponse2.originalElement, response);
		}
		return newResponse2;
	});

	Restangular.setBaseUrl(getBaseRequestUrl());
	Restangular.setDefaultHeaders({'Content-Type': 'application/json'});
	Restangular.setOnElemRestangularized(function(elem, isCollection, route) {
		return elem;
	});

	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		configSrvc.getConfigAndConfigModules().then(function(config) {
			if (config.userConfig.features["API_CHANGE_PASSWORD"] && Object.keys(config.userConfig.features).length== 1) {
				window.location = "static/changePassword.html"
			}
		});
	});
	
	
	formManagementSrvc.setComponent({
		type : 'webservice_enum',
		typePersianName : "انتخابگر پایه وب سرویس",
		widgets : [ {
			widget : "",
			persianName : "لیست کشویی",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective2/img/component_pics/enum.png",
			htmlPath : "app/assets/js/directives/optionSelectorWebservice/enumoptionSelectorWebService.html"
		} ]
	});


	formManagementSrvc.setComponent({
		type : 'webservice_enum',
		typePersianName : "انتخابگر پایه وب سرویس",
		widgets : [ {
			widget : "",
			persianName : "لیست کشویی",
			multiple : true,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective2/img/component_pics/enum.png",
			htmlPath : "app/assets/js/directives/optionSelectorWebservice/enumoptionSelectorWebService.html"
		} ]
	});





	formManagementSrvc.setComponent({
		type : 'file',
		typePersianName : "اسکن",
		widgets : [ {
			widget : "scan",
			persianName : "اسکن",
			multiple : false,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/file.png",
			htmlPath : "app/assets/js/directives/scan/scan.html"
		} ]
	});
	formManagementSrvc.setComponent({
		type : 'letterAttachment',
		typePersianName : "پیوست‌های جدید نامه",
		widgets : [ {
			widget: 'scan',
			persianName : 'پیوست‌های جدید نامه',
			multiple: true,
			isHidden : false,
			picPath : "app/lib/vtSchemaDirective/img/component_pics/file.png",
			htmlPath : "app/assets/js/directives/letterTab/letterAttachmentFormManagementComponent.html"
		} ]
	});
};
