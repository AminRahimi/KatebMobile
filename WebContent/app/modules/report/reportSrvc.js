angular.module('reportModule').factory('reportSrvc', [ 'Restangular', '$q','$http', function(Restangular, $q, $http) {

	return {
		/************* ORGANIZATION ***********/
		getIncomingIssuedLetter: function () {
			return Restangular.all('reportMongo/letter_org')
					.post({
						responseType:"json"
					});
		},
		searchIncomingIssuedLetter: function (from, to, orguid) {
			if (orguid) {
				return Restangular.all('reportMongo/letter_org?extent=full&from='+from+'&to='+to+'&orgUid='+orguid)
					.post({
						responseType:"json"
					});
			}
			else {
				return Restangular.all('reportMongo/letter_org?extent=full&from='+from+'&to='+to)
					.post({
						responseType:"json"
					});
			}
		},
		getExcelReport: function (from, to, type) {
			$http({
				url: (from && to && type == 'incomingIssuedLetter') ? 'api/reportMongo/letter_org/excel?from=' + from + '&to=' + to : (!from && !to && type == 'incomingIssuedLetter') ? 'api/reportMongo/letter_org/excel'
				   : (from && to && type=='correspondenceUnit') ?     'api/reportMongo/letter_department/excel?from=' + from + '&to=' + to:(!from && !to && type == 'correspondenceUnit') ? 'api/reportMongo/letter_department/excel':'',
        	    method: "GET",
        	    data: {responseType : 'csv'}, 
        	    headers: {
        	       'Content-type': 'application/json'
        	    },
        	    responseType: 'arraybuffer'
        	}).success(function (data, status, headers, config) {
        	    var blob = new Blob([data], {type: 'application/octet-stream'});
        	    var url = URL.createObjectURL(blob);
				var a = document.createElement('a');
				a.download = 'Report_'+Date.now()+'.csv';
				a.href = url;
				a.style = "visibility:hidden";
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
        	}).error(function (data, status, headers, config) {
        	    //upload failed
        	});
		},
		
        getPdfReport: function (from, to , type) {
        	$http({
        	    url: (from && to && type == 'incomingIssuedLetter') ? 'api/reportMongo/letter_org/pdf?from=' + from + '&to=' + to : (!from && !to && type == 'incomingIssuedLetter') ? 'api/reportMongo/letter_org/pdf'
				   : (from && to && type=='correspondenceUnit') ?     'api/reportMongo/letter_department/pdf?from=' + from + '&to=' + to:(!from && !to && type == 'correspondenceUnit') ? 'api/reportMongo/letter_department/pdf':'',
        	    method: "GET",
        	    data: {responseType : 'pdf'}, //this is your json data string
        	    headers: {
        	       'Content-type': 'application/json'
        	    },
        	    responseType: 'arraybuffer'
        	}).success(function (data, status, headers, config) {
        	    var blob = new Blob([data], {type: 'application/octet-stream'});
        	    var url = URL.createObjectURL(blob);
				var a = document.createElement('a');
				a.download = 'Report_'+Date.now()+'.pdf';
				a.href = url;
				a.style = "visibility:hidden";
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
        	}).error(function (data, status, headers, config) {
        	    //upload failed
        	});
		},

		/******************* USER **************/
		getIncomingIssuedUserLetter: function () {
			return Restangular.all('reportMongo/letter_user')
					.post({
						responseType:"json"
					});
		},
		searchIncomingIssuedUserLetter: function (from, to) {
			return Restangular.all('reportMongo/letter_user?extent=full&from='+from+'&to='+to)
					.post({
						responseType:"json"
					});
		},

		letterSecretary: function () {
			return Restangular.all('reportMongo/letter_secretary')
					.post({
						responseType:"json"
					});
		},
		searchLetterSecretary: function (from, to) {
			return Restangular.all('reportMongo/letter_secretary?extent=full&from='+from+'&to='+to)
					.post({
						responseType:"json"
					});
		},
		/************* correspondenceUnit ***********/
		getCorrespondenceUnit: function (from, to) {
			return Restangular.all('reportMongo/letter_department?from='+from+'&to='+to)
					.post({
						responseType:"json"
					});
		},
		searchCorrespondenceUnit: function (from, to) {
			return Restangular.all('reportMongo/letter_department')
					.post({
						responseType:"json"
					});
		},
		/**************** process ******************/
        getProcessReportList: function () {
            return Restangular.all('reportMongo/process')
					.post({
						responseType:"json"
					});
		},
		getReservation: function (startPage, pageLen) {
			return Restangular.all('org/CURRENT/reserved_letter_number/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
            },
        searchProcessReportList: function (from, to) {
            return Restangular.all('reportMongo/process')
					.post({
						responseType:"json"
					});
        },

	}
}]);
