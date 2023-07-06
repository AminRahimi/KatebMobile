angular.module('HomeModule', []);
angular.module('HomeModule').factory('homeSrvc', function($rootScope, Restangular, configSrvc, Kateb_CONFIG_MENUS) {

	var isCached = false;
	var cachedMenuList = [];
	return {
		getOrganizationList: function(){
			return Restangular.all('organization/availables').getList();
		},
		
		generateMenuData : function(orgList) {
			if (cachedMenuList.length < 1){
                var menuData = [];
                var reserveListReport = {title: 'لیست رزرو نامه', uiSref: 'home.report.reserveList', feature: 'SEE_REPORT_RESERVED_LETTER_NUMBERS'}
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
		
		generateSecretariatMenu: function(){
			return Kateb_CONFIG_MENUS['SECRETARIAT'].sideMenuItems;
		},
		generateSettingMenu: function(){
			return Kateb_CONFIG_MENUS['SETTING'].childItems;
		},
		
		changePassword: function(data){
			return Restangular.all('user/change_password').post(data);
		},
	}
});
