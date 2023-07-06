angular.module('templateModule', []);
angular.module('templateModule').factory('templateSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFulltemplateList: function(startPage, pageLen){
			return Restangular.all(ORG+'/private_letter_template/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendtemplateList: function(){
			return Restangular.all(ORG+'/private_letter_template/items').getList({len:-1});
		},
		gettemplateList: function(){
			return Restangular.all(ORG+'/private_letter_template/items').getList();
		},
		gettemplate: function(uid){
			return Restangular.one(ORG+'/private_letter_template/items/'+uid).get();
		},
		savetemplate: function(data){
			return Restangular.all(ORG+'/private_letter_template/items').post(data);
		},
		updatetemplate: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/private_letter_template/items/'+uid).post(data);
		},
		deletetemplate: function(uid){
			return Restangular.one(ORG+'/private_letter_template/items/'+uid).remove();
		},
		searchtemplate: function(query, startPage, pageLen){
			return Restangular.all(ORG+'/private_letter_template/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		}	
	}
	
}]);