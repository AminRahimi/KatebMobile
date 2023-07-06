angular.module('appFilter').filter('msToTimeFilter',
		function() {
			return function (input) {
				if ((typeof input == undefined) || !angular.isNumber(input)) {
					return;
				} else {
					input = parseInt(input);
					H = Math.floor(input / 3600000);
					M = Math.floor((input - H * 3600000) / 60000);
					S = Math.floor((input - H * 3600000 - M * 60000) / 1000);

					var stringH = H < 10 ? "0" + H : String(H);
					var stringM = M < 10 ? "0" + M : String(M);

					return stringH + ":" + stringM;
					/* +":"+String(S); */
				}
			};
		});