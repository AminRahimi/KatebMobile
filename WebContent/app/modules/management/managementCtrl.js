angular.module('ManagementModule').controller('managementCtrl', function ($scope, configObj, homeSrvc, $state) {

    $scope.Data = {
        menuList: [],
        features: configObj.userConfig.features,
        selectedMenu: "",
        organizationList: [],
        isMultipleMenu: false
    };

    $scope.Func = {
        getMenuList: function () {
            $scope.Data.sysadminMenuList = [
                {
                    icon: "multiple-connector-points",
                    title: "بین سازمانی",
                    feature: "*",
                    items: [
                        {
                            title: "تمامی کاربران",
                            uiSref: "home.management.allUser",
                            feature: "MANAGEMENT_GLOBAL_USER"
                        }, {
                            title: "سازمان ها",
                            uiSref: "home.management.organization",
                            feature: "MANAGEMENT_ORGANIZATION"
                        }, {
                            title: "نقش ها",
                            uiSref: "home.management.userrole",
                            feature: "MANAGEMENT_ROLE"
                        }, {

                            title: "قالب نامه بین سازمانی",
                            uiSref: "home.management.globallettertemplate",
                            feature: "MANAGEMENT_GLOBAL_LETTER_TEMPLATE"
                        }
                    ]
                }, {
                    icon: "statistics",
                    title: "گزارشات",
                    feature: "*",
                    items: [
                        {
                            title: "وقایع",
                            uiSref: "home.management.eventLog",
                            feature: "eventLog_access"
                        }, {
                            title: "تاریخچه عناصر",
                            uiSref: "home.management.objectLog",
                            feature: "eventLog_access"
                        }
                    ]
                },{
                    icon: "settings-gears",
                    title: "تنظیمات صفحه ورود",
                    feature: "SET_WALLPAPER",
                    items: [
                        {
                            title: "انتخاب تصویر",
                            uiSref: "home.management.loginSetting",
                            feature: "*"
                        },
                    ]
                }
            ];
            $scope.Data.menuList = [
                {
                    icon: "multiple-users-silhouette",
                    title: "کاربران و دسترسی ها",
                    feature: "*",
                    items: [
                        {
                            title: "کاربران",
                            uiSref: "home.management.user",
                            feature: "MANAGEMENT_USER"
                        }, {
                            title: "گروه ها",
                            uiSref: "home.management.group",
                            feature: "MANAGEMENT_PUBLIC_GROUP"
                        }, {
                            title: "سمت های داخلی",
                            uiSref: "home.management.position",
                            feature: "MANAGEMENT_POSITION"
                        }, {
                            title: "واحد سازمانی",
                            uiSref: "home.management.department",
                            feature: "MANAGEMENT_DEPARTMENT"
                        }, {
                            title: "دبیرخانه",
                            uiSref: "home.management.secretariat",
                            feature: "MANAGEMENT_SECRETARIAT"
                        }, {
                            title: "سازمان های مرتبط",
                            uiSref: "home.management.externalorganization",
                            feature: "MANAGEMENT_EXTERNAL_ORGANIZATION"
                        },
                        {
                            title: "مدیریت فرم نامه",
                            uiSref: "home.management.letterFormType",
                            feature: "MANAGEMENT_LETTER_FORM_TYPE"
                        }
                    ]
                }, {
                    icon: "envelope-settings",
                    title: "تنظیمات نامه نگاری",
                    feature: "*",
                    items: [
                        {
                            title: "دفتر اندیکاتور",
                            uiSref: "home.management.indicatorbook",
                            feature: "MANAGEMENT_INDICATOR_BOOK"
                        },
                        {
                            title: "سربرگ نامه",
                            uiSref: "home.management.letterlayout",
                            feature: "MANAGEMENT_LETTER_LAYOUT"
                        },
                        {
                            title: "فونت",
                            uiSref: "home.management.systemFont",
                            feature: "MANAGEMENT_FONT"
                        },
                        {
                        	 title: "قالب نامه",
                             uiSref: "home.management.lettertemplate",
                             feature: "MANAGEMENT_PUBLIC_LETTER_TEMPLATE"
                         }, { 
                        	 title: "قالب نامه وارده",
                             uiSref: "home.management.incomingLettertemplate",
                             feature: "MANAGEMENT_INCOMMING_LETTER_TEMPLATE"
                         }, {
                            title: "هامش",
                            uiSref: "home.management.hameshhotkey",
                            feature: "MANAGEMENT_PUBLIC_HAMESH_HOTKEY"
                        }, {
                            title: "برچسب",
                            uiSref: "home.management.tag",
                            feature: "MANAGEMENT_PUBLIC_TAG"
                        }, {
                            title: "قوانین مکاتبات",
                            uiSref: "home.management.rule",
                            feature: "MANAGEMENT_LETTER_RULE"
                        }
                    ]
                }, {
                    icon: "settings-gears",
                    title: "تنظیمات عمومی و اعلانات",
                    feature: "*",
                    items: [
                        {
                            title: "تنظیمات عمومی سازمان",
                            uiSref: "home.management.publicsetting",
                            feature: "MANAGEMENT_PUBLIC_SETTING"
                        }, {
                            title: "اخبار و اعلانات",
                            uiSref: "home.management.newsList",
                            feature: "MANAGEMENT_NEWS"
                        }
                    ]
                }, {
                    icon: "reuse",
                    title: "فرآیند",
                    feature: "*",
                    items: [
                        {
                            title: "فرآیندها",
                            uiSref: 'home.management.process',
                            feature: "MANAGEMENT_VIRA_PROCESS_MODEL"
                        }
                    ]
                }
            ];
            $scope.Func.checkMenuGroupAccess();
        },
        checkMenuGroupAccess: function () {
            angular.forEach($scope.Data.menuList, function (menuItem) {
                if (menuItem.feature == "*" || $scope.Data.features[menuItem.feature]) {
                    var isFeature = false;
                    angular.forEach(menuItem.items, function (item) {
                        if (item.feature == "*" || $scope.Data.features[item.feature]) {
                            isFeature = true;
                        }
                    });
                    if (!isFeature) {
                        menuItem.isNotShow = true;
                    }
                } else {
                    menuItem.isNotShow = true;
                }
            });
            angular.forEach($scope.Data.sysadminMenuList, function (sysadminMenu) {
                if (sysadminMenu.feature == "*" || $scope.Data.features[sysadminMenu.feature]) {
                    var isFeature = false;
                    angular.forEach(sysadminMenu.items, function (item) {
                        if (item.feature == "*" || $scope.Data.features[item.feature]) {
                            isFeature = true;
                        }
                    });
                    if (!isFeature) {
                        sysadminMenu.isNotShow = true;
                    }
                } else {
                    sysadminMenu.isNotShow = true;
                }
            });
            $scope.Data.sysadminMenuListNotShowCount = -1;
            angular.forEach($scope.Data.sysadminMenuList, function (sysadminMenu) {
                if (sysadminMenu.isNotShow) {
                    $scope.Data.sysadminMenuListNotShowCount == -1 ? $scope.Data.sysadminMenuListNotShowCount = 1 : $scope.Data.sysadminMenuListNotShowCount++;
                }
            });
        },
        getOrganizationList: function () {
            homeSrvc.getOrganizationList().then(function (response) {
                $scope.Data.organizationList = _.orderBy(response.data, ['title'], ['asc']);
                $scope.Data.selectedMenu = $scope.Data.organizationList[0];
                if ($scope.Data.organizationList.length == 1) {
                    $scope.Data.isMultipleMenu = false;
                } else {
                    $scope.Data.isMultipleMenu = true;
                    if ($state.current.name != "home.management") {
                        $scope.Func.setMenuByUrlParams($scope.Data.organizationList, $state.params.orgUid);
                    } else if (localStorage.selectedManagementMenu) {
                        $scope.Data.selectedMenu = angular.copy(JSON.parse(localStorage.selectedManagementMenu));
                    }
                }
            });
        },
        onSelectOraganizationSelect: function (item) {
            localStorage.selectedManagementMenu = JSON.stringify(item);
            if ($state.current.name != "home.management") {
                $state.go($state.current.name, {orgUid: item.uid});
            }
        },
        setMenuByUrlParams: function (organizationList, orgUid) {
            _.findIndex(organizationList, function (organization) {
                if (organization.uid == orgUid) {
                    $scope.Data.selectedMenu = organization;
                    localStorage.selectedManagementMenu = JSON.stringify(organization);
                    return true;
                }
            });
        }
    };

    var Run = function () {
        $scope.Func.getMenuList();
        $scope.Func.getOrganizationList();
    };

    Run();

});