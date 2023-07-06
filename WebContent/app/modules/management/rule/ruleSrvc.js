angular.module('ruleModule', []);
angular.module('ruleModule').factory('ruleSrvc', [ 'Restangular', '$q',
	function(Restangular, $q) {

	var ORG = '';
	
	return{
		setOrgUid: function(orgUid){
			ORG = 'org/'+orgUid;
		},
		getFullruleList: function(startPage, pageLen){
			return Restangular.all(ORG+'/letter_rule/items').getList(
					{start:startPage, len:pageLen, extent:"full"});
		},
		getExtendruleList: function(){
			return Restangular.all(ORG+'/letter_rule/items').getList({len:-1});
		},
		getruleList: function(){
			return Restangular.all(ORG+'/letter_rule/items').getList({len:-1});
		},
		// getruleList: function(){
		// 	return Restangular.all(ORG+'/letter_rule/update_priority').getList();
		// },
		getrule: function(uid){
			return Restangular.one(ORG+'/letter_rule/items/'+uid).get();
		},
		saverule: function(data){
			return Restangular.all(ORG+'/letter_rule/items').post(data);
		},
		// saverule: function(data){
		// 	return Restangular.all(ORG+'/letter_rule/update_priority').post(data);
		// },
		updaterule: function(data){
			var uid = data.uid;
			delete data.rulename;
			delete data.type;
			delete data.priority;
			// delete data.uid;
			return Restangular.all(ORG+'/letter_rule/items/'+uid).post(data);
		},
		deleterule: function(uid){
			return Restangular.one(ORG+'/letter_rule/items/'+uid).remove();
		},
		searchrule: function(query, start, len){
			return Restangular.all(ORG+'/letter_rule/items').customPOST(query,'',
					{start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},
		updateruleAuthentication: function (ruleUid, data) {
			return Restangular.all('rule_setting/items/'+ruleUid).post(data);
		},
		getruleAuthentication: function (ruleUid) {
			return Restangular.one('rule_setting/items/'+ruleUid).get();
		},
		getGroupList: function(){
			return Restangular.all(ORG+'/position/items').getList({len:-1});
		},
		updateSortedList: function (data) {
			return Restangular.all(ORG+'/letter_rule/update_priority').post(data);
		},
		getPositionType: function (typeKey) {
			var query =
			{
				"restrictions": [
					{
						"field": "typeKey",
						"value": typeKey,
						"type": "like"}

				]
			};
			return Restangular.all(ORG + '/position/items').customPOST(query, '',
				{extent: 'full'}, {'X-HTTP-Method-Override': 'GET'});
		}
		
	}
	
}]);