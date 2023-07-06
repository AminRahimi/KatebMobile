angular.module('themeModule').controller('themeCtrl', function($scope, $state, themeSrvc, themeConst, vtShowMessageSrvc) {

	$scope.Data = {
        themeName: themeConst,
        themeList: [
            {
                name: "default",
                mainColor:"#0097a7",
                persianName: "پیش فرض",
                secondColor:"#fb7546",
                thirdColor:"#eee",
            },
            {
                name: "blue",
                mainColor:"#0062d2",
                persianName: "آبی",
                secondColor:"#00d576",
                thirdColor:"#eee"
            }
        ],
        themeObj:{},
        isChangedTheme:false
    }
	
	$scope.Func = {
        getStateName: function (stateName) {
            return homeSrvc.getStateName(stateName);
        },
        loadCss: function (theme){
            $scope.Data.themeObj = angular.copy(theme);
            if (theme.name === "default") {
                if(document.getElementById('new-theme')){
                  document.getElementById('new-theme').remove();
                }
            } else {
                    if(document.getElementById('new-theme')){
                        document.getElementById('new-theme').setAttribute('href','app/assets/css/kateb-theme-'+theme.name+'.css');
                    } else {
                        elem = document.createElement("link");
                        elem.id='new-theme';
                        elem.rel="stylesheet";
                        elem.type="text/css";
                        elem.href='app/assets/css/kateb-theme-' + theme.name +'.css';
                        document.getElementsByTagName("head")[document.getElementsByTagName("head").length - 1].appendChild(elem);
                    }
                        
                    }
            },
        onSaveClick:function(){
            themeSrvc.saveTheme($scope.Data.themeObj).then(function(){
                $scope.Data.isChangedTheme = true;
                themeSrvc.setCurrentName($scope.Data.themeObj.name);
                vtShowMessageSrvc.showMassage("success","","شما رنگ بندی " + $scope.Data.themeObj.persianName + " را به عنوان تم اصلی انتخاب کردید.");
                $state.go($scope.Func.getStateName('base.home.cartable'));
            });
        }
    }
	
	var Run = function(){
        if(themeSrvc.getCurrentName() != null){
            $scope.Data.themeName = themeSrvc.getCurrentName();
        }
         $scope.Data.themeObj = _.find($scope.Data.themeList, function(theme) {
                 return theme.name == $scope.Data.themeName; 
             });
        $scope.Func.loadCss($scope.Data.themeObj );
    }
	Run();
    
    $scope.$on("$destroy", function() {
        if(!$scope.Data.isChangedTheme) {
           if(themeSrvc.getCurrentName() != null){
            $scope.Data.themeName = themeSrvc.getCurrentName();
        }
         $scope.Data.themeObj = _.find($scope.Data.themeList, function(theme) {
                 return theme.name == $scope.Data.themeName; 
             });
        $scope.Func.loadCss($scope.Data.themeObj );
        }
    });
	
});