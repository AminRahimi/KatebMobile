angular.module('logModule',[]);
angular.module('logModule').factory('logSrvc', [ 'Restangular', function(Restangular) {
	return {
		getLogPagedList : function(data, pageNum, pageSize,logDesc) {
			data.pageNum = pageNum;
			data.pageSize = pageSize;
			if (logDesc) {
				return Restangular.all('event_log/v2/items?details='+logDesc).getList(data);
			} else {
				return Restangular.all('event_log/v2/items').getList(data);
			}
		},
		getTypeList:function(){
			return Restangular.one('event_log/v2/log_types').get();
		},
		downloadByLink: function (url, fileName) {
			var link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute("download", fileName);
			link.style = "visibility:hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		getUserPagedList:function() {
			return Restangular.all('org/current/user/items').getList({extent:'brief',len:-1});
		},
		
		getObjectTypeList:function(){
			return Restangular.one('event_log/v2/object_types').get();
		},
		getObjectList:function(ObjectType, query, start, len){
			return Restangular.all('event_log/v2/object/items').getList({
				object_type: ObjectType, 
				q: query ? query : "",
				pageNum: start,
				pageSize: len
			});
		},
		getItemList:function(ObjectUid){
			return Restangular.all('event_log/v2/items').getList({
				object_uid: ObjectUid
			});
		},
		
		getDownloadLogLink : function(data){
			var params={};
			if(data.type!='')params.type=data.type;
			if(data.userUid!='')params.user_uid=data.userUid;
			if(data.IP!='')params.ip_address=data.IP;
			if(data.fromDate!='')params.from_date=data.fromDate;
			if(data.toDate!='')params.to_date=data.toDate;
			
			var downloadLink = '/event_log/v2/export/csv?';
			if(data.type && data.type!='')downloadLink=downloadLink+"type="+data.type+"&";
			if(data.userUid && data.userUid!='')downloadLink=downloadLink+"username="+data.userUid+"&";
			if(data.IP && data.IP!='')downloadLink=downloadLink+"ip_address="+data.IP+"&";
			if(data.fromDate && data.fromDate!='')downloadLink=downloadLink+"fromDate="+data.fromDate+"&";
			if(data.toDate && data.toDate!='')downloadLink=downloadLink+"toData="+data.toDate+"&";
			
			return Restangular.all(downloadLink).post(params);
		},
		getFullname: function (username) {
			return Restangular.all('org/current/user/items').customPOST({"restrictions":[{"type":"like","value":username,"field":"username"}]},'',
				{},{'X-HTTP-Method-Override':'GET'});
		}
	};
} ]);