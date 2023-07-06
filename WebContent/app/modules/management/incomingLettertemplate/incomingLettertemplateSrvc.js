angular.module('incomingLettertemplateModule', []);
angular.module('incomingLettertemplateModule').factory('incomingLettertemplateSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';

	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFullincomingLettertemplateList: function(startPage, pageLen){
			return Restangular.all(ORG+'/incomming_letter_template/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendincomingLettertemplateList: function(){
			return Restangular.all(ORG+'/incomming_letter_template/items').getList({len:-1});
		},
		getincomingLettertemplateList: function(){
			return Restangular.all(ORG+'/incomming_letter_template/items').getList();
		},
		getincomingLettertemplate: function(uid){
			return Restangular.one(ORG+'/incomming_letter_template/items/'+uid).get();
		},
		saveincomingLettertemplate: function(data){
			return Restangular.all(ORG+'/incomming_letter_template/items').post(data);
		},
		updateincomingLettertemplate: function(data){
			var uid = data.uid;
			return Restangular.all(ORG+'/incomming_letter_template/items/'+uid).post(data);
		},
		deleteincomingLettertemplate: function(uid){
			return Restangular.one(ORG+'/incomming_letter_template/items/'+uid).remove();
		},
		searchincomingLettertemplate: function(query, startPage, pageLen){
			return Restangular.all(ORG+'/incomming_letter_template/items').customPOST(query,'',
				{start:startPage, len:pageLen, extent:'full'},{'X-HTTP-Method-Override':'GET'});
		}	
	}
	
}]);