angular.module('lettertemplateModule', []);
angular.module('lettertemplateModule').factory('lettertemplateSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFulllettertemplateList: function(startPage, pageLen){
			return Restangular.all(ORG+'/public_letter_template/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendlettertemplateList: function(){
			return Restangular.all(ORG+'/public_letter_template/items').getList({len:-1});
		},
		getlettertemplateList: function(){
			return Restangular.all(ORG+'/public_letter_template/items').getList();
		},
		getlettertemplate: function(uid){
			return Restangular.one(ORG+'/public_letter_template/items/'+uid).get();
		},
		savelettertemplate: function(data){
			return Restangular.all(ORG+'/public_letter_template/items').post(data);
		},
		updatelettertemplate: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/public_letter_template/items/'+uid).post(data);
		},
		deletelettertemplate: function(uid){
			return Restangular.one(ORG+'/public_letter_template/items/'+uid).remove();
		},
		searchlettertemplate: function(query, startPage, pageLen){
			return Restangular.all(ORG+'/public_letter_template/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		}	
	}
	
}]);