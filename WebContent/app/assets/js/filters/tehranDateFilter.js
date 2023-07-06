angular.module('appFilter').filter('tehranDate',
		function() {
			let isAllNumbers =(val)=> /^\d+$/.test(val);
			const tehranTimeZone = +210;

			return function (date,format) {
				if(!date){
					return null;
				}
				date = isAllNumbers(date)?parseInt(date):date
				return moment(date).utcOffset(tehranTimeZone).format(format);
			};
		});