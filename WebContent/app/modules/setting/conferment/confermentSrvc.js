angular.module('confermentModule', []);
angular.module('confermentModule').factory('confermentSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFullconfermentList: function(startPage, pageLen){
			return Restangular.all('conferment/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendconfermentList: function(){
			return Restangular.all('conferment/items').getList({len:-1});
		},
		getconfermentList: function(){
			return Restangular.all('conferment/items').getList();
		},
		getconferment: function(uid){
			return Restangular.one('conferment/items/'+uid).get();
		},
		saveconferment: function(data){
			return Restangular.all('conferment/items').post(data);
		},
		updateconferment: function(data){
			var uid = data.uid;
			return Restangular.all('conferment/items/'+uid).post(data);
		},
		deleteconferment: function(uid){
			return Restangular.one('conferment/items/'+uid).remove();
		},
		searchconferment: function(query, startPage, pageLen){
			return Restangular.all('conferment/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},

		getuserList: function(){
			return Restangular.all(ORG+'/user/items').getList({len:-1});
		},
		getseeLettersWithTagList: function(){
			return Restangular.all('tag/items').getList({len:-1});
		},
		getresponseLettersWithTagList: function(){
			return Restangular.all('tag/items').getList({len:-1});
		},
		getpositionList: function () {
			return Restangular.all('/user/my_positions').getList({len:-1});
		},
		getSuccessorList: function (query) {
			return Restangular.all(ORG+'/user/actives?query=' + query).getList({len:-1});
		}
	}

}]);