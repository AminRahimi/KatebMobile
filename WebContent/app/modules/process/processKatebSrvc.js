angular.module('processModule').factory('processKatebSrvc', function(Restangular, $rootScope) {

	this.orgLetterStateData = undefined;
	this.searchQuery = undefined;
	this.OnCheckedItemCb = undefined;
	var that = this;
	this.processState = {
		visibleHeaders: [],
		taskType: "",
		filter: {},
		currentPage: 1
	};
	this.currentPage = 1;

	return {
		current: 1,
		saveDraft: function(data) {
			return Restangular.all('letter_draft/items').post(data);
		},
		getDraft: function(uid) {
			return Restangular.one('letter_draft/items/' + uid).get();
		},
		updateDraft: function(data) {
			var uid = data.uid;
			if(uid){
				return Restangular.all('letter_draft/items/' + uid).post(data);
			}else{
				return Restangular.all('letter_draft/items/').post(data);
			}
		},
		deleteDraft: function(uid) {
			return Restangular.one('letter_draft/items/' + uid).remove();
		},
		sendDraft: function(data) {
			return Restangular.all('letter_draft/send').post(data);
		},
		transferDraft: function(draft, userUid, text) {
			return Restangular.all('letter_draft/move_to/' + userUid + '?text=' + text).post(draft);
		},
		getLetterPdf: function(data) {
			return Restangular.all('letter_draft/pdf').post(data);
		},
		checkSignatureAccess: function(orgUid, senderUid){
			return Restangular.one('org/' + orgUid + '/pua/authorized_to_sign/' + senderUid).get();
		},
		getDraftHistory: function (draftUid, start, len) {
        	return Restangular.all('letter_draft/history/'+draftUid).getList({start:start,len:len,extent:'full'});;
        },

		/* ***************************************************************************** */
		getOrgLetterList: function(orgUid, start, len){
			return Restangular.all('/org/' + orgUid +'/all_letters').getList({start:start,len:len,extent:'list'});
		},
		searchOrgLetterListQueryParam: function(orgUid, start, len, params){
			// var query = _.assign({start:start,len:len,extent:'full'}, params);
			if(_.isObject(params))
				params = "";
			else
				params = "&"+params;
			return Restangular.one('/org/' + orgUid +'/all_letters?start='+start+"&len="+len+"&extent=list"+params).get();
		},
		searchOrgLetterList: function(orgUid, query, start, len){
			return Restangular.all('/org/' + orgUid +'/all_letters').customPOST(query,'',
					{start:start,len:len,extent:'list'},{'X-HTTP-Method-Override':'GET'});
		},

//********* search Query ********//
		setSearchQeury: function(data, pagination){
			if(data) {
				if(this.searchQuery) {
					this.searchQuery.letterNumber = data.number;
					this.searchQuery.sender = data.sender;
					this.searchQuery.subject = data.subject;
					this.searchQuery.externalNumber = data.externalNumber;
				} else{
					this.searchQuery = {
						letterNumber: data.number,
						sender: data.sender,
						subject: data.subject,
						externalNumber: data.externalNumber
					}
				}
			}
			if(pagination) {
				if(this.searchQuery) {
					this.searchQuery.pagination = pagination;
				} else {
					this.searchQuery = {
						pagination: pagination
					}
				}
			}
		},
		getSearchQeury: function(){
			return this.searchQuery;
		},
		resetSearchQuery: function () {
			this.searchQuery = undefined;
		},



		/* ************************************** LETTER *************************************** */
		getLetter: function(uid) {
			return Restangular.one('letter/lpa/'+uid).get();
		},
        sendForward: function (uid, data) {
            return Restangular.all('letter/forward/' + uid).post(data);
        },
		forwardLetterToMultiple: function (lpauid, data) {
			return Restangular.all('letter/forward/'+lpauid).post(data);
		},
        getLetterForwardTree: function (letterUid, param) {
        	var query = letterUid;
        	if(param){
        		query += param;
        	}
        	return Restangular.one('letter/forward_tree/'+ query).get();
        },
        forwardComment: function (uid, respond) {
        	var query = 'letter/respond/'+uid+'?respond='+respond;
        	return Restangular.all(query).post();
        },
		getRelatedLettereList: function (letterUid, type) {
			return Restangular.all('letter/related/'+letterUid).getList({type: type});
		},

        /* ***************************************************************************** */
        getOrgLetter: function(uid){
			return Restangular.one('/letter/items/' + uid).get();
		},

		/* ***************************************************************************** */
		getPuaList: function(query){
			return Restangular.all('org/current/letter_deliveres').getList({showExternalPosition: true, query: query, len:20});
		},
		getPuaListSEPFalse: function(query){
			return Restangular.all('org/current/letter_deliveres').getList({showExternalPosition: false, query: query, len:20});
		},
		getLetterLayoutList: function(orgUid){
			return Restangular.all('/org/'+orgUid+'/letter_layout/items').getList({extent:'full'});
		},
		getSecretariatList: function(orgUid){
			return Restangular.all('/org/'+orgUid+'/secretariat/items').getList();
		},
		getSenderList: function(){
			return Restangular.all('/org/current/letter_initiation/senders').getList();
		},
		getUserList: function(orgUid){
			return Restangular.all('/org/'+ orgUid + '/user/actives').getList();
		},
		openPDFModal:function(letterUid,isPrintWithSignature,isPrintWithHeader, indecatorNumber, deliverCC, deliverBCC){
			window.open("api/letter/pdf/"+letterUid +"?signature="+isPrintWithSignature+"&header="+isPrintWithHeader+"&indicatorNumber="+indecatorNumber+"&delivery_cc="+deliverCC+"&delivery_bcc="+deliverBCC+"&print=true");
		},
//******** TEMPLATE **********//
		//TODO: remove this tow service
		getLetterTemplateList: function(orgUid){
			return Restangular.all('/org/'+orgUid+'/letter_template/items/').getList();
		},
		getLetterTemplate: function(orgUid, templateId){
			return Restangular.one('/org/'+orgUid+'/letter_template/items/'+templateId).get();
		},

		getTemplate: function (letterTemplateUid) {
			return Restangular.one('letter_template/items/'+letterTemplateUid).get();
		},
		savePrivateLetterTemplate: function (data) {
			return Restangular.all('private_letter_template/items').post(data);
		},
		savePublicLetterTemplate: function (data, orgUID) {
			return Restangular.all('org/'+orgUID+'/public_letter_template/items').post(data);
		},

		getFullhameshhotkeyList: function(){
			return Restangular.all('hamesh_hotkey/actives').getList({extent:"full"});
		},

		// mediator between processListDirective and processCtrl
		registerOnCheckedItemCb: function (cb) {
			this.OnCheckedItemCb = cb;
		},
		onprocessListItemChecked: function (checkedItem) {
			if(_.isFunction(this.OnCheckedItemCb)){
				this.OnCheckedItemCb(checkedItem);
			}
		},
		removeTag: function (data) {
			return Restangular.one('letter').post('remove_tags',data);
		},
		getGroupMember: function (uid) {
			return Restangular.one('group/items/' + uid).get();
		},

//***************** process ACTIONBAR **************//
		setprocessState: function (states) {
			that.processState = angular.copy(states);
		},
		getprocessState: function () {
			return that.processState;
		},
		setCurrentPage: function (pageNum) {
			that.currentPage = pageNum;
		},
		getCurrentPage: function () {
			return that.currentPage;
		},
		//*********** PROCESS ***************//
		getAvailableProcessList: function () {
			return Restangular.all('vira_bpms/process/availables').getList();
		},
		saveProcessInfo: function (data) {
			return Restangular.all('vira_bpms/process/start').post(data);
		},
		getProcessInfo: function (uid) {
			return Restangular.one('vira_bpms/process/item/' + uid).get();
		},
		getTaskInfo: function (uid) {
			return Restangular.one('vira_bpms/task/items/' + uid).get();
		},
		startProcess: function (uid, data) {
			console.log(data);
			return Restangular.all('vira_bpms/process/start/'+uid).post(data);
		},
		completeProcess: function (uid, data) {
			return Restangular.all('vira_bpms/task/complete/'+uid).post(data);
		},
		getAllLetterList: function (query) {
			return Restangular.all('/org/' + $rootScope.currentUserOrg.uid +'/all_letters').getList({query: query, extent: 'brief',sortNumber: 'asc',dateFrom:(new Date().getTime())-24*60*60*1000,dateTo:new Date().getTime()});
		},
		getBpmsProcessInstanceInfo: function (uid) {
			return Restangular.one('vira_bpms/process/instance/' + uid).get();
		},
		cancelProcess: function (uid) {
			return Restangular.one('vira_bpms/process/suspend/' + uid).get();
		},
		acitveProcess: function (uid) {
			return Restangular.one('vira_bpms/process/unsuspend/' + uid).get();
		},
		wordDownload: function (uid) {
			return Restangular.one('vira_bpms/process/word/' + uid).get();
		}
	}
});
