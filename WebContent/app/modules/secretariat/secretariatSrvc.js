angular.module('secretariatModule').factory('secretariatSrvc', [ 'Restangular', '$q',
	/**
     * @memberOf secretariatModule
     * @ngdoc service
     * @name secretariatSrvc
     * @param {service} Restangular <a target="_blank" href="https://github.com/mgonto/restangular"> AngularJS service to handle Rest API Restful Resources properly and easily</a>
     * @param {service} $q angularJs service
     */
    function(Restangular, $q) {

	var SEC = function(secUid){
		return 'sec/'+secUid;
	}

	var SECRETARIAT = function(secUid){
		return 'secretariat/'+secUid;
	}

	var searchMode = false;
	var lastSearchQuery = {};
	var lastPage = 1;
	var backButton = undefined;

	return{
		getGetIncommingLetterTemplateList:function(){
			return Restangular.all('/incomming_letter_template/actives').getList();
		},
		getGetIncommingLetterTemplate:function(uid){
			return Restangular.one('/incomming_letter_template/items',uid).get();
		},
		getSideMenuSecretariat: function(){
			return Restangular.all('/org/current/secretariat/availables').getList();
		},

		setFeatureList: function (features) {
			this.featureList = {};
			var that = this;
			features.forEach(function (item) {
				that.featureList[item.uid] = item.features;
			});
		},
		getFeatureList: function (secUid) {
			return this.featureList[secUid];
		},

		/* ***************************************************************************** */
		getIncomingList: function(secUid, start, len){
			return Restangular.all(SEC(secUid) + '/incoming/draft/current_user').getList({
				start:start, len:len, extent:"full"
			});
		},
		getIncoming: function(secUid, incUid){
			return Restangular.one(SEC(secUid) + '/incoming/draft/items/' + incUid).get();
		},
		saveIncoming: function(secUid, data){
			return Restangular.all(SEC(secUid) + '/incoming/draft/items').post(data);
		},
        deleteIncoming: function(secUid, incUid, isReturnedDispatch){
			return Restangular.one(SEC(secUid) + '/incoming/draft/items/' + incUid).remove({isReturnedDispatch: isReturnedDispatch});
		},
		editDispatches: function (type, uid, courierName, description, boxNumber, postalCode) {
			if(type == 'COURIER')
			{
				return Restangular.all('/dispatch/'+uid).post({"courierName":courierName,"description":description});
			}
			if (type == 'POST') {
				return Restangular.all('/dispatch/'+uid).post({"boxNumber":boxNumber,"postalCode":postalCode,"description":description});
			}
		},
		updateIncoming: function(secUid, data){
			var incUid = data.uid;
			return Restangular.all(SEC(secUid) + '/incoming/draft/items/' + incUid).post(data);
		},
		sendIncoming: function(secUid, data){
			return Restangular.all(SEC(secUid) + '/incoming/draft/send').post(data);
		},


		/* ***************************************************************************** */
		getIssuedList: function(secUid, start, len, isReturnedDispatch){
			return Restangular.all(SEC(secUid) + '/issued/draft/items').getList({
				start:start, len:len, extent:"full", isReturnedDispatch: isReturnedDispatch
			});
		},
		getIssued: function(secUid, incUid){
			return Restangular.one(SEC(secUid) + '/issued/draft/items/' + incUid).get();
		},
		saveIssued: function(secUid, data){
            deliveryUid = angular.copy(data.deliveryUid);
            delete data.deliveryUid;
            return Restangular.all(SEC(secUid) + '/issued/draft/send/'+ deliveryUid).post(data);
		},
		sendIssued: function(secUid, data){
			return Restangular.all(SEC(secUid) + '/issued/send').post(data);
		},
		getIssuedIndicatorBookList: function(secUid){
			return Restangular.all('/sec/' + secUid +'/indicator_book/issueds/').getList();
		},
        searchsearchIssuedDraftListQueryParam: function(secUid, start, len, params){
			var query = _.assign({start:start, len:len, extent:"full"}, params);
            return Restangular.all(SEC(secUid) + '/issued/draft/items').getList(query);
		},
		
        searchIssuedDraftList: function(secUid, query, start, len){
            return Restangular.all(SEC(secUid) + '/issued/draft/items').customPOST(query,'',
                {start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
        },

		searchUnapprovedIncomingDraftListQueryParam: function(secUid, start, len, params){
			var query = _.assign({start:start, len:len, extent:"full"}, params);
			return Restangular.all(SEC(secUid) + '/incoming/draft/items').getList(query);
		},

		searchUnapprovedIncomingtList: function(secUid, query, start, len){
			return Restangular.all(SEC(secUid) + '/incoming/draft/items').customPOST(query,'',
				{start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},

		/**
         * @memberOf secretariatSrvc
         * @method followup customer letter
         * @param {string} uid section uid
         * @param {integer} start
         * @param {integer} len
         */
		getFollowupCustomerLetterList: function(secUid, start, len){
			return Restangular.all(SECRETARIAT(secUid) + '/tracking/letter/draft/items').getList({
				start:start, len:len, extent:"full"
			});
		},
		searchsearchFollowupCustomerLetterListQueryParam: function(secUid, start, len, params){
			var query = _.assign({start:start, len:len, extent:"full"}, params);
		    return Restangular.all(SECRETARIAT(secUid) + '/tracking/letter/draft/items').getList(query);
	    },
		searchFollowupCustomerLetterList: function(secUid, query, start, len){
			return Restangular.all(SECRETARIAT(secUid) + '/tracking/letter/draft/items').customPOST(query,'',
					{start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},


        /**
         * @memberOf secretariatSrvc
         * @method getIssuedLetterList
         * @param {string} uid section uid
         * @param {integer} start
         * @param {integer} len
         */
		getIssuedLetterList: function(secUid, start, len){
			return Restangular.all(SEC(secUid) + '/issued/letters').getList({
				start:start, len:len, extent:"full"
			});
		},
         searchsearchIssuedLetterListQueryParam: function(secUid, start, len, params){
         	var query = _.assign({start:start, len:len, extent:"full"}, params);
			return Restangular.all(SEC(secUid) + '/issued/letters').getList(query);
		},
		searchIssuedLetterList: function(secUid, query, start, len){
			return Restangular.all(SEC(secUid) + '/issued/letters').customPOST(query,'',
					{start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},

        /**
         * @memberOf secretariatSrvc
         * @method getIncommingLetterList
         * @param {string} uid section uid
         * @param {integer} start
         * @param {integer} len
         */
		getIncommingLetterList: function(secUid, start, len){
			return Restangular.all(SEC(secUid) + '/incoming/letters').getList({
				start:start, len:len, extent:"full"
			});
		},
		searchSecretariatUnapprovedIncomingList: function (secUid, start, len, params) {
			var query = _.assign({start:start, len:len, extent:"full"}, params);
			return Restangular.all(SEC(secUid) + '/incoming/draft/items').getList(query);
		},
        searchRejectedLetterListQueryParam: function(secUid, start, len, params){
            var query = _.assign({start:start, len:len, extent:"full", isReturnedDispatch:true}, params);
			return Restangular.all(SEC(secUid) + '/incoming/draft/items').getList(query);
		},
        searchIncommingLetterListQueryParam: function(secUid, start, len, params){
            var query = _.assign({start:start, len:len, extent:"full"}, params);
            return Restangular.all(SEC(secUid) + '/incoming/letters').getList(query);
        },
		searchIncommingLetterList: function(secUid, query, start, len){
			return Restangular.all(SEC(secUid) + '/incoming/letters').customPOST(query,'',
					{start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
		},


		/* ***************************************************************************** */
		getLetter: function(secUid,uid,letterType){
			if(letterType=="incoming"){
				return 	this.getIncommingLetter(secUid,uid);
			}else{
				return Restangular.one(SEC(secUid) + '/issued/draft/items/' + uid).get();
			}
		},
		getIncommingLetter: function(secUid,uid){
			return Restangular.one('/letter/items/' + uid).get();
		},

		/* ***************************************************************************** */
		getUnapprovedIncommingList: function(secUid, start, len){
			return Restangular.all(SEC(secUid) + '/incoming/draft/items').getList({
				start:start, len:len, extent:"full"
			});
		},

		/* ***************************************************************************** */
		getpositionUserAssignemtsList: function(query){
			query.len = -1;
			return Restangular.all('org/current/letter_deliveres').getList(query);
		},
		getPublicTagList: function(orgUid){
			return Restangular.all('/org/' + orgUid +'/public_tag/items?len=-1').getList();
		},
		searchPublicTagList: function(orgUid, query){
			return Restangular.all('/tag/actives/a').getList({query: query, public_only: true, len:10});
		},
		getIndicatorBookList: function(secUid){
			return Restangular.all('/sec/' + secUid +'/indicator_book/incomings').getList();
		},
		getExternalOrganizationList: function(orgUid){
			return Restangular.all('organization/externals').getList({len:-1});
		},
		getSenderList: function(orgUid, externalOrgUid){
			return Restangular.all('/org/' + externalOrgUid + '/pua/externals').getList({len:-1});
		},
		getExternalOrganizationSecretariatList: function(orgUid){
			return Restangular.all('/external_organization/actives').getList({len:-1});
		},
		getSenderSecretariatList: function(orgUid, externalOrgUid){
			return Restangular.all('/external_organization/' + externalOrgUid + '/members').getList({len:-1});
		},
		getIssuedSenderList: function(){
			return Restangular.all('/org/current/letter_initiation/senders').getList();
		},
		getIssuedSenderSearchList: function(query){
			return Restangular.all('/org/current/letter_initiation/senders?query=' + query).getList({len: -1});
		},
		searchLetterByExternalnumber: function (externalNumber) {
			return Restangular.all('letter/search_by_externalnumber').getList({external_number:externalNumber});
		},
		getDstOrgList: function (query) {
			return Restangular.all( '/external_organization/eces?q=' + query).getList();
		},
		/* ***************************************************************************** */
		getAllLettersList: function(orgUid, start, len){
			return Restangular.all('/org/' + orgUid +'/all_letters').getList({start:start,len:len,extent:'list'});
		},
		searchAllLettersList: function(orgUid, query, start, len){
			return Restangular.all('/org/' + orgUid +'/all_letters').customPOST(query,'',
					{start:start,len:len,extent:'list'},{'X-HTTP-Method-Override':'GET'});
		},
		searchAllLettersListQueryParam: function(orgUid, start, len, params){
            var query = _.assign({start:start,len:len,extent:'list'}, params);
			return Restangular.all('/org/' + orgUid +'/all_letters').getList(query);
		},


		getExternalPosition: function(){
			return Restangular.all('/external_organization/' + externalOrgUid + '/members').getList({len:-1});
		},

		/***************************** Search Mode **********************************/
        setSearchMode: function (mode) {
            searchMode = mode;
        },
        getSearchMode: function () {
            return searchMode;
        },

		/******************************* Search Query ******************************/
        setLastSearchQuery: function (query) {
            lastSearchQuery = query;
        },
        getLastSearchQuery: function () {
            return lastSearchQuery;
        },

        setLastPage: function (pageNum) {
            lastPage = pageNum;
        },
        getLastPage: function () {
            return lastPage;
        },
		descriptionDropdownSrvc: function (letterUid, draft_uid, desc) {
			return Restangular.all('dispatch/set_returned/' + letterUid+"?draft_uid="+draft_uid).post(desc);
		},

		setBackButton: function (state) {
			backButton = state;
		},
		getBackButton: function () {
			return backButton;
		},
		checkUserIsLoginToGanjeh: function () {
			return Restangular.one("ganjeh/check_login").get();
		},
		moveFileToKateb: function (file) {
			file.name = file.name || file.title;
			return Restangular.one("ganjeh/move_to_kateb?node_uid=" + file.uid + "&name=" + file.name + "&extention=" + file.extension).get();
		},
	}

}]);
