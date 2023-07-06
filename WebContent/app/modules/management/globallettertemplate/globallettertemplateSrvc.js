angular.module('globallettertemplateModule', []);
angular.module('globallettertemplateModule').factory('globallettertemplateSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(){
			ORG = '';
		},
		getFullGlobalLetterTemplateList: function(startPage, pageLen){
			return Restangular.all(ORG+'/global_letter_template/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendgloballettertemplateList: function(){
			return Restangular.all(ORG+'/global_letter_template/items').getList({len:-1});
		},
		getgloballettertemplateList: function(){
			return Restangular.all(ORG+'/global_letter_template/items').getList();
		},
		getGlobalLetterTemplate: function(uid){
			return Restangular.one(ORG+'/global_letter_template/items/'+uid).get();
		},
		savegloballettertemplate: function(data){
			return Restangular.all(ORG+'/global_letter_template/items').post(data);
		},
		updategloballettertemplate: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/global_letter_template/items/'+uid).post(data);
		},
		deletegloballettertemplate: function(uid){
			return Restangular.one(ORG+'/global_letter_template/items/'+uid).remove();
		},
		searchGlobalLetterTemplate: function(query, startPage, pageLen){
			return Restangular.all(ORG+'/global_letter_template/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		}	
	}
	
}]);