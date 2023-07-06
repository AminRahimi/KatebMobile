angular.module('letterlayoutModule', []);
angular.module('letterlayoutModule').factory('letterlayoutSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFullletterlayoutList: function(startPage, pageLen){
			return Restangular.all(ORG+'/letter_layout/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendletterlayoutList: function(){
			return Restangular.all(ORG+'/letter_layout/items').getList({len:-1});
		},
		getletterlayoutList: function(){
			return Restangular.all(ORG+'/letter_layout/items').getList();
		},
		getletterlayout: function(uid){
			return Restangular.one(ORG+'/letter_layout/items/'+uid).get();
		},
		saveletterlayout: function(data){
			return Restangular.all(ORG+'/letter_layout/items').post(data);
		},
		updateletterlayout: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/letter_layout/items/'+uid).post(data);
		},
		deleteletterlayout: function(uid){
			return Restangular.one(ORG+'/letter_layout/items/'+uid).remove();
		},
		searchletterlayout: function(query, startPage, pageLen){
			return Restangular.all(ORG+'/letter_layout/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},
		
	}
	
}]);