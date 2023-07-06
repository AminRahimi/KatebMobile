angular.module('userModule', []);
angular.module('userModule').factory('userSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';
	
	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFulluserList: function(startPage, pageLen){
			return Restangular.all(ORG+'/user/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtenduserList: function(){
			return Restangular.all(ORG+'/user/items').getList({len:-1});
		},
		getuserList: function(){
			return Restangular.all(ORG+'/user/items').getList();
		},
		getuser: function(uid){
			return Restangular.one(ORG+'/user/items/'+uid).get();
		},
		saveuser: function(data){
			return Restangular.all(ORG+'/user/items').post(data);
		},
		updateuser: function(data){
			var uid = data.uid;
			delete data.username;
			return Restangular.all(ORG+'/user/items/'+uid).post(data);
		},
		deleteuser: function(uid){
			return Restangular.one(ORG+'/user/items/'+uid).remove();
		},
		searchuser: function(query, start, len){
			return Restangular.all(ORG+'/user/items').customPOST(query,'',
					{start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},
		updateuserAuthentication: function (userUid, data) {
			return Restangular.all('user_setting/items/'+userUid).post(data);
		},
		getuserAuthentication: function (userUid) {
			return Restangular.one('user_setting/items/'+userUid).get();
		},
		getUserPass: function (userUid) {
			return Restangular.one('user/auth/' + userUid).get();
		},
		moveUser: function (userUid,orgUid) {
			return Restangular.one('user/'+userUid+'/move?dest_org_uid='+orgUid).post();
		}
		
	}
	
}]);