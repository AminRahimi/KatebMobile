angular.module('vtCityRequired', []).factory("vtCityRequiredSrvc", function() {
	var CityNgModel;
	var ProvinceNgModel;
	return {
		setCityNgModel : function(_ngmodel) {
			CityNgModel = _ngmodel
		},
		setProvinceNgModel : function(_ngmodel) {
			ProvinceNgModel = _ngmodel
		},
		getCityNgModel : function(_ngmodel) {
			return CityNgModel;
		},
		getProvinceNgModel : function(_ngmodel) {
			return ProvinceNgModel;
		}
	}
}).directive('vtCityRequired', function(vtCityRequiredSrvc) {
	return {
		restrict : 'EA',
		require : 'ngModel',
		link : function(scope, elem, attr, ngModel) {
			if (attr.cityModel == undefined) {
				vtCityRequiredSrvc.setCityNgModel(ngModel);
			} else {
				vtCityRequiredSrvc.setProvinceNgModel(ngModel);
			}
			ngModel.$parsers.unshift(function(value) {
				if (attr.cityModel == undefined) {
					if (value.uid) {
						ngModel.$setValidity('vtCityRequired', true);
						return value;
					} else {
						ngModel.$setValidity('vtCityRequired', false);
						return value;
					}
				} else {
					if (value.uid) {
						ngModel.$setValidity('vtCityRequired', true);
						vtCityRequiredSrvc.getCityNgModel().$setValidity('vtCityRequired', false);
						return value;
					}
				}
				return value;
			});
		}
	}
});