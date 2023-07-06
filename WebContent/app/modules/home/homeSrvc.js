angular.module('HomeModule', []);
angular.module('HomeModule').factory('homeSrvc', function(Restangular, Kateb_CONFIG_MENUS,secretariatSrvc) {

	var isCached = false;
	var cachedMenuList = [];
	const HomeSrvc =  {
		getStateName: function (stateName) {
			var isMobile = HomeSrvc.screenSizeDetector.isMobile();
			return isMobile ? stateName.replace("home.","mobileHome."): stateName;
		},
		screenSizeDetector:{
			isExtraSmall: window.matchMedia( '(max-width: 767px)' ).matches,
			isSmall: window.matchMedia( '(min-width: 768px) and (max-width: 991px)' ).matches,
			isMedium: window.matchMedia( '(min-width: 992px) and (max-width: 1199px)' ).matches,
			isLarge: window.matchMedia( '(min-width: 1200px)' ).matches,
			isMobile:function (){
				return true;
				// return false;
				// return HomeSrvc.screenSizeDetector.isSmall || HomeSrvc.screenSizeDetector.isExtraSmall;
			}
		},


		getOrganizationList: function(){
			return Restangular.all('organization/availables').getList();
		},
		
		generateMenuData : function(orgList) {
			if (cachedMenuList.length < 1){
                var menuData = [];
                var reserveListReport = {title: 'لیست رزرو نامه', uiSref: HomeSrvc.getStateName('base.home.report.reserveList') , feature: 'SEE_REPORT_RESERVED_LETTER_NUMBERS'}
                angular.forEach(Kateb_CONFIG_MENUS, function(menuItem, key){
                    if(!menuItem.hide){
                        //create sub-menus
                        // if(key=='MANAGEMENTS'){
                        //     angular.forEach(orgList, function(org){
                        //         menuItem.childItems.push({
                        //             title: org.title,
                        //             orgUid: org.uid,
                        //             uiSref: '',
                        //             feature: '*',
                        //             submenus: menuItem.submenuItems
                        //         });
                        //     });
                        // }
                        menuData.push(menuItem);
                    }
                });
                cachedMenuList = menuData;
                angular.forEach(menuData, function (item) {
                    if (item.title == "گزارش") {
                        item.childItems.push(reserveListReport)
                    }
                })
                return menuData;
            } else {
                return cachedMenuList
            }

		},


		// generateMenuDataWithDynamicChildItems: function (){
		// 	var menuData = angular.copy(HomeSrvc.generateMenuData());
		// 	return HomeSrvc.generateSecretariatMenu().then(function (secretariatList){
		// 		return menuData.map(function (menuItem) {
		// 			if(menuItem.title==='دبیرخانه'){
		// 				menuItem.childItems = angular.copy(secretariatList);
		// 			}
		// 			return menuItem;
		// 		});
		// 	});
		// },
		
		generateSecretariatMenu: function() {

			return secretariatSrvc.getSideMenuSecretariat().then(function (response){
				var secretariatAllMenuList =  Kateb_CONFIG_MENUS['SECRETARIAT'].sideMenuItems;
				var secretariatList = response.data.originalElement;
				secretariatList.forEach(function (item) {
					item.childItems = angular.copy(secretariatAllMenuList);
					item.menu.forEach(function (menuItem) {
						item.childItems.forEach(function (menuListItem) {
							// if (menuListItem.key === "INCOMMING") {
							// 	$scope.Data.incommingUisref = menuListItem.uiSref;
							// }
							menuListItem.active = false;
							if (menuListItem.key === menuItem.key) {

								menuListItem.count = menuItem.counter;
							}
						});
					});
				});
				return secretariatList;
			});

		},
		generateSettingMenu: function(){
			return Kateb_CONFIG_MENUS['SETTING'].childItems;
		},
		
		changePassword: function(data){
			return Restangular.all('user/change_password').post(data);
		},
	};

	return HomeSrvc;
});
