angular.module('reportModule').controller('reserveListReportCtrl',function($scope, reportSrvc, $state, katebSrvc) {

    $scope.Data = {
        reserveList: [],
    };

    $scope.Func = {
        getReservation: function () {
            reportSrvc.getReservation().then(function (res) {
                $scope.Data.reserveList = res.data;
            });
        },
        onExcelClick: function () {
             var url = "api/org/CURRENT/reserved_letter_number/excel";
                        katebSrvc.downloadByLink(url,"excel");
        },
    };
    $scope.Controller = {
	
		listController : {
            headers: [
                
                {key:'creationDate', label:'تاریخ ثبت', type:'timestamp', format:'jDD-jMMMM-jYYYY'},
                {key:'letterNumber', label:'شماره نامه'},
                {key: 'actor.title', label: 'اقدام کننده' },
                {key: 'applicant.title', label: 'درخواست دهنده' },
				{key: 'department', label: 'واحد درخواست دهنده' },
				{key: 'creator.title', label: ' ایجاد کننده' },
                {key: 'subject', label: 'موضوع' },
				{key: 'reason', label: 'دلیل' },
				{key: 'indicatorBook.title', label: ' اندیکاتور' },
				{key: 'status', label: 'وضعیت',type:'enum'},
			],
			getList: reportSrvc.getReservation,
    
		},
		}

    

    var Run = function () {
    };

    Run();

});
